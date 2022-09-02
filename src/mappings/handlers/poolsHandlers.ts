import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EpochEvent, OrderEvent, OrdersCollectedEvent, PoolEvent } from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionData, InvestorTransactionService } from '../services/investorTransactionService'
import { CurrencyService } from '../services/currencyService'

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent<PoolEvent>): Promise<void> {
  const [poolId] = event.event.data
  logger.info(`Pool ${poolId.toString()} created in block ${event.block.block.header.number}`)

  // Initialise Pool
  const poolService = await PoolService.init(
    poolId.toString(),
    event.block.timestamp,
    event.block.block.header.number.toNumber(),
    async (ticker) => (await CurrencyService.getOrInit(ticker)).currency.id
  )
  await poolService.save()

  const { ids, tranches } = poolService.tranches
  const trancheIds = ids.map((id) => id.toHex())

  // Initialise the tranches
  for (const [index, trancheData] of tranches.entries()) {
    const trancheId = trancheIds[index]
    logger.info(`Creating tranche with id: ${trancheId}`)
    const trancheService = await TrancheService.init(poolId.toString(), trancheId, index, trancheData)
    await trancheService.updateSupply()
    await trancheService.updateDebt(trancheData.debt.toBigInt())
    await trancheService.save()
  }

  // Initialise Epoch
  const epochService = await EpochService.init(
    poolId.toString(),
    poolService.pool.currentEpoch,
    trancheIds,
    event.block.timestamp
  )
  await epochService.save()
}

export const handlePoolUpdated = errorHandler(_handlePoolUpdated)
async function _handlePoolUpdated(event: SubstrateEvent<PoolEvent>): Promise<void> {
  const [poolId] = event.event.data
  logger.info(`Pool ${poolId.toString()} updated on block ${event.block.block.header.number}`)
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

  const epoch = await EpochService.getById(poolId.toString(), epochId.toNumber())
  await epoch.executeEpoch(event.block.timestamp)
  await epoch.save()

  const poolService = await PoolService.getById(poolId.toString())
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
      BigInt(0)
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

      if (oo.outstandingOrder.invest > BigInt(0) && epochState.investFulfillment > BigInt(0)) {
        const it = InvestorTransactionService.executeInvestOrder({
          ...orderData,
          amount: oo.outstandingOrder.invest,
          fulfillmentRate: epochState.investFulfillment,
        })
        await it.save()
        await oo.updateUnfulfilledInvest(it.investorTransaction.currencyAmount)
      }

      if (oo.outstandingOrder.redeem > BigInt(0) && epochState.redeemFulfillment > BigInt(0)) {
        const it = InvestorTransactionService.executeRedeemOrder({
          ...orderData,
          amount: oo.outstandingOrder.redeem,
          fulfillmentRate: epochState.redeemFulfillment,
        })
        await it.save()
        await oo.updateUnfulfilledRedeem(it.investorTransaction.tokenAmount)
      }

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
  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  // Update tranche price
  await tranche.updatePriceFromRpc()
  await tranche.save()

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.pool.currentEpoch,
    address: address.toString(),
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
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  const orderData: InvestorTransactionData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: pool.pool.currentEpoch,
    address: address.toString(),
    hash: event.extrinsic.extrinsic.hash.toString(),
    amount: newAmount.toBigInt(),
    digits: (await CurrencyService.getById(pool.pool.currencyId)).currency.decimals,
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
  await tranche.updateOutstandingRedeemOrders(newAmount.toBigInt(), oldAmount.toBigInt())
  await tranche.save()

  // Update epochState outstanding total
  const epoch = await EpochService.getById(poolId.toString(), pool.pool.currentEpoch)
  await epoch.updateOutstandingRedeemOrders(trancheId.toHex(), newAmount.toBigInt(), oldAmount.toBigInt())
  await epoch.save()
}

export const handleOrdersCollected = errorHandler(_handleOrdersCollected)
async function _handleOrdersCollected(event: SubstrateEvent<OrdersCollectedEvent>): Promise<void> {
  const [poolId, trancheId, endEpochId, account, outstandingCollections] = event.event.data
  logger.info(
    `Orders collected for tranche ${poolId.toString()}-${trancheId.toString()}. ` +
      `Address: ${account.toString()} endEpoch: ${endEpochId.toNumber()} at ` +
      `block ${event.block.block.header.number.toString()} hash:${event.extrinsic.extrinsic.hash.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

  // Update tranche price
  await tranche.updatePriceFromRpc()
  await tranche.save()

  const { payoutTokenAmount, payoutCurrencyAmount } = outstandingCollections

  const orderData = {
    poolId: poolId.toString(),
    trancheId: trancheId.toString(),
    epochNumber: endEpochId.toNumber(),
    address: account.toString(),
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    digits: (await CurrencyService.getById(pool.pool.currencyId)).currency.decimals,
    price: tranche.trancheState.price,
  }

  if (payoutTokenAmount.toBigInt() > 0) {
    const it = InvestorTransactionService.collectInvestOrder({ ...orderData, amount: payoutTokenAmount.toBigInt() })
    await it.save()
  }

  if (payoutCurrencyAmount.toBigInt() > 0) {
    const it = InvestorTransactionService.collectRedeemOrder({ ...orderData, amount: payoutCurrencyAmount.toBigInt() })
    await it.save()
  }
}
