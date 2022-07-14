import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EpochEvent, OrderEvent, OrdersCollectedEvent } from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionService } from '../services/investorTransactionService'

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent): Promise<void> {
  const [poolId] = event.event.data
  logger.info(`Pool ${poolId.toString()} created in block ${event.block.block.header.number}`)

  // Initialise Pool
  const poolService = await PoolService.init(
    poolId.toString(),
    event.block.timestamp,
    event.block.block.header.number.toNumber()
  )
  await poolService.save()

  const { ids, tranches } = poolService.tranches
  const trancheIds = ids.map((id) => id.toHex())

  // Initialise the tranches
  for (const [index, trancheData] of tranches.entries()) {
    const trancheId = trancheIds[index]
    logger.info(`Creating tranche with id: ${trancheId}`)
    const trancheService = await TrancheService.init(trancheId, poolId.toString(), trancheData)
    await trancheService.updateSupply()
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

export const handleEpochClosed = errorHandler(_handleEpochClosed)
async function _handleEpochClosed(event: SubstrateEvent): Promise<void> {
  logger.info(`Epoch closed in block ${event.block.block.header.number}: ${event.toString()}`)

  // Close the current epoch and open a new one
  const [poolId, epochId] = event.event.data as unknown as EpochEvent
  const tranches = await TrancheService.getByPoolId(poolId.toString())
  const epochService = await EpochService.getById(`${poolId.toString()}-${epochId.toString()}`)
  await epochService.closeEpoch(event.block.timestamp)
  await epochService.save()

  const trancheIds = tranches.map((tranche) => tranche.tranche.trancheId)
  const epochServiceNext = await EpochService.init(
    poolId.toString(),
    epochId.toNumber() + 1,
    trancheIds,
    event.block.timestamp
  )
  await epochServiceNext.save()

  const poolService = await PoolService.getById(poolId.toString())
  await poolService.closeEpoch(epochId.toNumber())
  await poolService.save()
}

export const handleEpochExecuted = errorHandler(_handleEpochExecuted)
async function _handleEpochExecuted(event: SubstrateEvent): Promise<void> {
  const [poolId, epochId] = event.event.data as unknown as EpochEvent
  logger.info(
    `Epoch ${epochId.toString()} executed for pool ${poolId.toString()} at\
     block ${event.block.block.header.number.toString()}`
  )

  const epoch = await EpochService.getById(`${poolId.toString()}-${epochId.toString()}`)
  await epoch.executeEpoch(event.block.timestamp)
  await epoch.save()

  const poolService = await PoolService.getById(poolId.toString())
  await poolService.executeEpoch(epochId.toNumber())
  await poolService.save()

  // Compute and save aggregated order fulfillment
  const tranches = await TrancheService.getByPoolId(poolId.toString())
  const nextEpoch = await EpochService.getById(`${poolId.toString()}-${(epochId.toNumber() + 1).toString()}`)
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
      if (oo.outstandingOrder.invest > BigInt(0)) {
        const it = InvestorTransactionService.initInvestOrder(
          poolId.toString(),
          tranche.tranche.trancheId,
          epochId.toNumber(),
          oo.outstandingOrder.accountId,
          event.extrinsic.extrinsic.hash.toString(),
          oo.outstandingOrder.invest,
          epochState.investFulfillment,
          event.block.timestamp
        )
        await it.save()
        await oo.updateUnfulfilledInvest(epochState.investFulfillment)
      }
      if (oo.outstandingOrder.redeem > BigInt(0)) {
        const it = InvestorTransactionService.initRedeemOrder(
          poolId.toString(),
          tranche.tranche.trancheId,
          epochId.toNumber(),
          oo.outstandingOrder.accountId,
          event.extrinsic.extrinsic.hash.toString(),
          oo.outstandingOrder.redeem,
          epochState.redeemFulfillment,
          event.block.timestamp
        )
        await it.save()
        await oo.updateUnfulfilledRedeem(epochState.redeemFulfillment)
      }

      // Remove outstandingOrder if completely fulfilled
      if (oo.outstandingOrder.invest > BigInt(0) && oo.outstandingOrder.invest > BigInt(0)) {
        await oo.save()
      } else {
        await oo.remove()
      }
    }
  }
  await nextEpoch.save()
}

export const handleInvestOrderUpdated = errorHandler(_handleInvestOrderUpdated)
async function _handleInvestOrderUpdated(event: SubstrateEvent): Promise<void> {
  const [poolId, trancheId, address, oldAmount, newAmount] = event.event.data as unknown as OrderEvent
  logger.info(
    `Invest order updated for tranche ${poolId.toString()}-${trancheId.toString()}. 
    New: ${newAmount.toString()} Old: ${oldAmount.toString()} at\
    block ${event.block.block.header.number.toString()}`
  )

  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())

  // Initialise outstanding transaction
  const oo = OutstandingOrderService.initInvest(
    poolId.toString(),
    trancheId.toString(),
    pool.pool.currentEpoch,
    address.toString(),
    event.extrinsic.extrinsic.hash.toString(),
    newAmount.toBigInt(),
    event.block.timestamp
  )
  await oo.save()

  // Update tranche outstanding total
  const tranche = await TrancheService.getById(`${poolId.toString()}-${trancheId.toHex()}`)
  await tranche.updateOutstandingInvestOrders(newAmount.toBigInt(), oldAmount.toBigInt())
  await tranche.save()

  // Update epochState outstanding total
  const epoch = await EpochService.getById(`${poolId.toString()}-${pool.pool.currentEpoch}`)
  await epoch.updateOutstandingInvestOrders(trancheId.toHex(), newAmount.toBigInt(), oldAmount.toBigInt())
  await epoch.save()
}

export const handleRedeemOrderUpdated = errorHandler(_handleRedeemOrderUpdated)
async function _handleRedeemOrderUpdated(event: SubstrateEvent): Promise<void> {
  const [poolId, trancheId, address, oldAmount, newAmount] = event.event.data as unknown as OrderEvent
  logger.info(`Redeem order updated for tranche ${poolId.toString()}-${trancheId.toString()}. 
  New: ${newAmount.toString()} Old: ${oldAmount.toString()} at\
  block ${event.block.block.header.number.toString()}`)

  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())

  // Initialise outstanding transaction
  const oo = OutstandingOrderService.initInvest(
    poolId.toString(),
    trancheId.toString(),
    pool.pool.currentEpoch,
    address.toString(),
    event.extrinsic.extrinsic.hash.toString(),
    newAmount.toBigInt(),
    event.block.timestamp
  )
  await oo.save()

  // Update tranche outstanding total
  const tranche = await TrancheService.getById(`${poolId.toString()}-${trancheId.toHex()}`)
  await tranche.updateOutstandingRedeemOrders(newAmount.toBigInt(), oldAmount.toBigInt())
  await tranche.save()

  // Update epochState outstanding total
  const epoch = await EpochService.getById(`${poolId.toString()}-${pool.pool.currentEpoch}`)
  await epoch.updateOutstandingRedeemOrders(trancheId.toHex(), newAmount.toBigInt(), oldAmount.toBigInt())
  await epoch.save()
}

export const handleOrdersCollected = errorHandler(_handleOrdersCollected)
async function _handleOrdersCollected(event: SubstrateEvent): Promise<void> {
  const [poolId, trancheId, endEpochId, account] = event.event.data as unknown as OrdersCollectedEvent
  logger.info(`Orders collected for tranche ${poolId.toString()}-${trancheId.toString()}. 
  Address: ${account.toString()} endEpoch: ${endEpochId.toNumber()} at\
  block ${event.block.block.header.number.toString()} hash:${event.extrinsic.extrinsic.hash.toString()}`)
}
