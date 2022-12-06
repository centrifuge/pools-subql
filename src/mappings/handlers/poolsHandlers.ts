import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EpochClosedExecutedEvent, PoolCreatedEvent, PoolUpdatedEvent } from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionService } from '../services/investorTransactionService'
import { CurrencyService } from '../services/currencyService'
import { TrancheBalanceService } from '../services/trancheBalanceService'

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent<PoolCreatedEvent>): Promise<void> {
  const [, , poolId, essence] = event.event.data
  logger.info(
    `Pool ${poolId.toString()} with currency: ${essence.currency.type} ` +
      `created in block ${event.block.block.header.number}`
  )

  const currency = await CurrencyService.getOrInit(essence.currency.type)

  // Initialise Pool
  const pool = await PoolService.init(
    poolId.toString(),
    currency.id,
    essence.maxReserve.toBigInt(),
    essence.maxNavAge.toNumber(),
    essence.minEpochTime.toNumber(),
    event.block.timestamp,
    event.block.block.header.number.toNumber()
  )
  await pool.initData()
  await pool.save()

  // Initialise the tranches
  const trancheData = await pool.getTranches()
  const tranches = essence.tranches.map((trancheEssence, index) => {
    const trancheId = trancheEssence.currency.trancheId.toHex()
    logger.info(`Creating tranche with id: ${pool.id}-${trancheId}`)
    return TrancheService.init(pool.id, trancheId, index, trancheData[trancheId].data)
  })

  for (const tranche of tranches) {
    await tranche.updateSupply()
    await tranche.save()
  }

  // Initialise Epoch
  const trancheIds = tranches.map((tranche) => tranche.trancheId)
  const epoch = await EpochService.init(poolId.toString(), pool.currentEpoch, trancheIds, event.block.timestamp)
  await epoch.saveWithStates()
}

export const handlePoolUpdated = errorHandler(_handlePoolUpdated)
async function _handlePoolUpdated(event: SubstrateEvent<PoolUpdatedEvent>): Promise<void> {
  const [poolId] = event.event.data
  logger.info(`Pool ${poolId.toString()} updated on block ${event.block.block.header.number}`)

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  await pool.initData()
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
async function _handleEpochClosed(event: SubstrateEvent<EpochClosedExecutedEvent>): Promise<void> {
  const [poolId, epochId] = event.event.data
  logger.info(
    `Epoch ${epochId.toNumber()} closed for pool ${poolId.toString()} in block ${event.block.block.header.number}`
  )
  // Close the current epoch and open a new one
  const tranches = await TrancheService.getActives(poolId.toString())
  const epoch = await EpochService.getById(poolId.toString(), epochId.toNumber())
  await epoch.closeEpoch(event.block.timestamp)
  await epoch.saveWithStates()

  const trancheIds = tranches.map((tranche) => tranche.trancheId)
  const nextEpoch = await EpochService.init(
    poolId.toString(),
    epochId.toNumber() + 1,
    trancheIds,
    event.block.timestamp
  )
  await nextEpoch.saveWithStates()

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  await pool.closeEpoch(epochId.toNumber())
  await pool.save()
}

export const handleEpochExecuted = errorHandler(_handleEpochExecuted)
async function _handleEpochExecuted(event: SubstrateEvent<EpochClosedExecutedEvent>): Promise<void> {
  const [poolId, epochId] = event.event.data
  logger.info(
    `Epoch ${epochId.toString()} executed event for pool ${poolId.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const epoch = await EpochService.getById(poolId.toString(), epochId.toNumber())
  const digits = ((await CurrencyService.get(pool.currencyId)) as CurrencyService).decimals

  await epoch.executeEpoch(event.block.timestamp, digits)
  await epoch.saveWithStates()

  await pool.executeEpoch(epochId.toNumber())
  await pool.increaseTotalInvested(epoch.totalInvested)
  await pool.increaseTotalRedeemed(epoch.totalRedeemed)
  await pool.save()

  // Compute and save aggregated order fulfillment
  const tranches = await TrancheService.getByPoolId(poolId.toString())
  const nextEpoch = await EpochService.getById(poolId.toString(), epochId.toNumber() + 1)
  for (const tranche of tranches) {
    const epochState = epoch.states.find((epochState) => epochState.trancheId === tranche.trancheId)
    await tranche.updateSupply()
    await tranche.updatePrice(epochState.price)
    await tranche.updateFulfilledInvestOrders(epochState.fulfilledInvestOrders)
    await tranche.updateFulfilledRedeemOrders(epochState.fulfilledRedeemOrders, digits)
    await tranche.save()

    // Carry over aggregated unfulfilled orders to next epoch
    await nextEpoch.updateOutstandingInvestOrders(
      tranche.trancheId,
      epochState.outstandingInvestOrders - epochState.fulfilledInvestOrders,
      BigInt(0)
    )
    await nextEpoch.updateOutstandingRedeemOrders(
      tranche.trancheId,
      epochState.outstandingRedeemOrders - epochState.fulfilledRedeemOrders,
      BigInt(0),
      epochState.price,
      digits
    )

    // Find single outstanding orders posted for this tranche and fulfill them to investorTransactions
    const oos = await OutstandingOrderService.getAllByTrancheId(poolId.toString(), tranche.trancheId)
    logger.info(`Fulfilling ${oos.length} outstanding orders for tranche ${tranche.trancheId}`)
    for (const oo of oos) {
      logger.info(`Outstanding invest before fulfillment: ${oo.invest} redeem:${oo.redeem}`)
      const orderData = {
        poolId: poolId.toString(),
        trancheId: tranche.trancheId,
        epochNumber: epochId.toNumber(),
        address: oo.accountId,
        hash: oo.hash,
        digits: ((await CurrencyService.get(pool.currencyId)) as CurrencyService).decimals,
        price: epochState.price,
        fee: BigInt(0),
        timestamp: event.block.timestamp,
      }

      const trancheBalance = await TrancheBalanceService.getOrInit(
        orderData.address,
        orderData.poolId,
        orderData.trancheId
      )

      if (oo.invest > BigInt(0) && epochState.investFulfillment > BigInt(0)) {
        const it = InvestorTransactionService.executeInvestOrder({
          ...orderData,
          amount: oo.invest,
          fulfillmentRate: epochState.investFulfillment,
        })
        await it.save()
        await oo.updateUnfulfilledInvest(it.currencyAmount)
        await trancheBalance.investExecute(it.currencyAmount, it.tokenAmount)
      }

      if (oo.redeem > BigInt(0) && epochState.redeemFulfillment > BigInt(0)) {
        const it = InvestorTransactionService.executeRedeemOrder({
          ...orderData,
          amount: oo.redeem,
          fulfillmentRate: epochState.redeemFulfillment,
        })
        await it.save()
        await oo.updateUnfulfilledRedeem(it.tokenAmount)
        await trancheBalance.redeemExecute(it.tokenAmount, it.currencyAmount)
      }

      await trancheBalance.save()

      // Remove outstandingOrder if completely fulfilled
      if (oo.invest > BigInt(0) || oo.redeem > BigInt(0)) {
        await oo.save()
      } else {
        await OutstandingOrderService.remove(oo.id)
      }
      logger.info(`Outstanding invest after fulfillment: ${oo.invest} redeem:${oo.redeem}`)
    }
  }
  await nextEpoch.saveWithStates()
}
