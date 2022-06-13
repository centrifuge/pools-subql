import { SubstrateBlock } from '@subql/types'
import { PoolState, PoolSnapshot, TrancheState, TrancheSnapshot, Timekeeper, Pool, Tranche } from '../types'
import { getPeriodStart, MemTimekeeper } from '../helpers/timeKeeping'
import { errorHandler } from '../helpers/errorHandler'
import { stateSnapshotter } from '../helpers/stateSnapshot'
import { updatePoolNav, updatePoolState } from './pools'
import { computeAnnualizedTrancheYield, computeTrancheYield, updateTranchePrice, updateTrancheSupply } from './tranches'
import { SNAPSHOT_INTERVAL_SECONDS } from '../config'

const memTimekeeper = initialiseMemTimekeeper()

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
    const pools = await Pool.getByType('ALL')
    for (const pool of pools) {
      await updatePoolState(pool.id)
      await updatePoolNav(pool.id)

      // Update tranche states
      const firstSnapshotDate = new Date(getPeriodStart(pool.createdAt).valueOf() + SNAPSHOT_INTERVAL_SECONDS * 1000)
      const tranches = await Tranche.getByPoolId(pool.id)
      for (const tranche of tranches) {
        await updateTranchePrice(pool.id, tranche.trancheId, pool.currentEpoch)
        await updateTrancheSupply(pool.id, tranche.trancheId)
        await computeTrancheYield(pool.id, tranche.trancheId, 'yieldSinceLastPeriod', lastPeriodStart)
        await computeTrancheYield(pool.id, tranche.trancheId, 'yieldSinceInception', firstSnapshotDate)
        await computeAnnualizedTrancheYield(
          pool.id,
          tranche.trancheId,
          'yield30DaysAnnualized',
          blockPeriodStart,
          daysAgo30
        )
        await computeAnnualizedTrancheYield(
          pool.id,
          tranche.trancheId,
          'yield90DaysAnnualized',
          blockPeriodStart,
          daysAgo90
        )
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

async function initialiseMemTimekeeper(): Promise<MemTimekeeper> {
  let lastPeriodStart: Date
  try {
    lastPeriodStart = (await Timekeeper.get('global')).lastPeriodStart
  } catch (error) {
    lastPeriodStart = new Date(0)
  }
  return new MemTimekeeper(lastPeriodStart)
}
