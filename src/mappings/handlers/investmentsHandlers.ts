import { SubstrateEvent } from '@subql/types'
import { errorHandler, missingPool } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { InvestOrdersCollectedEvent, OrderUpdatedEvent, RedeemOrdersCollectedEvent } from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionData, InvestorTransactionService } from '../services/investorTransactionService'
import { AccountService } from '../services/accountService'
import { TrancheBalanceService } from '../services/trancheBalanceService'
import { assertPropInitialized } from '../../helpers/validation'

export const handleInvestOrderUpdated = errorHandler(_handleInvestOrderUpdated)
async function _handleInvestOrderUpdated(event: SubstrateEvent<OrderUpdatedEvent>): Promise<void> {
  const [investmentId, , address, newAmount] = event.event.data
  const timestamp = event.block.timestamp
  if (!timestamp) throw new Error(`Block ${event.block.block.header.number.toString()} has no timestamp`)
  const poolId = Array.isArray(investmentId) ? investmentId[0] : investmentId.poolId
  const trancheId = Array.isArray(investmentId) ? investmentId[1] : investmentId.trancheId
  logger.info(
    `Invest order updated for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `amount: ${newAmount.toString()} ` +
      `block ${event.block.block.header.number.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool

  const account = await AccountService.getOrInit(address.toHex())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())
  if (!tranche) throw new Error('Tranche not found!')

  // Update tranche price
  await tranche.updatePriceFromRuntime(event.block.block.header.number.toNumber())

  if (!event.extrinsic) throw new Error('Missing event extrinsic')
  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.currentEpoch,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: newAmount.toBigInt(),
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
  assertPropInitialized(pool, 'currentEpoch', 'number')
  const epoch = await EpochService.getById(poolId.toString(), pool.currentEpoch!)
  if (!epoch) throw new Error('Epoch not found!')
  await epoch.updateOutstandingInvestOrders(trancheId.toHex(), orderData.amount, oldAmount)
  await epoch.saveWithStates()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(
    orderData.address,
    orderData.poolId,
    orderData.trancheId,
    timestamp
  )
  await trancheBalance.investOrder(orderData.amount)
  await trancheBalance.save()
}

export const handleRedeemOrderUpdated = errorHandler(_handleRedeemOrderUpdated)
async function _handleRedeemOrderUpdated(event: SubstrateEvent<OrderUpdatedEvent>): Promise<void> {
  const [investmentId, , address, amount] = event.event.data
  const timestamp = event.block.timestamp
  if (!timestamp) throw new Error(`Block ${event.block.block.header.number.toString()} has no timestamp`)
  const poolId = Array.isArray(investmentId) ? investmentId[0] : investmentId.poolId
  const trancheId = Array.isArray(investmentId) ? investmentId[1] : investmentId.trancheId
  logger.info(
    `Redeem order updated for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `amount: ${amount.toString()} at ` +
      `block ${event.block.block.header.number.toString()}`
  )
  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool

  const account = await AccountService.getOrInit(address.toHex())

  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())
  if (!tranche) throw new Error('Tranche not found!')

  await tranche.updatePriceFromRuntime(event.block.block.header.number.toNumber())

  if (!event.extrinsic) throw new Error('Missing event extrinsic')
  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.currentEpoch,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: amount.toBigInt(),
    price: tranche.tokenPrice,
    fee: BigInt(0),
    timestamp,
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
  assertPropInitialized(pool, 'currentEpoch', 'number')
  const epoch = await EpochService.getById(poolId.toString(), pool.currentEpoch!)
  if (!epoch) throw new Error('Epoch not found')
  await epoch.updateOutstandingRedeemOrders(trancheId.toHex(), orderData.amount, oldAmount, tranche.tokenPrice!)
  await epoch.saveWithStates()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(
    orderData.address,
    orderData.poolId,
    orderData.trancheId,
    timestamp
  )
  await trancheBalance.redeemOrder(orderData.amount)
  await trancheBalance.save()
}

export const handleInvestOrdersCollected = errorHandler(_handleInvestOrdersCollected)
async function _handleInvestOrdersCollected(event: SubstrateEvent<InvestOrdersCollectedEvent>): Promise<void> {
  const [investmentId, address, , investCollection] = event.event.data
  const timestamp = event.block.timestamp
  if (!timestamp) throw new Error(`Block ${event.block.block.header.number.toString()} has no timestamp`)
  const poolId = Array.isArray(investmentId) ? investmentId[0] : investmentId.poolId
  const trancheId = Array.isArray(investmentId) ? investmentId[1] : investmentId.trancheId
  if (!event.extrinsic) throw new Error('Missing event extrinsic')
  logger.info(
    `Orders collected for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `Address: ${address.toHex()} at ` +
      `block ${event.block.block.header.number.toString()} hash:${event.extrinsic.extrinsic.hash.toString()}`
  )
  const account = await AccountService.getOrInit(address.toHex())
  if (account.isForeignEvm()) {
    logger.info('Skipping Address as collection is from another EVM Chain')
    return
  }

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool
  const endEpochId = pool.lastEpochClosed
  logger.info(`Collection for ending epoch: ${endEpochId}`)

  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())
  if (!tranche) throw new Error('Tranche not found!')

  // Update tranche price
  await tranche.updatePriceFromRuntime(event.block.block.header.number.toNumber())
  await tranche.save()

  const { payoutInvestmentInvest } = investCollection

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: timestamp,
    price: tranche.tokenPrice,
    amount: payoutInvestmentInvest.toBigInt(),
  }

  const trancheBalance = await TrancheBalanceService.getOrInit(
    orderData.address,
    orderData.poolId,
    orderData.trancheId,
    timestamp
  )

  if (orderData.amount > 0) {
    const it = InvestorTransactionService.collectInvestOrder(orderData)
    await it.save()

    await trancheBalance.investCollect(orderData.amount)
    await trancheBalance.save()
  }
}

export const handleRedeemOrdersCollected = errorHandler(_handleRedeemOrdersCollected)
async function _handleRedeemOrdersCollected(event: SubstrateEvent<RedeemOrdersCollectedEvent>): Promise<void> {
  const [investmentId, address, , redeemCollection] = event.event.data
  const timestamp = event.block.timestamp
  if (!timestamp) throw new Error(`Block ${event.block.block.header.number.toString()} has no timestamp`)
  const poolId = Array.isArray(investmentId) ? investmentId[0] : investmentId.poolId
  const trancheId = Array.isArray(investmentId) ? investmentId[1] : investmentId.trancheId
  if (!event.extrinsic) throw new Error('Missing event extrinsic')
  logger.info(
    `Orders collected for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `Address: ${address.toHex()} ` +
      `block ${event.block.block.header.number.toString()} hash:${event.extrinsic.extrinsic.hash.toString()}`
  )

  const account = await AccountService.getOrInit(address.toHex())
  if (account.isForeignEvm()) {
    logger.info('Skipping Address as collection is from another EVM Chain')
    return
  }

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool
  const endEpochId = pool.lastEpochClosed
  logger.info(`Collection for ending epoch: ${endEpochId}`)

  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())
  if (!tranche) throw new Error('Tranche not found!')

  // Update tranche price
  await tranche.updatePriceFromRuntime(event.block.block.header.number.toNumber())
  await tranche.save()

  const { payoutInvestmentRedeem } = redeemCollection

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId,
    address: account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp,
    price: tranche.tokenPrice,
    amount: payoutInvestmentRedeem.toBigInt(),
  }

  const trancheBalance = await TrancheBalanceService.getOrInit(
    orderData.address,
    orderData.poolId,
    orderData.trancheId,
    timestamp
  )

  if (orderData.amount > 0) {
    const it = InvestorTransactionService.collectRedeemOrder(orderData)
    await it.save()

    await trancheBalance.redeemCollect(orderData.amount)
    await trancheBalance.save()
  }
}
