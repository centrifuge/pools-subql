import { SubstrateEvent } from '@subql/types'
import { Epoch, Pool, PoolState, Tranche } from '../types'

export async function handlePoolCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Pool created: ${event.toString()}`)

  const [poolId, metadata] = event.event.data
  const poolData = JSON.parse((await api.query.pools.pool(poolId)) as any)

  // Create the first epoch
  let epoch = new Epoch(`${poolId.toString()}-1`)
  epoch.index = 1
  epoch.poolId = poolId.toString()
  epoch.openedAt = event.block.timestamp
  await epoch.save()

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

  pool.currentEpochId = epoch.id
  pool.lastEpochClosedId = epoch.id
  pool.lastEpochExecutedId = epoch.id

  pool.currentStateId = poolState.id

  await pool.save()

  // Create the tranches
  // await poolData.tranches.map(async (t: any, index: number) => {
  //   // const trancheData = JSON.parse(t);
  //   const trancheData = t;

  //   let tranche = new Tranche(index.toString());
  //   logger.info(`Tranche ${index}: ${JSON.stringify(trancheData)}`);
  //   tranche.poolId = pool.id;
  //   tranche.isResidual = index === 0; // only the first tranche is a residual tranche
  //   tranche.seniority = trancheData.seniority;

  //   if (!tranche.isResidual) {
  //     tranche.interestRate = BigInt(trancheData.interestRate.toString());
  //     tranche.minRiskBuffer = BigInt(trancheData.minRiskBuffer.toString());
  //   }

  //   await tranche.save();
  // });
}
