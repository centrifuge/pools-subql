import { SubstrateBlock } from '@subql/types'
import { getPeriodStart, TimekeeperService } from '../../helpers/timekeeperService'
import { errorHandler } from '../../helpers/errorHandler'
import { substrateStateSnapshotter } from '../../helpers/stateSnapshot'
import { SNAPSHOT_INTERVAL_SECONDS } from '../../config'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { AssetService } from '../services/assetService'
import { PoolFeeService } from '../services/poolFeeService'
import { PoolFeeTransactionService } from '../services/poolFeeTransactionService'
import {
  Asset,
  AssetSnapshot,
  Pool,
  PoolFee,
  PoolFeeSnapshot,
  PoolSnapshot,
  Tranche,
  TrancheSnapshot,
} from '../../types/models'

const timekeeper = TimekeeperService.init()

export const handleBlock = errorHandler(_handleBlock)
async function _handleBlock(block: SubstrateBlock): Promise<void> {
  const blockPeriodStart = getPeriodStart(block.timestamp)
  const blockNumber = block.block.header.number.toNumber()
  const newPeriod = (await timekeeper).processBlock(block.timestamp)

  if (newPeriod) {
    const specVersion = api.runtimeVersion.specVersion.toNumber()
    logger.info(
      `It's a new period on block ${blockNumber}: ${block.timestamp.toISOString()} (specVersion: ${specVersion})`
    )
    const lastPeriodStart = new Date(blockPeriodStart.valueOf() - SNAPSHOT_INTERVAL_SECONDS * 1000)
    const daysAgo30 = new Date(blockPeriodStart.valueOf() - 30 * 24 * 3600 * 1000)
    const daysAgo90 = new Date(blockPeriodStart.valueOf() - 90 * 24 * 3600 * 1000)

    // Update Pool States
    const pools = await PoolService.getCfgActivePools()
    for (const pool of pools) {
      await pool.updateState()
      await pool.updatePortfolioValuation()
      await pool.computePoolValue()
      await pool.resetDebtOverdue()

      // Update tranche states
      const tranches = await TrancheService.getActivesByPoolId(pool.id)
      const trancheData = await pool.getTranches()
      const trancheTokenPrices = await pool.getTrancheTokenPrices()
      for (const tranche of tranches) {
        const index = tranche.index
        if (trancheTokenPrices !== undefined)
          await tranche.updatePrice(trancheTokenPrices[index].toBigInt(), block.block.header.number.toNumber())
        await tranche.updateSupply()
        await tranche.updateDebt(trancheData[tranche.trancheId].data.debt.toBigInt())
        await tranche.computeYield('yieldSinceLastPeriod', lastPeriodStart)
        await tranche.computeYield('yieldSinceInception')
        await tranche.computeYieldAnnualized('yield30DaysAnnualized', blockPeriodStart, daysAgo30)
        await tranche.computeYieldAnnualized('yield90DaysAnnualized', blockPeriodStart, daysAgo90)
        await tranche.save()
      }

      const activeLoanData = await pool.getPortfolio()
      for (const loanId in activeLoanData) {
        const loan = await AssetService.getById(pool.id, loanId)
        await loan.updateActiveAssetData(activeLoanData[loanId])
        await loan.save()

        if (loan.actualMaturityDate < block.timestamp) pool.increaseDebtOverdue(loan.outstandingDebt)
      }

      await pool.updateNumberOfActiveAssets(BigInt(Object.keys(activeLoanData).length))
      await pool.save()

      //PoolFees Accruals
      const accruedFees = await pool.getAccruedFees().catch((err) => {
        logger.error(err)
        return [] as [feeId: string, pending: bigint, disbursement: bigint][]
      })
      for (const accruals of accruedFees) {
        const [feeId, pending, disbursement] = accruals
        const poolFee = await PoolFeeService.getById(pool.id, feeId)
        await poolFee.updateAccruals(pending, disbursement)
        await poolFee.save()

        const poolFeeTransaction = PoolFeeTransactionService.accrue({
          poolId: pool.id,
          feeId,
          blockNumber,
          amount: poolFee.sumAccruedAmountByPeriod,
          epochNumber: pool.currentEpoch,
          hash: null,
          timestamp: block.timestamp,
        })
        await poolFeeTransaction.save()
      }
    }

    //Perform Snapshots and reset accumulators
    await substrateStateSnapshotter(Pool, PoolSnapshot, block, 'isActive', true, 'poolId')
    await substrateStateSnapshotter(Tranche, TrancheSnapshot, block, 'isActive', true, 'trancheId')
    await substrateStateSnapshotter(Asset, AssetSnapshot, block, 'isActive', true, 'assetId')
    await substrateStateSnapshotter(PoolFee, PoolFeeSnapshot, block, 'isActive', true, 'poolFeeId')

    //Update tracking of period and continue
    await (await timekeeper).update(blockPeriodStart)
  }
}
