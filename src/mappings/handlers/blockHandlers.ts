import { SubstrateBlock } from '@subql/types'
import { PoolState, PoolSnapshot, TrancheState, TrancheSnapshot, Timekeeper } from '../../types'
import { getPeriodStart, MemTimekeeper } from '../../helpers/timeKeeping'
import { errorHandler } from '../../helpers/errorHandler'
import { stateSnapshotter } from '../../helpers/stateSnapshot'
import { SNAPSHOT_INTERVAL_SECONDS } from '../../config'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'

const memTimekeeper = MemTimekeeper.init()

export const handleBlock = errorHandler(_handleBlock)
async function _handleBlock(block: SubstrateBlock): Promise<void> {
  const blockPeriodStart = getPeriodStart(block.timestamp)
  const blockNumber = block.block.header.number.toNumber()
  const newPeriod = (await memTimekeeper).processBlock(block)

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
      await pool.save()

      // Update tranche states
      const firstSnapshotDate = new Date(
        getPeriodStart(pool.pool.createdAt).valueOf() + SNAPSHOT_INTERVAL_SECONDS * 1000
      )
      const tranches = await TrancheService.getByPoolId(pool.pool.id)
      for (const tranche of tranches) {
        await tranche.updateSupply()
        await tranche.computeYield('yieldSinceLastPeriod', lastPeriodStart)
        await tranche.computeYield('yieldSinceInception', firstSnapshotDate)
        await tranche.computeYieldAnnualized('yield30DaysAnnualized', blockPeriodStart, daysAgo30)
        await tranche.computeYieldAnnualized('yield90DaysAnnualized', blockPeriodStart, daysAgo90)
        await tranche.save()
      }
    }

    //Perform Snapshots and reset
    await stateSnapshotter(PoolState, PoolSnapshot, block, 'poolId')
    await stateSnapshotter(TrancheState, TrancheSnapshot, block, 'trancheId')

    //Update Timekeeper
    const timekeeper = new Timekeeper('global')
    timekeeper.lastPeriodStart = blockPeriodStart
    await timekeeper.save()
  }
}
