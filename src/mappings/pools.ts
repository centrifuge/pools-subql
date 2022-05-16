import { SubstrateEvent } from '@subql/types'
import { Epoch, Pool, PoolState, Tranche, TrancheState } from '../types'
import { TrancheData } from '../helpers/types'
import { errorHandler } from '../helpers/errorHandler'

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Pool created in block ${event.block.block.header.number}: ${event.toString()}`)

  const [poolId, metadata] = event.event.data
  const poolData = (<any>await api.query.pools.pool(poolId)).unwrap()
  logger.info(`PoolData: ${JSON.stringify(poolData)}`)

  // Save the current pool state
  const poolState = new PoolState(`${poolId.toString()}`)
  poolState.type = 'ALL'
  poolState.netAssetValue = BigInt(0)
  poolState.totalReserve = BigInt(0)
  poolState.availableReserve = BigInt(0)
  poolState.maxReserve = poolData.reserve.max.toBigInt() ?? BigInt(0)
  poolState.totalDebt = BigInt(0)

  await poolState.save()

  // Create the pool
  const pool = new Pool(poolId.toString())
  pool.stateId = poolId.toString()
  pool.type = 'ALL'
  pool.createdAtTimestamp = event.block.timestamp
  pool.createdAtHeight = event.block.block.header.number.toNumber()

  pool.currency = poolData.currency.toString()
  pool.metadata = metadata.toString()

  pool.minEpochTime = Number(poolData.parameters.minEpochTime.toNumber())
  pool.maxNavAge = Number(poolData.parameters.maxNavAge.toNumber())
  pool.currentEpoch = 1

  await pool.save()

  // Create the first epoch
  let epoch = new Epoch(`${poolId.toString()}-1`)
  epoch.index = 1
  epoch.poolId = poolId.toString()
  epoch.openedAt = event.block.timestamp
  await epoch.save()

  // Create the tranches
  await poolData.tranches.tranches.map(async (trancheData: any, index: number) => {
    logger.info(`Tranche ${index}: ${JSON.stringify(trancheData)}`)

    // Create the tranche state
    const trancheState = new TrancheState(`${pool.id}-${index.toString()}`)
    trancheState.type = 'ALL'
    await trancheState.save()

    const tranche = new Tranche(`${pool.id}-${index.toString()}`)
    tranche.type = 'ALL'
    tranche.poolId = pool.id
    tranche.trancheId = index
    tranche.isResidual = trancheData.trancheType.isResidual // only the first tranche is a residual tranche
    tranche.seniority = Number(trancheData.seniority.toNumber())

    if (!tranche.isResidual) {
      logger.info(
        `Tranche ${index} isResidual: ${tranche.isResidual}, ${JSON.stringify(trancheData.trancheType.asNonResidual)}`
      )
      tranche.interestRatePerSec = trancheData.trancheType.asNonResidual.interestRatePerSec.toBigInt()
      tranche.minRiskBuffer = trancheData.trancheType.asNonResidual.minRiskBuffer.toBigInt()
    }

    tranche.stateId = trancheState.id

    await tranche.save()
  })
}

export const handlePoolTotalDebt = errorHandler(_handlePoolTotalDebt)
async function _handlePoolTotalDebt(event: SubstrateEvent): Promise<void> {
  const [poolId, loanId, amount] = event.event.data
  const eventType = event.event.method
  logger.info(
    `Pool ${poolId.toString()} totalDebt ${eventType} in block ${
      event.block.block.header.number
    } by ${amount.toString()}`
  )
  // Find corresponding pool state
  const poolState = await PoolState.get(poolId.toString())

  switch (eventType) {
    case 'Borrowed':
      poolState.totalDebt += BigInt(amount.toString())
      break

    case 'Repaid':
      poolState.totalDebt -= BigInt(amount.toString())
      break

    default:
      throw new Error('Invalid EventType in handlePoolTotalDebt')
      break
  }

  await poolState.save()
}
