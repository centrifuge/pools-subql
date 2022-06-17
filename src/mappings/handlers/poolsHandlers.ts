import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EpochEvent, OrderEvent } from '../../helpers/types'

import { InvestorTransactionType } from '../../types'
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

  // Initialise the tranches
  for (const [index, trancheData] of tranches.entries()) {
    const trancheId = ids.toArray()[index].toHex()
    logger.info(`Creating tranche with id: ${trancheId}`)
    const trancheService = await TrancheService.init(trancheId, poolId.toString(), trancheData)
    await trancheService.updateTranchePrice(1)
    await trancheService.updateTrancheSupply()
    await trancheService.save()
  }

  // Initialise Epoch
  const epochService = await EpochService.init(poolId.toString(), poolService.pool.currentEpoch, event.block.timestamp)
  await epochService.save()
}

export const handleEpochClosed = errorHandler(_handleEpochClosed)
async function _handleEpochClosed(event: SubstrateEvent): Promise<void> {
  logger.info(`Epoch closed in block ${event.block.block.header.number}: ${event.toString()}`)

  // Close the current epoch and open a new one
  const [poolId, epochId] = event.event.data as unknown as EpochEvent
  const epochService = await EpochService.getById(`${poolId.toString()}-${epochId.toString()}`)
  await epochService.closeEpoch(event.block.timestamp)
  await epochService.save()

  const epochServiceNext = await EpochService.init(poolId.toString(), epochId.toNumber() + 1, event.block.timestamp)
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

  const epochService = await EpochService.getById(`${poolId.toString()}-${epochId.toString()}`)
  await epochService.executeEpoch(event.block.timestamp)
  await epochService.save()

  const tranches = await TrancheService.getByPoolId(poolId.toString())
  for (const tranche of tranches) {
    await tranche.updateTranchePrice(epochId.toNumber())
    await tranche.updateTrancheSupply()
    await tranche.save()
  }

  const poolService = await PoolService.getById(poolId.toString())
  await poolService.executeEpoch(epochId.toNumber())
  await poolService.save()

  // TODO: loop over OutstandingOrder, apply fulfillment from epoch, create InvestorTransactions,
  // optionally remove orders
  //const orders = await OutstandingOrder.getByPoolId(poolId.toString())
  //logger.info(`Orders: ${JSON.stringify(orders)}`)
}

export const handleInvestOrderUpdated = errorHandler(_handleInvestOrderUpdated)
async function _handleInvestOrderUpdated(event: SubstrateEvent): Promise<void> {
  logger.info(`Invest order updated: ${event.toString()}`)
  await handleOrderUpdated(event, InvestorTransactionType.INVEST_ORDER_UPDATE)
}

export const handleRedeemOrderUpdated = errorHandler(_handleRedeemOrderUpdated)
async function _handleRedeemOrderUpdated(event: SubstrateEvent): Promise<void> {
  logger.info(`Redeem order updated: ${event.toString()}`)
  await handleOrderUpdated(event, InvestorTransactionType.REDEEM_ORDER_UPDATE)
}

const handleOrderUpdated = errorHandler(_handleOrderUpdate)
async function _handleOrderUpdate(event: SubstrateEvent, type: InvestorTransactionType) {
  const [poolId, trancheId, , , newOrder] = event.event.data as unknown as OrderEvent

  const pool = await PoolService.getById(poolId.toString())

  // const account = await loadOrCreateAccount(address.toString())

  const tx = await InvestorTransactionService.init(
    poolId.toString(),
    trancheId.toHex(),
    pool.pool.currentEpoch,
    event.hash.toString(),
    type,
    newOrder.toBigInt(),
    event.block.timestamp
  )
  await tx.save()
}

// async function loadOrCreateAccount(address: string) {
//   try {
//     const account = await Account.get(address)

//     if (!account) {
//       let account = new Account(address)
//       account.publicAddress = address
//       await account.save()
//       return account
//     }

//     return account
//   } catch (e) {
//     logger.error(`${e}`)
//   }
// }

// async function loadOrCreateOutstandingOrder(poolId: string, trancheId: string, address: string) {
//   try {
//     const id = `${poolId.toString()}-${trancheId.toString()}-${address}`

//     const order = await OutstandingOrder.get(id)

//     if (!order) {
//       let order = new OutstandingOrder(id)
//       order.poolId = poolId
//       order.trancheId = `${poolId}-${trancheId}`

//       order.invest = BigInt(0)
//       order.redeem = BigInt(0)
//       // order.accountId = accountId
//       await order.save()

//       return order
//     }

//     return order
//   } catch (e) {
//     logger.error(`${e}`)
//   }
// }
