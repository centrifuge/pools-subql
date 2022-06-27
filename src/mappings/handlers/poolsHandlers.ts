import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EpochEvent, OrderEvent } from '../../helpers/types'
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

  const epochService = await EpochService.getById(`${poolId.toString()}-${epochId.toString()}`)
  await epochService.executeEpoch(event.block.timestamp)
  await epochService.save()

  const tranches = await TrancheService.getByPoolId(poolId.toString())
  for (const tranche of tranches) {
    await tranche.updateSupply()
    await tranche.updatePrice(
      epochService.epochStates.find((epochState) => epochState.trancheId === tranche.tranche.trancheId).price
    )
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
  const [poolId, trancheId, , oldAmount, newAmount] = event.event.data as unknown as OrderEvent
  logger.info(
    `Invest order updated for tranche ${poolId.toString()}-${trancheId.toString()}. 
    New: ${newAmount.toString()} Old: ${oldAmount.toString()}`
  )

  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())

  // Initialise transaction
  const tx = InvestorTransactionService.initInvestOrder(
    poolId.toString(),
    trancheId.toHex(),
    pool.pool.currentEpoch,
    event.hash.toString(),
    newAmount.toBigInt(),
    event.block.timestamp
  )
  await tx.save()

  // Update tranche outstanding total
  const tranche = await TrancheService.getById(`${poolId.toString()}-${trancheId.toHex()}`)
  await tranche.updateOutstandingInvestOrders(newAmount.toBigInt(), oldAmount.toBigInt())
  await tranche.save()
}

export const handleRedeemOrderUpdated = errorHandler(_handleRedeemOrderUpdated)
async function _handleRedeemOrderUpdated(event: SubstrateEvent): Promise<void> {
  const [poolId, trancheId, , oldAmount, newAmount] = event.event.data as unknown as OrderEvent
  logger.info(`Redeem order updated for tranche ${poolId.toString()}-${trancheId.toString()}. 
  New: ${newAmount.toString()} Old: ${oldAmount.toString()}`)

  // Get corresponding pool
  const pool = await PoolService.getById(poolId.toString())

  // Initialise transaction
  const tx = InvestorTransactionService.initRedeemOrder(
    poolId.toString(),
    trancheId.toHex(),
    pool.pool.currentEpoch,
    event.hash.toString(),
    newAmount.toBigInt(),
    event.block.timestamp
  )
  await tx.save()

  // Update tranche outstanding total
  const tranche = await TrancheService.getById(`${poolId.toString()}-${trancheId.toHex()}`)
  await tranche.updateOutstandingRedeemOrders(newAmount.toBigInt(), oldAmount.toBigInt())
  await tranche.save()
}
