import { SubstrateBlock } from '@subql/types'
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
    const pools = await PoolService.getActivePools()
    for (const pool of pools) {
      await pool.updateState()
      await pool.updatePortfolioValuation()
      await pool.computePoolValue()
      await pool.resetDebtOverdue()

      // Update tranche states
      const tranches = await TrancheService.getActives(pool.id)
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
        const loan = await LoanService.getById(pool.id, loanId)
        await loan.updateActiveLoanData(activeLoanData[loanId])
        await loan.save()

        if (loan.actualMaturityDate < block.timestamp) await pool.increaseDebtOverdue(loan.outstandingDebt)
      }

      await pool.updateNumberOfActiveLoans(BigInt(Object.keys(activeLoanData).length))
      await pool.save()
    }

    //Perform Snapshots and reset accumulators
    await stateSnapshotter('Pool', 'PoolSnapshot', block, 'poolId', 'isActive', true)
    await stateSnapshotter('Tranche', 'TrancheSnapshot', block, 'trancheId', 'isActive', true)
    await stateSnapshotter('Loan', 'LoanSnapshot', block, 'loanId', 'isActive', true)

    //Update tracking of period and continue
    await (await timekeeper).update(blockPeriodStart)
  }
}
