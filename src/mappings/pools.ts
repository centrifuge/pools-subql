import { SubstrateEvent } from '@subql/types'
import { Epoch, Pool, PoolState, Tranche } from '../types'

export async function handlePoolCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Pool created: ${event.toString()}`)

  const [poolId, metadata] = event.event.data
  const result = await api.query.pools.pool(poolId)
  const poolData = result.toJSON() as any

  // Save the current pool state
  let poolState = new PoolState(`${poolId.toString()}-${new Date().getTime().toString()}`)
  poolState.netAssetValue = BigInt(0)
  poolState.totalReserve = BigInt(0)
  poolState.availableReserve = BigInt(0)
  poolState.maxReserve = BigInt(poolData.reserve.max.toString())

  await poolState.save()

  // Create the pool
  let pool = new Pool(poolId.toString())

  pool.type = 'POOL'
  pool.createdAt = event.block.timestamp
  pool.metadata = metadata.toString()
  pool.currency = Object.keys(poolData.currency)[0].toString()

  pool.minEpochTime = Number(poolData.parameters.minEpochTime.toString())
  pool.maxNavAge = Number(poolData.parameters.maxNavAge.toString())

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
  await poolData.tranches.tranches.map(async (trancheData: any, index: number) => {
    const trancheId = trancheData.currency['tranche'][1]
    let tranche = new Tranche(`${pool.id}-${trancheId.toString()}`)
    tranche.poolId = pool.id
    tranche.trancheId = trancheId
    tranche.isResidual = index === 0 // only the first tranche is a residual tranche
    tranche.seniority = Number(trancheData.seniority.toString())

    if (!tranche.isResidual) {
      tranche.interestRatePerSec = BigInt(trancheData.trancheType.nonResidual.interestRatePerSec.toString())
      tranche.minRiskBuffer = BigInt(trancheData.trancheType.nonResidual.minRiskBuffer.toString())
    }

    await tranche.save()
  })
}
