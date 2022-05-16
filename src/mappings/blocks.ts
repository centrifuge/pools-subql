import { SubstrateBlock } from '@subql/types'
import { Pool, PoolState, PoolSnapshot, Tranche, TrancheState, TrancheSnapshot, Timekeeper } from '../types'
import { getPeriodStart, MemTimekeeper } from '../helpers/timeKeeping'
import { errorHandler } from '../helpers/errorHandler'
import { stateSnapshotter } from '../helpers/stateSnapshot'

const memTimekeeper = initialiseMemTimekeeper()

export const handleBlock = errorHandler(_handleBlock)
async function _handleBlock(block: SubstrateBlock): Promise<void> {
  const blockPeriodStart = getPeriodStart(block.timestamp)
  const blockHeight = block.block.header.number.toNumber()
  const newPeriod = (await memTimekeeper).processBlock(block)

  if (newPeriod) {
    logger.info(`It's a new period on block ${blockHeight}: ${block.timestamp.toISOString()}`)

    // Populate State Updates
    const poolStates = await PoolState.getByType('ALL')
    poolStates.forEach(async (poolState) => {
      const poolData = (<any>await api.query.pools.pool(poolState.id)).unwrap()
      const navData = (<any>await api.query.loans.poolNAV(poolState.id)).unwrap()

      poolState.netAssetValue = navData ? navData.latestNav.toBigInt() : BigInt(0)
      poolState.totalReserve = poolData.reserve.total.toBigInt() ?? BigInt(0)
      poolState.availableReserve = poolData.reserve.available.toBigInt() ?? BigInt(0)
      poolState.maxReserve = poolData.reserve.max.toBigInt() ?? BigInt(0)

      await poolState.save()
    })

    //Perform Snapshots
    await stateSnapshotter(PoolState, PoolSnapshot, block, 'poolId')
    await stateSnapshotter(TrancheState, TrancheSnapshot, block, 'trancheId')

    //Reset accumulted states to 0

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
