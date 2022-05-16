import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../helpers/errorHandler'
import { Epoch, OutstandingOrder } from '../types'

export const handleEpochClosed = errorHandler(_handleEpochClosed)
async function _handleEpochClosed(event: SubstrateEvent): Promise<void> {
  logger.info(`Epoch closed in block ${event.block.block.header.number}: ${event.toString()}`)

  // Close the current epoch
  const [poolId, epochId] = event.event.data
  let epoch = await Epoch.get(`${poolId.toString()}-${epochId.toString()}`)
  if (!epoch) {
    logger.error(`Epoch ${epochId.toString()} does not exist when closing, should have been created already.`)
    epoch = new Epoch(`${poolId.toString()}-${epochId.toString()}`)
    epoch.index = Number(epochId.toString())
    epoch.poolId = poolId.toString()
  }

  epoch.closedAt = event.block.timestamp
  await epoch.save()

  // Create the new epoch
  const newIndex = Number(epochId.toString()) + 1
  let newEpoch = new Epoch(`${poolId.toString()}-${newIndex.toString()}`)
  newEpoch.index = newIndex
  newEpoch.poolId = poolId.toString()
  newEpoch.openedAt = event.block.timestamp
  await newEpoch.save()
}

export const handleEpochExecuted = errorHandler(_handleEpochExecuted)
async function _handleEpochExecuted(event: SubstrateEvent): Promise<void> {
  logger.info(`Epoch executed: ${event.toString()}`)

  // Execute the epoch
  const [poolId, epochId] = event.event.data
  let epoch = await Epoch.get(`${poolId.toString()}-${epochId.toString()}`)
  if (!epoch) {
    logger.error(`Epoch ${epochId.toString()} does not exist when executing, should have been created already.`)
    epoch = new Epoch(`${poolId.toString()}-${epochId.toString()}`)
    epoch.index = Number(epochId.toString())
    epoch.poolId = poolId.toString()
  }

  epoch.executedAt = event.block.timestamp
  await epoch.save()

  // TODO: loop over OutstandingOrder, apply fulfillment from epoch, create InvestorTransactions, optionally remove orders
  const orders = await OutstandingOrder.getByPoolId(poolId.toString())
  logger.info(`Orders: ${JSON.stringify(orders)}`)
}
