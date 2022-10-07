import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EpochEvent, OrderEvent, OrdersCollectedEvent, PoolCreatedUpdatedEvent } from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionData, InvestorTransactionService } from '../services/investorTransactionService'
import { CurrencyService } from '../services/currencyService'
import { AccountService } from '../services/accountService'
import { TrancheBalanceService } from '../services/trancheBalanceService'

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent<PoolCreatedUpdatedEvent>): Promise<void> {
  const [poolId] = event.event.data
  logger.info(`Pool ${poolId.toString()} created in block ${event.block.block.header.number}`)

  // Initialise Pool
  const poolService = await PoolService.init(
    poolId.toString(),
    event.block.timestamp,
    event.block.block.header.number.toNumber()
  )
  await poolService.initData(async (ticker) => (await CurrencyService.getOrInit(ticker)).currency.id)
  await poolService.save()

  // Initialise the tranches
  const tranches = await poolService.getTranches()
  for (const [id, tranche] of Object.entries(tranches)) {
    logger.info(`Creating tranche with id: ${id}`)
    const trancheService = await TrancheService.init(poolId.toString(), id, tranche.index, tranche.data)
    await trancheService.updateSupply()
    await trancheService.updateDebt(tranche.data.debt.toBigInt())
    await trancheService.save()
  }

  // Initialise Epoch
  const epochService = await EpochService.init(
    poolId.toString(),
    poolService.pool.currentEpoch,
    Object.keys(tranches),
    event.block.timestamp
  )
  await epochService.save()
}

export const handlePoolUpdated = errorHandler(_handlePoolUpdated)
async function _handlePoolUpdated(event: SubstrateEvent<PoolCreatedUpdatedEvent>): Promise<void> {
  const [poolId] = event.event.data
  const pool = await PoolService.getById(poolId.toString())
  logger.info(`Pool ${poolId.toString()} updated on block ${event.block.block.header.number}`)
  await pool.initData(async (ticker) => (await CurrencyService.getOrInit(ticker)).currency.id)
  await pool.save()

  // Deactivate active tranches
  const activeTranches = await TrancheService.getActives(poolId.toString())
  for (const activeTranche of activeTranches) {
    await activeTranche.deactivate()
    await activeTranche.save()
  }

  // Reprocess tranches
  const tranches = await pool.getTranches()
  for (const [id, tranche] of Object.entries(tranches)) {
    logger.info(`Syncing tranche with id: ${id}`)
    const trancheService = await TrancheService.getOrInit(poolId.toString(), id, tranche.index, tranche.data)
    await trancheService.activate()
    await trancheService.updateSupply()
    await trancheService.updateDebt(tranche.data.debt.toBigInt())
    await trancheService.save()
  }
}

export const handleEpochClosed = errorHandler(_handleEpochClosed)
async function _handleEpochClosed(event: SubstrateEvent<EpochEvent>): Promise<void> {
  const [poolId, epochId] = event.event.data
  logger.info(
    `Epoch ${epochId.toNumber()} closed for pool ${poolId.toString()} in block ${event.block.block.header.number}`
  )
  // Close the current epoch and open a new one
  const tranches = await TrancheService.getByPoolId(poolId.toString())
  const epoch = await EpochService.getById(poolId.toString(), epochId.toNumber())
  await epoch.closeEpoch(event.block.timestamp)
  await epoch.save()

  const trancheIds = tranches.map((tranche) => tranche.tranche.trancheId)
  const epochNext = await EpochService.init(
    poolId.toString(),
    epochId.toNumber() + 1,
    trancheIds,
    event.block.timestamp
  )
  await epochNext.save()

  const pool = await PoolService.getById(poolId.toString())
  await pool.closeEpoch(epochId.toNumber())
  await pool.save()
}

export const handleEpochExecuted = errorHandler(_handleEpochExecuted)
async function _handleEpochExecuted(event: SubstrateEvent<EpochEvent>): Promise<void> {
  const [poolId, epochId] = event.event.data
  logger.info(
    `Epoch ${epochId.toString()} executed event for pool ${poolId.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )

  const poolService = await PoolService.getById(poolId.toString())
  const epoch = await EpochService.getById(poolId.toString(), epochId.toNumber())
  const digits = (await CurrencyService.getById(poolService.pool.currencyId)).currency.decimals

  await epoch.executeEpoch(event.block.timestamp, digits)
  await epoch.save()

  await poolService.executeEpoch(epochId.toNumber())
  await poolService.save()

  // Compute and save aggregated order fulfillment
  const tranches = await TrancheService.getByPoolId(poolId.toString())
  const nextEpoch = await EpochService.getById(poolId.toString(), epochId.toNumber() + 1)
  for (const tranche of tranches) {
    const epochState = epoch.epochStates.find((epochState) => epochState.trancheId === tranche.tranche.trancheId)
    await tranche.updateSupply()
    await tranche.updatePrice(epochState.price)
    await tranche.updateFulfilledInvestOrders(epochState.fulfilledInvestOrders)
    await tranche.updateFulfilledRedeemOrders(epochState.fulfilledRedeemOrders)
    await tranche.save()

    // Carry over aggregated unfulfilled orders to next epoch
    await nextEpoch.updateOutstandingInvestOrders(
      tranche.tranche.trancheId,
      epochState.outstandingInvestOrders - epochState.fulfilledInvestOrders,
      BigInt(0)
    )
    await nextEpoch.updateOutstandingRedeemOrders(
      tranche.tranche.trancheId,
      epochState.outstandingRedeemOrders - epochState.fulfilledRedeemOrders,
      BigInt(0),
      epochState.price,
      digits
    )

    // Find single outstanding orders posted for this tranche and fulfill them to investorTransactions
    const oos = await OutstandingOrderService.getByTrancheId(poolId.toString(), tranche.tranche.trancheId)
    logger.info(`Fulfilling ${oos.length} outstanding orders for tranche ${tranche.tranche.trancheId}`)
    for (const oo of oos) {
      logger.info(
        `Outstanding invest before fulfillment: ${oo.outstandingOrder.invest} redeem:${oo.outstandingOrder.redeem}`
      )
      const orderData = {
        poolId: poolId.toString(),
        trancheId: tranche.tranche.trancheId,
        epochNumber: epochId.toNumber(),
        address: oo.outstandingOrder.accountId,
        hash: oo.outstandingOrder.hash,
        digits: (await CurrencyService.getById(poolService.pool.currencyId)).currency.decimals,
        price: epochState.price,
        fee: BigInt(0),
        timestamp: event.block.timestamp,
      }

      const trancheBalance = await TrancheBalanceService.getOrInit(
        orderData.address,
        orderData.poolId,
        orderData.trancheId
      )

      if (oo.outstandingOrder.invest > BigInt(0) && epochState.investFulfillment > BigInt(0)) {
        const it = InvestorTransactionService.executeInvestOrder({
          ...orderData,
          amount: oo.outstandingOrder.invest,
          fulfillmentRate: epochState.investFulfillment,
        })
        await it.save()
        await oo.updateUnfulfilledInvest(it.investorTransaction.currencyAmount)
        await trancheBalance.investExecuted(it.investorTransaction.currencyAmount, it.investorTransaction.tokenAmount)
      }

      if (oo.outstandingOrder.redeem > BigInt(0) && epochState.redeemFulfillment > BigInt(0)) {
        const it = InvestorTransactionService.executeRedeemOrder({
          ...orderData,
          amount: oo.outstandingOrder.redeem,
          fulfillmentRate: epochState.redeemFulfillment,
        })
        await it.save()
        await oo.updateUnfulfilledRedeem(it.investorTransaction.tokenAmount)
        await trancheBalance.redeemExecuted(it.investorTransaction.tokenAmount, it.investorTransaction.currencyAmount)
      }

      await trancheBalance.save()

      // Remove outstandingOrder if completely fulfilled
      if (oo.outstandingOrder.invest > BigInt(0) || oo.outstandingOrder.redeem > BigInt(0)) {
        await oo.save()
      } else {
        await oo.remove()
      }
      logger.info(
        `Outstanding invest after fulfillment: ${oo.outstandingOrder.invest} redeem:${oo.outstandingOrder.redeem}`
      )
    }
  }
  await nextEpoch.save()
}

export const handleInvestOrderUpdated = errorHandler(_handleInvestOrderUpdated)
async function _handleInvestOrderUpdated(event: SubstrateEvent<OrderEvent>): Promise<void> {
  const [poolId, trancheId, address, oldAmount, newAmount] = event.event.data
  logger.info(
    `Invest order updated for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `New: ${newAmount.toString()} Old: ${oldAmount.toString()} at ` +
      `block ${event.block.block.header.number.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  const account = await AccountService.getOrInit(address.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  // Update tranche price
  await tranche.updatePriceFromRpc()

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.pool.currentEpoch,
    address: account.account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: newAmount.toBigInt(),
    digits: (await CurrencyService.getById(pool.pool.currencyId)).currency.decimals,
    price: tranche.trancheState.price,
    fee: BigInt(0),
    timestamp: event.block.timestamp,
  }

  if (newAmount.toBigInt() > BigInt(0)) {
    // Post investor transaction
    const it = InvestorTransactionService.updateInvestOrder(orderData)
    await it.save()
  } else {
    // Cancel transaction
    const it = InvestorTransactionService.cancelInvestOrder(orderData)
    await it.save()
  }

  // Initialise or update outstanding transaction
  const oo = OutstandingOrderService.initInvest(orderData)
  await oo.save()

  // Update tranche outstanding total
  await tranche.updateOutstandingInvestOrders(newAmount.toBigInt(), oldAmount.toBigInt())
  await tranche.save()

  // Update epochState outstanding total
  const epoch = await EpochService.getById(poolId.toString(), pool.pool.currentEpoch)
  await epoch.updateOutstandingInvestOrders(trancheId.toHex(), newAmount.toBigInt(), oldAmount.toBigInt())
  await epoch.save()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)
  await trancheBalance.investOrdered(orderData.amount)
  await trancheBalance.save()
}

export const handleRedeemOrderUpdated = errorHandler(_handleRedeemOrderUpdated)
async function _handleRedeemOrderUpdated(event: SubstrateEvent<OrderEvent>): Promise<void> {
  const [poolId, trancheId, address, oldAmount, newAmount] = event.event.data
  logger.info(
    `Redeem order updated for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `New: ${newAmount.toString()} Old: ${oldAmount.toString()} at ` +
      `block ${event.block.block.header.number.toString()}`
  )
  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())
  const account = await AccountService.getOrInit(address.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())
  const digits = (await CurrencyService.getById(pool.pool.currencyId)).currency.decimals

  await tranche.updatePriceFromRpc()

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.pool.currentEpoch,
    address: account.account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: newAmount.toBigInt(),
    digits: digits,
    price: tranche.trancheState.price,
    fee: BigInt(0),
    timestamp: event.block.timestamp,
  }

  if (newAmount.toBigInt() > BigInt(0)) {
    // Post investor transaction
    const it = InvestorTransactionService.updateRedeemOrder(orderData)
    await it.save()
  } else {
    // Cancel transaction
    const it = InvestorTransactionService.cancelRedeemOrder(orderData)
    await it.save()
  }

  // Initialise outstanding transaction
  const oo = OutstandingOrderService.initInvest(orderData)
  await oo.save()

  // Update tranche outstanding total
  await tranche.updateOutstandingRedeemOrders(newAmount.toBigInt(), oldAmount.toBigInt(), digits)
  await tranche.save()

  // Update epochState outstanding total
  const epoch = await EpochService.getById(poolId.toString(), pool.pool.currentEpoch)
  await epoch.updateOutstandingRedeemOrders(
    trancheId.toHex(),
    newAmount.toBigInt(),
    oldAmount.toBigInt(),
    tranche.trancheState.price,
    digits
  )
  await epoch.save()

  // Update trancheBalance
  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)
  await trancheBalance.redeemOrdered(orderData.amount)
  await trancheBalance.save()
}

export const handleOrdersCollected = errorHandler(_handleOrdersCollected)
async function _handleOrdersCollected(event: SubstrateEvent<OrdersCollectedEvent>): Promise<void> {
  const [poolId, trancheId, endEpochId, address, outstandingCollections] = event.event.data
  logger.info(
    `Orders collected for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `Address: ${address.toString()} endEpoch: ${endEpochId.toNumber()} at ` +
      `block ${event.block.block.header.number.toString()} hash:${event.extrinsic.extrinsic.hash.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  const account = await AccountService.getOrInit(address.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  // Update tranche price
  await tranche.updatePriceFromRpc()
  await tranche.save()

  const { payoutTokenAmount, payoutCurrencyAmount } = outstandingCollections

  const orderData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId.toNumber(),
    address: account.account.id,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    digits: (await CurrencyService.getById(pool.pool.currencyId)).currency.decimals,
    price: tranche.trancheState.price,
  }

  const trancheBalance = await TrancheBalanceService.getOrInit(orderData.address, orderData.poolId, orderData.trancheId)

  if (payoutTokenAmount.toBigInt() > 0) {
    const it = InvestorTransactionService.collectInvestOrder({ ...orderData, amount: payoutTokenAmount.toBigInt() })
    await it.save()
    await trancheBalance.investCollected(payoutTokenAmount.toBigInt())
  }

  if (payoutCurrencyAmount.toBigInt() > 0) {
    const it = InvestorTransactionService.collectRedeemOrder({ ...orderData, amount: payoutCurrencyAmount.toBigInt() })
    await it.save()
    await trancheBalance.redeemCollected(payoutCurrencyAmount.toBigInt())
  }
  await trancheBalance.save()
}
