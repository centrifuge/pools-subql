import { SubstrateEvent } from '@subql/types'
import { Option } from '@polkadot/types'
import { Epoch, Pool, PoolState, Tranche, TrancheState } from '../types'
import { errorHandler } from '../helpers/errorHandler'
import { LoanEvent, PoolDetails, TrancheDetails } from 'centrifuge-subql/helpers/types'

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent): Promise<void> {
  const [poolId, metadata] = event.event.data
  const poolData = (await api.query.pools.pool<Option<PoolDetails>>(poolId)).unwrap()

  logger.info(`Pool ${poolId.toString()} created in block ${event.block.block.header.number}`)

  // Save the current pool state
  const poolState = new PoolState(`${poolId.toString()}`)
  poolState.type = 'ALL'
  poolState.netAssetValue = BigInt(0)
  poolState.totalReserve = poolData.reserve.total.toBigInt()
  poolState.availableReserve = poolData.reserve.available.toBigInt()
  poolState.maxReserve = poolData.reserve.max.toBigInt()
  poolState.totalDebt = BigInt(0)

  poolState.totalBorrowed_ = BigInt(0)
  poolState.totalRepaid_ = BigInt(0)
  poolState.totalInvested_ = BigInt(0)
  poolState.totalRedeemed_ = BigInt(0)
  poolState.totalNumberOfLoans_ = BigInt(0)

  poolState.totalEverBorrowed = BigInt(0)
  poolState.totalEverNumberOfLoans = BigInt(0)

  await poolState.save()

  // Create the pool
  const pool = new Pool(poolId.toString())
  pool.stateId = poolId.toString()
  pool.type = 'ALL'
  pool.createdAt = event.block.timestamp
  pool.createdAtBlockNumber = event.block.block.header.number.toNumber()

  pool.currency = poolData.currency.toString()
  pool.metadata = metadata.toString()

  pool.minEpochTime = poolData.parameters.minEpochTime.toNumber()
  pool.maxNavAge = poolData.parameters.maxNavAge.toNumber()
  pool.currentEpoch = 1

  await pool.save()

  // Create the first epoch
  let epoch = new Epoch(`${poolId.toString()}-1`)
  epoch.index = 1
  epoch.poolId = poolId.toString()
  epoch.openedAt = event.block.timestamp
  await epoch.save()

  // Create the tranches
  const tranches = poolData.tranches.tranches
  for (const [index, trancheData] of tranches.entries()) {
    const trancheId = poolData.tranches.ids.toArray()[index].toHex()
    logger.info(`trancheId: ${trancheId}`)

    // Create the tranche state
    const trancheState = new TrancheState(`${pool.id}-${trancheId}`)
    trancheState.type = 'ALL'
    await trancheState.save()

    const tranche = new Tranche(`${pool.id}-${trancheId}`)
    tranche.type = 'ALL'
    tranche.poolId = pool.id
    tranche.trancheId = trancheId
    tranche.isResidual = trancheData.trancheType.isResidual // only the first tranche is a residual tranche
    tranche.seniority = trancheData.seniority.toNumber()

    if (!tranche.isResidual) {
      tranche.interestRatePerSec = trancheData.trancheType.asNonResidual.interestRatePerSec.toBigInt()
      tranche.minRiskBuffer = trancheData.trancheType.asNonResidual.minRiskBuffer.toBigInt()
    }

    tranche.stateId = trancheState.id

    await tranche.save()
  }
}

export const computeTotalBorrowings = errorHandler(_computeTotalBorrowings)
async function _computeTotalBorrowings(event: SubstrateEvent): Promise<void> {
  const [poolId, loanId, amount] = event.event.data as unknown as LoanEvent
  const poolState = await PoolState.get(poolId.toString())

  logger.info(`Pool: ${poolId.toString()} borrowed ${amount.toString()}`)

  poolState.totalBorrowed_ = poolState.totalBorrowed_ + amount.toBigInt()
  poolState.totalEverBorrowed = poolState.totalEverBorrowed + amount.toBigInt()

  poolState.totalNumberOfLoans_ = poolState.totalNumberOfLoans_ + BigInt(1)
  poolState.totalEverNumberOfLoans = poolState.totalEverNumberOfLoans + BigInt(1)

  await poolState.save()
}
