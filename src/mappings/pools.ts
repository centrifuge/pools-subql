import { SubstrateEvent } from '@subql/types'
import { Epoch, Pool, PoolState, Tranche, TrancheState } from '../types'
import { TrancheData } from '../helpers/types'

export async function handlePoolCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Pool created in block ${event.block.block.header.number}: ${event.toString()}`)

  const [poolId, metadata] = event.event.data
  const poolResponse = await api.query.pools.pool(poolId)
  const poolData = poolResponse.toJSON() as any

    // Save the current pool state
    const poolState = new PoolState(`${poolId.toString()}`)
  
    poolState.netAssetValue = BigInt(0)
    poolState.totalReserve = BigInt(0)
    poolState.availableReserve = BigInt(0)
    poolState.maxReserve = BigInt(poolData.maxReserve ?? 0)
    poolState.totalDebt = BigInt(0)
  
    await poolState.save()
  
  // Create the pool
  const pool = new Pool(poolId.toString())
  pool.stateId = poolId.toString()
  pool.type = 'POOL'
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtHeight = event.block.block.header.number.toNumber()
  
  pool.currency = Object.keys(poolData.currency)[0]
  pool.metadata = metadata.toString()

  pool.minEpochTime = Number(poolData.minEpochTime.toString())
  pool.challengeTime = Number(poolData.challengeTime.toString())
  pool.maxNavAge = Number(poolData.maxNavAge.toString())
  pool.currentEpoch = 1

  await pool.save()

  // Create the first epoch
  let epoch = new Epoch(`${poolId.toString()}-1`)
  epoch.index = 1
  epoch.poolId = poolId.toString()
  epoch.openedAt = event.block.timestamp
  await epoch.save()

  // Create the tranches
  await poolData.tranches.map(async (trancheData: TrancheData, index: number) => {
    logger.info(`Tranche ${index}: ${JSON.stringify(trancheData)}`)

    // Create the tranche state
    const trancheState = new TrancheState(`${pool.id}-${index.toString()}`)
    await trancheState.save()

    const tranche = new Tranche(`${pool.id}-${index.toString()}`)
    tranche.type = 'TRANCHE'
    tranche.poolId = pool.id
    tranche.trancheId = index
    tranche.isResidual = index === 0 // only the first tranche is a residual tranche
    tranche.seniority = Number(trancheData.seniority)

    if (!tranche.isResidual) {
      tranche.interestRatePerSec = BigInt(trancheData.interestPerSec)
      tranche.minRiskBuffer = BigInt(trancheData.minRiskBuffer)
    }

    tranche.stateId = trancheState.id

    await tranche.save()
  })
}

export async function handlePoolTotalDebt(event: SubstrateEvent):Promise<void> {
  const [poolId, loanId, amount] = event.event.data
  const eventType = event.event.method
  logger.info(`Pool ${poolId.toString()} totalDebt ${eventType} in block ${event.block.block.header.number} by ${amount.toString()}`)
  // Find corresponding pool state
  const poolState = await PoolState.get(poolId.toString())
  
  switch (eventType) {
    case "Borrowed":
      poolState.totalDebt += BigInt(amount.toString())
      break;
    
    case "Repaid":
      poolState.totalDebt -= BigInt(amount.toString())
      break;
  
    default:
      throw new Error("Invalid EventType in handlePoolTotalDebt");
      break;
  }

  await poolState.save()
}