import { SubstrateEvent } from '@subql/types'
import { Epoch, Pool, PoolState, Tranche } from '../types'

export async function handlePoolCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Pool created: ${event.toString()}`)

  const [poolId, metadata] = event.event.data
  const result = await await api.query.pools.pool(poolId)
  const poolData = result.toJSON() as any

  // Save the current pool state
  let poolState = new PoolState(`${poolId.toString()}-${new Date().getTime().toString()}`)
  poolState.netAssetValue = BigInt(0)
  poolState.totalReserve = BigInt(0)
  poolState.availableReserve = BigInt(0)
  poolState.maxReserve = BigInt(poolData.maxReserve.toString())

  await poolState.save()

  // Create the pool
  let pool = new Pool(poolId.toString())

  pool.type = 'POOL'
  pool.metadata = metadata.toString()
  pool.currency = Object.keys(poolData.currency)[0].toString()

  pool.minEpochTime = Number(poolData.minEpochTime.toString())
  pool.challengeTime = Number(poolData.challengeTime.toString())
  pool.maxNavAge = Number(poolData.maxNavAge.toString())

  pool.currentEpoch = 1

  pool.currentStateId = poolState.id

  await pool.save()

  // Create the first epoch
  let epoch = new Epoch(`${poolId.toString()}-1`)
  epoch.index = 1
  epoch.poolId = poolId.toString()
  epoch.openedAt = event.block.timestamp
  await epoch.save()

  // Create the tranches
  await poolData.tranches.map(async (trancheData: any, index: number) => {
    logger.info(`Tranche ${index}: ${JSON.stringify(trancheData)}`)

    let tranche = new Tranche(`${pool.id}-${index.toString()}`)
    tranche.poolId = pool.id
    tranche.trancheId = index
    tranche.isResidual = index === 0 // only the first tranche is a residual tranche
    tranche.seniority = Number(trancheData.seniority.toString())

    if (!tranche.isResidual) {
      tranche.interestRate = BigInt(trancheData.interestPerSec.toString())
      tranche.minRiskBuffer = BigInt(trancheData.minRiskBuffer.toString())
    }

    await tranche.save()
  })
}
