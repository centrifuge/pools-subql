import { SubstrateBlock } from '@subql/types'
import { PoolState, PoolSnapshot, Tranche, TrancheState, TrancheSnapshot, Timekeeper } from '../types'
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
      const poolResponse = <any>await api.query.pools.pool(poolState.id)
      if (poolResponse.isSome) {
        const poolData = poolResponse.unwrap()
        poolState.totalReserve = poolData.reserve.total.toBigInt()
        poolState.availableReserve = poolData.reserve.available.toBigInt()
        poolState.maxReserve = poolData.reserve.max.toBigInt()
      }

      const navResponse = <any>await api.query.loans.poolNAV(poolState.id)
      if (navResponse.isSome) {
        const navData = navResponse.unwrap()
        poolState.netAssetValue = navData.latest.toBigInt()
      }

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
