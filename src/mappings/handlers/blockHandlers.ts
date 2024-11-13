import { SubstrateBlock } from '@subql/types'
import { getPeriodStart, TimekeeperService } from '../../helpers/timekeeperService'
import { errorHandler } from '../../helpers/errorHandler'
import { statesSnapshotter } from '../../helpers/stateSnapshot'
import { SNAPSHOT_INTERVAL_SECONDS } from '../../config'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { AssetService } from '../services/assetService'
import { PoolFeeService } from '../services/poolFeeService'
import { PoolFeeTransactionService } from '../services/poolFeeTransactionService'
import { AssetSnapshot, PoolFeeSnapshot, PoolSnapshot, TrancheSnapshot } from '../../types/models'
import { AssetPositionService } from '../services/assetPositionService'
import { EpochService } from '../services/epochService'
import { SnapshotPeriodService } from '../services/snapshotPeriodService'
import { TrancheBalanceService } from '../services/trancheBalanceService'
import { InvestorPositionService } from '../services/investorPositionService'

const timekeeper = TimekeeperService.init()

export const handleBlock = errorHandler(_handleBlock)
async function _handleBlock(block: SubstrateBlock): Promise<void> {
  if (!block.timestamp) throw new Error('Missing block timestamp')

  const blockPeriodStart = getPeriodStart(block.timestamp)
  const blockNumber = block.block.header.number.toNumber()
  const newPeriod = (await timekeeper).processBlock(block.timestamp)

  if (newPeriod) {
    const specVersion = api.runtimeVersion.specVersion.toNumber()
    logger.info(
      `# It's a new period on block ${blockNumber}: ${block.timestamp.toISOString()} (specVersion: ${specVersion})`
    )

    const period = SnapshotPeriodService.init(blockPeriodStart)
    await period.save()

    const lastPeriodStart = new Date(period.start.valueOf() - SNAPSHOT_INTERVAL_SECONDS * 1000)
    const daysAgo7 = new Date(period.start.valueOf() - 7 * 24 * 3600 * 1000)
    const daysAgo30 = new Date(period.start.valueOf() - 30 * 24 * 3600 * 1000)
    const daysAgo90 = new Date(period.start.valueOf() - 90 * 24 * 3600 * 1000)
    const beginningOfMonth = new Date(period.year, period.month, 1)
    const quarter = Math.floor(period.month / 3)
    const beginningOfQuarter = new Date(period.year, quarter * 3, 1)
    const beginningOfYear = new Date(period.year, 0, 1)

    const poolsToSnapshot: PoolService[] = []
    const tranchesToSnapshot: TrancheService[] = []
    const assetsToSnapshot: AssetService[] = []
    const poolFeesToSnapshot: PoolFeeService[] = []

    // Update Pool States
    const pools = await PoolService.getCfgActivePools()
    for (const pool of pools) {
      logger.info(` ## Updating pool ${pool.id} states...`)
      if (!pool.currentEpoch) throw new Error('Pool currentEpoch not set')
      const currentEpoch = await EpochService.getById(pool.id, pool.currentEpoch)
      if (!currentEpoch) throw new Error(`Current epoch ${pool.currentEpoch} for pool ${pool.id} not found`)
      await pool.updateState()
      await pool.resetDebtOverdue()

      // Update tranche states
      const tranches = await TrancheService.getActivesByPoolId(pool.id)
      const trancheData = await pool.getTranches()
      const trancheTokenPrices = await pool.getTrancheTokenPrices()
      for (const tranche of tranches) {
        if (typeof tranche.index !== 'number') throw new Error('Tranche index not set')
        if (!trancheTokenPrices) break
        await tranche.updatePrice(trancheTokenPrices[tranche.index].toBigInt(), block.block.header.number.toNumber())
        await tranche.updateSupply()
        await tranche.updateDebt(trancheData[tranche.trancheId].debt)
        await tranche.computeYield('yieldSinceLastPeriod', lastPeriodStart)
        await tranche.computeYield('yieldSinceInception')
        await tranche.computeYield('yieldYTD', beginningOfYear)
        await tranche.computeYield('yieldQTD', beginningOfQuarter)
        await tranche.computeYield('yieldMTD', beginningOfMonth)
        await tranche.computeYieldAnnualized('yield7DaysAnnualized', period.start, daysAgo7)
        await tranche.computeYieldAnnualized('yield30DaysAnnualized', period.start, daysAgo30)
        await tranche.computeYieldAnnualized('yield90DaysAnnualized', period.start, daysAgo90)
        await tranche.save()
        tranchesToSnapshot.push(tranche)

        // Compute TrancheBalances Unrealized Profit
        const trancheBalances = (await TrancheBalanceService.getByTrancheId(tranche.id, {
          limit: 100,
        })) as TrancheBalanceService[]
        for (const trancheBalance of trancheBalances) {
          if (!tranche.tokenPrice) throw new Error('Tranche token price not set')
          const unrealizedProfit = await InvestorPositionService.computeUnrealizedProfitAtPrice(
            trancheBalance.accountId,
            tranche.id,
            tranche.tokenPrice
          )
          await trancheBalance.updateUnrealizedProfit(unrealizedProfit)
          await trancheBalance.save()
        }
      }
      // Asset operations
      const activeLoanData = await pool.getPortfolio()
      pool.resetOffchainCashValue()
      pool.resetUnrealizedProfit()
      for (const loanId in activeLoanData) {
        const asset = await AssetService.getById(pool.id, loanId)
        if (!asset) continue
        if (!asset.currentPrice) throw new Error('Asset current price not set')
        if (!asset.notional) throw new Error('Asset notional not set')
        await asset.loadSnapshot(lastPeriodStart)
        await asset.updateActiveAssetData(activeLoanData[loanId])
        await asset.updateUnrealizedProfit(
          await AssetPositionService.computeUnrealizedProfitAtPrice(asset.id, asset.currentPrice),
          await AssetPositionService.computeUnrealizedProfitAtPrice(asset.id, asset.notional)
        )
        await asset.save()
        assetsToSnapshot.push(asset)

        if (typeof asset.interestAccruedByPeriod !== 'bigint')
          throw new Error('Asset interest accrued by period not set')
        await pool.increaseInterestAccrued(asset.interestAccruedByPeriod)

        if (asset.isNonCash()) {
          if (typeof asset.unrealizedProfitAtMarketPrice !== 'bigint')
            throw new Error('Asset unrealized profit at market price not set')
          if (typeof asset.unrealizedProfitAtNotional !== 'bigint')
            throw new Error('Asset unrealized profit at notional not set')
          if (typeof asset.unrealizedProfitByPeriod !== 'bigint')
            throw new Error('Asset unrealized profit by period not set')
          pool.increaseUnrealizedProfit(
            asset.unrealizedProfitAtMarketPrice,
            asset.unrealizedProfitAtNotional,
            asset.unrealizedProfitByPeriod
          )
        }
        if (asset.isBeyondMaturity(block.timestamp)) {
          if (typeof asset.outstandingDebt !== 'bigint') throw new Error('Asset outstanding debt not set')
          pool.increaseDebtOverdue(asset.outstandingDebt)
        }
        if (asset.isOffchainCash()) {
          if (typeof asset.presentValue !== 'bigint') throw new Error('Asset present value not set')
          pool.increaseOffchainCashValue(asset.presentValue)
        }
      }
      await pool.updateNumberOfActiveAssets(BigInt(Object.keys(activeLoanData).length))

      // NAV update requires updated offchain cash value
      await pool.updateNAV()

      //PoolFees operations
      const accruedFees = await pool.getAccruedFees()
      for (const accruals of accruedFees) {
        const [feeId, pending, disbursement] = accruals
        const poolFee = await PoolFeeService.getById(pool.id, feeId)
        if (!poolFee) {
          logger.error(`Unable to retrieve PoolFee ${pool.id}-${feeId}, skipping accruals!`)
          continue
        }
        await poolFee.updateAccruals(pending, disbursement)
        await poolFee.save()
        poolFeesToSnapshot.push(poolFee)

        if (typeof poolFee.sumAccruedAmountByPeriod !== 'bigint')
          throw new Error('Pool fee sum accrued amount by period not set')
        await pool.increaseAccruedFees(poolFee.sumAccruedAmountByPeriod)

        const poolFeeTransaction = PoolFeeTransactionService.accrue({
          poolId: pool.id,
          feeId,
          blockNumber,
          amount: poolFee.sumAccruedAmountByPeriod,
          epochId: currentEpoch.id,
          hash: block.hash.toHex(),
          timestamp: block.timestamp,
        })
        await poolFeeTransaction.save()
      }
      const sumPoolFeesPendingAmount = await PoolFeeService.computeSumPendingFees(pool.id)
      await pool.updateSumPoolFeesPendingAmount(sumPoolFeesPendingAmount)
      await pool.save()
      poolsToSnapshot.push(pool)
      logger.info(`## Pool ${pool.id} states update completed!`)
    }

    logger.info('## Performing snapshots...')
    const blockInfo = { number: block.block.header.number.toNumber(), timestamp: block.timestamp }
    await statesSnapshotter('periodId', period.id, pools, PoolSnapshot, blockInfo, 'poolId')
    await statesSnapshotter('periodId', period.id, tranchesToSnapshot, TrancheSnapshot, blockInfo, 'trancheId')
    await statesSnapshotter('periodId', period.id, assetsToSnapshot, AssetSnapshot, blockInfo, 'assetId')
    await statesSnapshotter('periodId', period.id, poolFeesToSnapshot, PoolFeeSnapshot, blockInfo, 'poolFeeId')
    logger.info('## Snapshotting completed!')

    //Update tracking of period and continue
    await (await timekeeper).update(period.start)
  }
}
