import { SubstrateEvent } from '@subql/types'
import { errorHandler, missingPool } from '../../helpers/errorHandler'
import {
  PoolFeesAddedEvent,
  PoolFeesChargedEvent,
  PoolFeesPaidEvent,
  PoolFeesProposedEvent,
  PoolFeesRemovedEvent,
  PoolFeesUnchargedEvent,
} from '../../helpers/types'
import { PoolFeeData, PoolFeeService } from '../services/poolFeeService'
import { PoolService } from '../services/poolService'
import { PoolFeeTransactionService } from '../services/poolFeeTransactionService'

export const handleFeeProposed = errorHandler(_handleFeeProposed)
async function _handleFeeProposed(event: SubstrateEvent<PoolFeesProposedEvent>): Promise<void> {
  const [poolId, feeId, _bucket, fee] = event.event.data
  logger.info(
    `Fee with id ${feeId.toString(10)} proposed for pool ${poolId.toString(10)} ` +
      `on block ${event.block.block.header.number.toNumber()}`
  )
  const pool = await PoolService.getOrSeed(poolId.toString(10))
  const poolFeeData: PoolFeeData = {
    poolId: pool.id,
    feeId: feeId.toString(10),
    blockNumber: event.block.block.header.number.toNumber(),
    timestamp: event.block.timestamp,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
  }
  const type = fee.feeType.type

  const poolFee = await PoolFeeService.propose(poolFeeData, type)
  await poolFee.save()

  const poolFeeTransaction = PoolFeeTransactionService.propose(poolFeeData)
  await poolFeeTransaction.save()
}

export const handleFeeAdded = errorHandler(_handleFeeAdded)
async function _handleFeeAdded(event: SubstrateEvent<PoolFeesAddedEvent>): Promise<void> {
  const [poolId, _bucket, feeId, fee] = event.event.data
  logger.info(
    `Fee with id ${feeId.toString(10)} added for pool ${poolId.toString(10)} ` +
      `on block ${event.block.block.header.number.toNumber()}`
  )
  const pool = await PoolService.getOrSeed(poolId.toString(10))
  const poolFeeData: PoolFeeData = {
    poolId: pool.id,
    feeId: feeId.toString(10),
    blockNumber: event.block.block.header.number.toNumber(),
    timestamp: event.block.timestamp,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
  }
  const type = fee.feeType.type

  const poolFee = await PoolFeeService.add(poolFeeData, type)
  await poolFee.save()

  const poolFeeTransaction = PoolFeeTransactionService.add(poolFeeData)
  await poolFeeTransaction.save()
}

export const handleFeeRemoved = errorHandler(_handleFeeRemoved)
async function _handleFeeRemoved(event: SubstrateEvent<PoolFeesRemovedEvent>): Promise<void> {
  const [poolId, _bucket, feeId] = event.event.data
  logger.info(
    `Fee with id ${feeId.toString(10)} removed for pool ${poolId.toString(10)} ` +
      `on block ${event.block.block.header.number.toNumber()}`
  )
  const pool = await PoolService.getById(poolId.toString(10))
  if (!pool) throw missingPool
  const poolFeeData: PoolFeeData = {
    poolId: pool.id,
    feeId: feeId.toString(10),
    blockNumber: event.block.block.header.number.toNumber(),
    timestamp: event.block.timestamp,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
  }

  const poolFee = await PoolFeeService.delete(poolFeeData)
  await poolFee.save()

  const poolFeeTransaction = PoolFeeTransactionService.delete(poolFeeData)
  await poolFeeTransaction.save()
}

export const handleFeeCharged = errorHandler(_handleFeeCharged)
async function _handleFeeCharged(event: SubstrateEvent<PoolFeesChargedEvent>): Promise<void> {
  const [poolId, feeId, amount, _pending] = event.event.data
  logger.info(
    `Fee with id ${feeId.toString(10)} charged for pool ${poolId.toString(10)} ` +
      `on block ${event.block.block.header.number.toNumber()}`
  )
  const pool = await PoolService.getById(poolId.toString(10))
  if (!pool) throw missingPool
  const poolFeeData = {
    poolId: pool.id,
    feeId: feeId.toString(10),
    blockNumber: event.block.block.header.number.toNumber(),
    timestamp: event.block.timestamp,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: amount.toBigInt(),
  }

  const poolFee = await PoolFeeService.getById(poolFeeData.poolId, poolFeeData.feeId)
  if (!poolFee) throw new Error('PoolFee not found!')
  await poolFee.charge(poolFeeData)
  await poolFee.save()

  const poolFeeTransaction = PoolFeeTransactionService.charge(poolFeeData)
  await poolFeeTransaction.save()
}

export const handleFeeUncharged = errorHandler(_handleFeeUncharged)
async function _handleFeeUncharged(event: SubstrateEvent<PoolFeesUnchargedEvent>): Promise<void> {
  const [poolId, feeId, amount, _pending] = event.event.data
  logger.info(
    `Fee with id ${feeId.toString(10)} uncharged for pool ${poolId.toString(10)} ` +
      `on block ${event.block.block.header.number.toNumber()}`
  )
  const pool = await PoolService.getById(poolId.toString(10))
  if (!pool) throw missingPool
  const poolFeeData = {
    poolId: pool.id,
    feeId: feeId.toString(10),
    blockNumber: event.block.block.header.number.toNumber(),
    timestamp: event.block.timestamp,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: amount.toBigInt(),
  }

  const poolFee = await PoolFeeService.getById(poolFeeData.poolId, poolFeeData.feeId)
  if (!poolFee) throw new Error('PoolFee not found!')
  await poolFee.uncharge(poolFeeData)
  await poolFee.save()

  const poolFeeTransaction = PoolFeeTransactionService.uncharge(poolFeeData)
  await poolFeeTransaction.save()
}

export const handleFeePaid = errorHandler(_handleFeePaid)
async function _handleFeePaid(event: SubstrateEvent<PoolFeesPaidEvent>): Promise<void> {
  const [poolId, feeId, amount, _destination] = event.event.data
  logger.info(
    `Fee with id ${feeId.toString(10)} uncharged for pool ${poolId.toString(10)} ` +
      `on block ${event.block.block.header.number.toNumber()}`
  )
  const pool = await PoolService.getById(poolId.toString(10))
  if (!pool) throw missingPool
  const poolFeeData = {
    poolId: pool.id,
    feeId: feeId.toString(10),
    blockNumber: event.block.block.header.number.toNumber(),
    timestamp: event.block.timestamp,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: amount.toBigInt(),
  }

  const poolFee = await PoolFeeService.getById(poolFeeData.poolId, poolFeeData.feeId)
  if (!poolFee) throw new Error('PoolFee not found!')
  await poolFee.pay(poolFeeData)
  await poolFee.save()

  const poolFeeTransaction = PoolFeeTransactionService.pay(poolFeeData)
  await poolFeeTransaction.save()
}
