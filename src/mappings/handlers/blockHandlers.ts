import { SubstrateBlock } from '@subql/types'
import { PoolState, PoolSnapshot, TrancheState, TrancheSnapshot, LoanState, LoanSnapshot } from '../../types'
import { getPeriodStart, TimekeeperService } from '../../helpers/timekeeperService'
import { errorHandler } from '../../helpers/errorHandler'
import { stateSnapshotter } from '../../helpers/stateSnapshot'
import { SNAPSHOT_INTERVAL_SECONDS } from '../../config'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { LoanService } from '../services/loanService'

const timekeeper = TimekeeperService.init()

export const handleBlock = errorHandler(_handleBlock)
async function _handleBlock(block: SubstrateBlock): Promise<void> {
  const blockPeriodStart = getPeriodStart(block.timestamp)
  const blockNumber = block.block.header.number.toNumber()
  const newPeriod = (await timekeeper).processBlock(block)

  if (newPeriod) {
    logger.info(`It's a new period on block ${blockNumber}: ${block.timestamp.toISOString()}`)
    const lastPeriodStart = new Date(blockPeriodStart.valueOf() - SNAPSHOT_INTERVAL_SECONDS * 1000)
    const daysAgo30 = new Date(blockPeriodStart.valueOf() - 30 * 24 * 3600 * 1000)
    const daysAgo90 = new Date(blockPeriodStart.valueOf() - 90 * 24 * 3600 * 1000)

    // Update Pool States
    const pools = await PoolService.getAll()
    for (const pool of pools) {
      await pool.updateState()
      await pool.updateNav()
      await pool.computePoolValue()
      await pool.save()

      // Update tranche states
      const tranches = await TrancheService.getActives(pool.pool.id)
      const trancheData = await pool.getTranches()
      const trancheTokenPrices = await pool.getTrancheTokenPrices()
      for (const tranche of tranches) {
        const index = tranche.tranche.index
        if (trancheTokenPrices !== undefined) await tranche.updatePrice(trancheTokenPrices[index].toBigInt())
        await tranche.updateSupply()
        await tranche.updateDebt(trancheData[tranche.tranche.trancheId].data.debt.toBigInt())
        await tranche.computeYield('yieldSinceLastPeriod', lastPeriodStart)
        await tranche.computeYield('yieldSinceInception')
        await tranche.computeYieldAnnualized('yield30DaysAnnualized', blockPeriodStart, daysAgo30)
        await tranche.computeYieldAnnualized('yield90DaysAnnualized', blockPeriodStart, daysAgo90)
        await tranche.save()
      }

      // Update loans outstanding debt
      const activeLoanData = await pool.getActiveLoanData()
      for (const loanId in activeLoanData) {
        const loan = await LoanService.getById(pool.pool.id, loanId)
        const { normalizedDebt, interestRate } = activeLoanData[loanId]
        await loan.updateOutstandingDebt(normalizedDebt, interestRate)
        await loan.save()
      }
    }

    //Perform Snapshots and reset accumulators
    await stateSnapshotter(PoolState, PoolSnapshot, block, 'poolId')
    await stateSnapshotter(TrancheState, TrancheSnapshot, block, 'trancheId', 'Active', true)
    await stateSnapshotter(LoanState, LoanSnapshot, block, 'loanId', 'Status', 'ACTIVE')

    //Update tracking of period and continue
    await (await timekeeper).update(blockPeriodStart)
  }
}
