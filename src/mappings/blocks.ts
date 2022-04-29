import { SubstrateBlock } from '@subql/types'
import { Pool, PoolState, PoolSnapshot, Tranche, TrancheState, TrancheSnapshot, Timekeeper } from '../types'
import { PoolData, PoolNavData } from '../helpers/types'
import { getPeriodStart, MemTimekeeper } from '../helpers/timeKeeping'
import { errorHandler } from '../helpers/errorHandler'

const memTimekeeper = initialiseMemTimekeeper()

export const handleBlock = errorHandler(_handleBlock)
async function _handleBlock(block: SubstrateBlock): Promise<void> {
  const blockPeriodStart = getPeriodStart(block.timestamp)
  const blockHeight = block.block.header.number.toNumber()
  const newPeriod = (await memTimekeeper).processBlock(block)
  
  if (newPeriod) {
    logger.info(`It's a new period on block ${blockHeight}: ${block.timestamp.toISOString()}`)
    // CREATE SNAPSHOTS OF POOL STATES
    const pools = await Pool.getByType('POOL')
    for (let pool of pools) {
      const poolResponse = await api.query.pools.pool(pool.id)
      const poolData = poolResponse.toJSON() as any as PoolData
      //logger.info(`PoolData: ${poolResponse.toString()}`)

      const poolNavResponse = await api.query.loans.poolNAV(pool.id)
      const navData = poolNavResponse.toJSON() as any as PoolNavData
      //logger.info(`NAVData: ${poolNavResponse.toString()}`)

      const poolState = await PoolState.get(pool.id)
      poolState.netAssetValue = BigInt(navData ? navData.latestNav : 0)
      poolState.totalReserve = BigInt(poolData.totalReserve ?? 0)
      poolState.availableReserve = BigInt(poolData.availableReserve ?? 0)
      poolState.maxReserve = BigInt(poolData.maxReserve ?? 0)
      await poolState.save()

      const {id, ...copyPoolState} = poolState
      const poolSnapshot = new PoolSnapshot(`${pool.id.toString()}-${blockHeight.toString()}`)
      Object.assign(poolSnapshot, copyPoolState)
      
      poolSnapshot.poolId = pool.id
      poolSnapshot.timestamp = block.timestamp
      poolSnapshot.blockHeight = blockHeight
      await poolSnapshot.save()

      const tranches = await Tranche.getByPoolId(pool.id)
      for (const tranche of tranches) {
        const trancheState = await TrancheState.get(tranche.id)
        const trancheData = poolData.tranches[tranche.trancheId]
        trancheState.outstandingInvestOrders = BigInt(trancheData.outstandingInvestOrders)
        trancheState.outstandingRedeemOrders = BigInt(trancheData.outstandingRedeemOrders)
        await trancheState.save()
      }
    }

    // CREATE SNAPSHOTS OF TRANCHE STATES
    const tranches = await Tranche.getByType("TRANCHE")
    for (let tranche of tranches) {
      const trancheState = await TrancheState.get(tranche.id)
      const {id, ...copyTrancheState} = trancheState
      const trancheSnapshot = new TrancheSnapshot(`${tranche.id}-${blockHeight.toString()}`)
      Object.assign(trancheSnapshot, copyTrancheState)

      trancheSnapshot.trancheId = tranche.id
      trancheSnapshot.timestamp = block.timestamp
      trancheSnapshot.blockHeight = blockHeight

      await trancheSnapshot.save()
    }

    const timekeeper = new Timekeeper("global")
    timekeeper.lastPeriodStart = blockPeriodStart
    await timekeeper.save()
    
  }
}

async function initialiseMemTimekeeper():Promise<MemTimekeeper> {
  let lastPeriodStart: Date
  try {
    lastPeriodStart = (await Timekeeper.get("global")).lastPeriodStart
  } catch (error) {
    lastPeriodStart = new Date(0)
  }
  return new MemTimekeeper(lastPeriodStart)
}