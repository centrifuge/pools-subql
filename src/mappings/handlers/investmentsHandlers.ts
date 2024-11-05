import { SubstrateEvent } from '@subql/types'
import { errorHandler, missingPool } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import {
  InvestOrdersCollectedEvent,
  OrderUpdatedEvent,
  RedeemOrdersCollectedEvent,
  TrancheCurrencyBefore1400,
} from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionData, InvestorTransactionService } from '../services/investorTransactionService'
import { AccountService } from '../services/accountService'
import { TrancheBalanceService } from '../services/trancheBalanceService'

export const handleInvestOrderUpdated = errorHandler(_handleInvestOrderUpdated)
async function _handleInvestOrderUpdated(event: SubstrateEvent<OrderUpdatedEvent>) {
  const [[poolId, trancheId], , address, amount] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return investOrderUpdated(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    amount.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

export const handleInvestOrderUpdatedBefore1400 = errorHandler(_handleInvestOrderUpdatedBefore1400)
async function _handleInvestOrderUpdatedBefore1400(
  event: SubstrateEvent<OrderUpdatedEvent<TrancheCurrencyBefore1400>>
) {
  const [{ poolId, trancheId }, , address, amount] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return investOrderUpdated(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    amount.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

async function investOrderUpdated(
  poolId: string,
  trancheId: string,
  address: string,
  newAmount: bigint,
  blockNumber: number,
  timestamp: Date,
  hash: string
): Promise<void> {
  logger.info(
    `Invest order updated for tranche ${poolId}-${trancheId}. ` + `amount: ${newAmount} ` + `block ${blockNumber}`
  )

  const pool = await PoolService.getById(poolId)
  if (!pool) throw missingPool

  const account = await AccountService.getOrInit(address)
  const tranche = await TrancheService.getById(poolId, trancheId)

  // Update tranche price
  await tranche.updatePriceFromRuntime(blockNumber)

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.currentEpoch,
    address: account.id,
    hash,
    amount: newAmount,
    price: tranche.tokenPrice,
    fee: BigInt(0),
    timestamp,
  }

  if (orderData.amount > BigInt(0)) {
    // Post investor transaction
    const it = InvestorTransactionService.updateInvestOrder(orderData)
    await it.save()
  } else {
    // Cancel transaction
    const it = InvestorTransactionService.cancelInvestOrder(orderData)
    await it.save()
  }

  // Initialise or update outstanding transaction
  const oo = await OutstandingOrderService.getOrInit(orderData)
  const oldAmount = oo.investAmount
  await oo.updateInvest(orderData)
  await oo.save()

  // Update tranche outstanding total
  await tranche.updateOutstandingInvestOrders(orderData.amount, oldAmount)
  await tranche.save()

  // Update epochState outstanding total
  const epoch = await EpochService.getById(poolId, pool.currentEpoch)
  await epoch.updateOutstandingInvestOrders(trancheId, orderData.amount, oldAmount)
  await epoch.saveWithStates()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)
  await trancheBalance.investOrder(orderData.amount)
  await trancheBalance.save()
}

export const handleRedeemOrderUpdated = errorHandler(_handleRedeemOrderUpdated)
async function _handleRedeemOrderUpdated(event: SubstrateEvent<OrderUpdatedEvent>) {
  const [[poolId, trancheId], , address, amount] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return redeemOrderUpdated(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    amount.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

export const handleRedeemOrderUpdatedBefore1400 = errorHandler(_handleRedeemOrderUpdatedBefore1400)
async function _handleRedeemOrderUpdatedBefore1400(
  event: SubstrateEvent<OrderUpdatedEvent<TrancheCurrencyBefore1400>>
) {
  const [{ poolId, trancheId }, , address, amount] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return redeemOrderUpdated(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    amount.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

const redeemOrderUpdated = errorHandler(_redeemOrderUpdated)
async function _redeemOrderUpdated(
  poolId: string,
  trancheId: string,
  address: string,
  newAmount: bigint,
  blockNumber: number,
  timestamp: Date,
  hash: string
): Promise<void> {
  logger.info(
    `Redeem order updated for tranche ${poolId}-${trancheId}. ` + `amount: ${newAmount} at ` + `block ${blockNumber}`
  )
  // Get corresponding pool
  const pool = await PoolService.getById(poolId)
  if (pool === undefined) throw missingPool

  const account = await AccountService.getOrInit(address)

  const tranche = await TrancheService.getById(poolId, trancheId)

  await tranche.updatePriceFromRuntime(blockNumber)

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.currentEpoch,
    address: account.id,
    hash,
    amount: newAmount,
    price: tranche.tokenPrice,
    fee: BigInt(0),
    timestamp,
  }

  if (newAmount > BigInt(0)) {
    // Post investor transaction
    const it = InvestorTransactionService.updateRedeemOrder(orderData)
    await it.save()
  } else {
    // Cancel transaction
    const it = InvestorTransactionService.cancelRedeemOrder(orderData)
    await it.save()
  }

  // Initialise outstanding transaction
  const oo = await OutstandingOrderService.getOrInit(orderData)
  const oldAmount = oo.redeemAmount
  await oo.updateRedeem(orderData)
  await oo.save()

  // Update tranche outstanding total
  await tranche.updateOutstandingRedeemOrders(orderData.amount, oldAmount)
  await tranche.save()

  // Update epochState outstanding total
  const epoch = await EpochService.getById(poolId, pool.currentEpoch)
  await epoch.updateOutstandingRedeemOrders(trancheId, orderData.amount, oldAmount, tranche.tokenPrice)
  await epoch.saveWithStates()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)
  await trancheBalance.redeemOrder(orderData.amount)
  await trancheBalance.save()
}

export const handleInvestOrdersCollected = errorHandler(_handleInvestOrdersCollected)
async function _handleInvestOrdersCollected(event: SubstrateEvent<InvestOrdersCollectedEvent>) {
  const [[poolId, trancheId], address, , { payoutInvestmentInvest }] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return investOrdersCollected(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    payoutInvestmentInvest.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

export const handleInvestOrdersCollectedBefore1400 = errorHandler(_handleInvestOrdersCollectedBefore1400)
async function _handleInvestOrdersCollectedBefore1400(
  event: SubstrateEvent<InvestOrdersCollectedEvent<TrancheCurrencyBefore1400>>
) {
  const [{ poolId, trancheId }, address, , { payoutInvestmentInvest }] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return investOrdersCollected(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    payoutInvestmentInvest.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

async function investOrdersCollected(
  poolId: string,
  trancheId: string,
  address: string,
  payoutInvestmentInvest: bigint,
  blockNumber: number,
  timestamp: Date,
  hash: string
): Promise<void> {
  logger.info(
    `Orders collected for tranche ${poolId}-${trancheId}. ` +
      `Address: ${address} at ` +
      `block ${blockNumber} hash:${hash}`
  )
  const account = await AccountService.getOrInit(address)
  if (account.isForeignEvm()) {
    logger.info('Skipping Address as collection is from another EVM Chain')
    return
  }

  const pool = await PoolService.getById(poolId)
  if (!pool) throw missingPool
  const endEpochId = pool.lastEpochClosed
  logger.info(`Collection for ending epoch: ${endEpochId}`)

  const tranche = await TrancheService.getById(poolId, trancheId)

  // Update tranche price
  await tranche.updatePriceFromRuntime(blockNumber)
  await tranche.save()

  const orderData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId,
    address: account.id,
    hash,
    timestamp,
    price: tranche.tokenPrice,
    amount: payoutInvestmentInvest,
  }

  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)

  if (orderData.amount > 0) {
    const it = InvestorTransactionService.collectInvestOrder(orderData)
    await it.save()

    await trancheBalance.investCollect(orderData.amount)
    await trancheBalance.save()
  }
}

export const handleRedeemOrdersCollected = errorHandler(_handleRedeemOrdersCollected)
async function _handleRedeemOrdersCollected(event: SubstrateEvent<RedeemOrdersCollectedEvent>) {
  const [[poolId, trancheId], address, , { payoutInvestmentRedeem }] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return redeemOrdersCollected(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    payoutInvestmentRedeem.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

export const handleRedeemOrdersCollectedBefore1400 = errorHandler(_handleRedeemOrdersCollectedBefore1400)
async function _handleRedeemOrdersCollectedBefore1400(
  event: SubstrateEvent<RedeemOrdersCollectedEvent<TrancheCurrencyBefore1400>>
) {
  const [{ poolId, trancheId }, address, , { payoutInvestmentRedeem }] = event.event.data
  const blockNumber = event.block.block.header.number.toNumber()
  const timestamp = event.block.timestamp
  const hash = event.extrinsic.extrinsic.hash.toString()
  return redeemOrdersCollected(
    poolId.toString(),
    trancheId.toHex(),
    address.toString(),
    payoutInvestmentRedeem.toBigInt(),
    blockNumber,
    timestamp,
    hash
  )
}

async function redeemOrdersCollected(
  poolId: string,
  trancheId: string,
  address: string,
  payoutInvestmentRedeem: bigint,
  blockNumber: number,
  timestamp: Date,
  hash: string
): Promise<void> {
  logger.info(
    `Orders collected for tranche ${poolId}-${trancheId}. ` +
      `Address: ${address} ` +
      `block ${blockNumber} hash:${hash}`
  )

  const account = await AccountService.getOrInit(address)
  if (account.isForeignEvm()) {
    logger.info('Skipping Address as collection is from another EVM Chain')
    return
  }

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool
  const endEpochId = pool.lastEpochClosed
  logger.info(`Collection for ending epoch: ${endEpochId}`)

  const tranche = await TrancheService.getById(poolId, trancheId)

  // Update tranche price
  await tranche.updatePriceFromRuntime(blockNumber)
  await tranche.save()

  const orderData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId,
    address: account.id,
    hash: hash,
    timestamp: timestamp,
    price: tranche.tokenPrice,
    amount: payoutInvestmentRedeem,
  }

  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)

  if (orderData.amount > 0) {
    const it = InvestorTransactionService.collectRedeemOrder(orderData)
    await it.save()

    await trancheBalance.redeemCollect(orderData.amount)
    await trancheBalance.save()
  }
}
