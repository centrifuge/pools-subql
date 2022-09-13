import { SubstrateBlock } from '@subql/types'
import { PoolState, PoolSnapshot, TrancheState, TrancheSnapshot } from '../../types'
import { getPeriodStart, TimekeeperService } from '../../helpers/timekeeperService'
import { errorHandler } from '../../helpers/errorHandler'
import { stateSnapshotter } from '../../helpers/stateSnapshot'
import { SNAPSHOT_INTERVAL_SECONDS } from '../../config'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'

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

      const { ids, tranches: trancheData } = pool.tranches
      const tokenPrices = await pool.getTrancheTokenPrices()

      // Update tranche states
      const trancheIds = ids.map((id) => id.toHex())
      const tranches = await TrancheService.getByPoolId(pool.pool.id)
      for (const tranche of tranches) {
        const trancheIndex = trancheIds.findIndex((trancheId) => tranche.tranche.trancheId === trancheId)
        if (trancheIndex === -1) throw new Error(`Could not find TrancheDetails for tranche :${tranche.tranche.id}`)
        await tranche.updatePrice(tokenPrices[trancheIndex].toBigInt())
        await tranche.updateSupply()
        await tranche.updateDebt(trancheData[trancheIndex].debt.toBigInt())
        await tranche.computeYield('yieldSinceLastPeriod', lastPeriodStart)
        await tranche.computeYield('yieldSinceInception')
        await tranche.computeYieldAnnualized('yield30DaysAnnualized', blockPeriodStart, daysAgo30)
        await tranche.computeYieldAnnualized('yield90DaysAnnualized', blockPeriodStart, daysAgo90)
        await tranche.save()
      }
    }

    //Perform Snapshots and reset accumulators
    await stateSnapshotter(PoolState, PoolSnapshot, block, 'poolId')
    await stateSnapshotter(TrancheState, TrancheSnapshot, block, 'trancheId')

    //Update tracking of period and continue
    await (await timekeeper).update(blockPeriodStart)
  }
}
