import { SubstrateEvent } from '@subql/types'
import { Option } from '@polkadot/types'
import { Pool, PoolState } from '../types'
import { errorHandler } from '../helpers/errorHandler'
import { EpochEvent, LoanEvent, NavDetails, PoolDetails } from '../helpers/types'
import { createEpoch } from './epochs'
import { createTranche, updateTranchePrice, updateTrancheSupply } from './tranches'

export const updatePoolState = errorHandler(_updatePoolState)
async function _updatePoolState(poolId: string) {
  const poolState = await PoolState.get(poolId)
  const poolResponse = await api.query.pools.pool<Option<PoolDetails>>(poolState.id)
  if (poolResponse.isSome) {
    const poolData = poolResponse.unwrap()
    poolState.totalReserve = poolData.reserve.total.toBigInt()
    poolState.availableReserve = poolData.reserve.available.toBigInt()
    poolState.maxReserve = poolData.reserve.max.toBigInt()
    await poolState.save()
  }
  return poolState
}

export const updatePoolNav = errorHandler(_updatePoolNav)
async function _updatePoolNav(poolId: string) {
  const poolState = await PoolState.get(poolId)
  const navResponse = await api.query.loans.poolNAV<Option<NavDetails>>(poolId)
  if (navResponse.isSome) {
    const navData = navResponse.unwrap()
    poolState.netAssetValue = navData.latest.toBigInt()
    await poolState.save()
  }
  return poolState
}

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent): Promise<void> {
  const [poolId, admin] = event.event.data
  const poolData = (await api.query.pools.pool<Option<PoolDetails>>(poolId)).unwrap()
  const currentEpoch = 1

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
  pool.metadata = poolData.metadata.isSome ? poolData.metadata.unwrap().toUtf8() : 'NA'

  pool.minEpochTime = poolData.parameters.minEpochTime.toNumber()
  pool.maxNavAge = poolData.parameters.maxNavAge.toNumber()
  pool.currentEpoch = currentEpoch
  await pool.save()

  // Create the tranches
  const tranches = poolData.tranches.tranches
  for (const [index, trancheData] of tranches.entries()) {
    const trancheId = poolData.tranches.ids.toArray()[index].toHex()
    logger.info(`Creating tranche with id: ${trancheId}`)
    await createTranche(trancheId, pool.id, trancheData)
    await updateTranchePrice(pool.id, trancheId, currentEpoch)
    await updateTrancheSupply(pool.id, trancheId)
  }
  await createEpoch(pool.id, currentEpoch, event.block)
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

export const updateEpochReferences = errorHandler(_updateEpochReferences)
async function _updateEpochReferences(event: SubstrateEvent) {
  const [poolId, epochId] = event.event.data as unknown as EpochEvent
  const newIndex = epochId.toNumber() + 1
  const pool = await Pool.get(poolId.toString())

  switch (event.event.method) {
    case 'EpochClosed':
      pool.lastEpochClosed = epochId.toNumber()
      pool.currentEpoch = newIndex
      await pool.save()
      break

    case 'EpochExecuted':
      pool.lastEpochExecuted = epochId.toNumber()
      await pool.save()
      break

    default:
      break
  }
}
