import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { InvestOrdersCollectedEvent, OrderUpdatedEvent, RedeemOrdersCollectedEvent } from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionData, InvestorTransactionService } from '../services/investorTransactionService'
import { AccountService } from '../services/accountService'
import { TrancheBalanceService } from '../services/trancheBalanceService'

export const handleInvestOrderUpdated = errorHandler(_handleInvestOrderUpdated)
async function _handleInvestOrderUpdated(event: SubstrateEvent<OrderUpdatedEvent>): Promise<void> {
  const [{ poolId, trancheId }, , address, newAmount] = event.event.data
  logger.info(
    `Invest order updated for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `New: ${newAmount.toString()} ` +
      `block ${event.block.block.header.number.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const account = await AccountService.getOrInit(address.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  // Update tranche price
  await tranche.updatePriceFromRpc()

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.currentEpoch,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: newAmount.toBigInt(),
    price: tranche.tokenPrice,
    fee: BigInt(0),
    timestamp: event.block.timestamp,
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
  const epoch = await EpochService.getById(poolId.toString(), pool.currentEpoch)
  await epoch.updateOutstandingInvestOrders(trancheId.toHex(), orderData.amount, oldAmount)
  await epoch.saveWithStates()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)
  await trancheBalance.investOrder(orderData.amount)
  await trancheBalance.save()
}

export const handleRedeemOrderUpdated = errorHandler(_handleRedeemOrderUpdated)
async function _handleRedeemOrderUpdated(event: SubstrateEvent<OrderUpdatedEvent>): Promise<void> {
  const [{ poolId, trancheId }, , address, amount] = event.event.data
  logger.info(
    `Redeem order updated for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `New: ${amount.toString()} Old: HERE} at ` +
      `block ${event.block.block.header.number.toString()}`
  )
  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const account = await AccountService.getOrInit(address.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  await tranche.updatePriceFromRpc()

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.currentEpoch,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: amount.toBigInt(),
    price: tranche.tokenPrice,
    fee: BigInt(0),
    timestamp: event.block.timestamp,
  }

  if (amount.toBigInt() > BigInt(0)) {
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
  const epoch = await EpochService.getById(poolId.toString(), pool.currentEpoch)
  await epoch.updateOutstandingRedeemOrders(trancheId.toHex(), orderData.amount, oldAmount, tranche.tokenPrice)
  await epoch.saveWithStates()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)
  await trancheBalance.redeemOrder(orderData.amount)
  await trancheBalance.save()
}

export const handleInvestOrdersCollected = errorHandler(_handleInvestOrdersCollected)
async function _handleInvestOrdersCollected(event: SubstrateEvent<InvestOrdersCollectedEvent>): Promise<void> {
  const [{ poolId, trancheId }, address, , investCollection] = event.event.data
  logger.info(
    `Orders collected for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `Address: ${address.toString()} at ` +
      `block ${event.block.block.header.number.toString()} hash:${event.extrinsic.extrinsic.hash.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')
  const endEpochId = pool.lastEpochClosed
  logger.info(`Collection for ending epoch: ${endEpochId}`)

  const account = await AccountService.getOrInit(address.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  // Update tranche price
  await tranche.updatePriceFromRpc()
  await tranche.save()

  const { payoutInvestmentInvest } = investCollection

  const orderData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    price: tranche.tokenPrice,
    amount: payoutInvestmentInvest.toBigInt(),
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
async function _handleRedeemOrdersCollected(event: SubstrateEvent<RedeemOrdersCollectedEvent>): Promise<void> {
  const [{ poolId, trancheId }, address, , redeemCollection] = event.event.data
  logger.info(
    `Orders collected for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `Address: ${address.toString()} ` +
      `block ${event.block.block.header.number.toString()} hash:${event.extrinsic.extrinsic.hash.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')
  const endEpochId = pool.lastEpochClosed
  logger.info(`Collection for ending epoch: ${endEpochId}`)

  const account = await AccountService.getOrInit(address.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  // Update tranche price
  await tranche.updatePriceFromRpc()
  await tranche.save()

  const { payoutInvestmentRedeem } = redeemCollection

  const orderData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    price: tranche.tokenPrice,
    amount: payoutInvestmentRedeem.toBigInt(),
  }

  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)

  if (orderData.amount > 0) {
    const it = InvestorTransactionService.collectRedeemOrder(orderData)
    await it.save()

    await trancheBalance.redeemCollect(orderData.amount)
    await trancheBalance.save()
  }
}
