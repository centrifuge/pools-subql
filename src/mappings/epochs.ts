import { SubstrateEvent } from '@subql/types'
import { Epoch, OutstandingOrder } from '../types'

export async function handleEpochClosed(event: SubstrateEvent): Promise<void> {
  logger.info(`Epoch closed in block ${event.block.block.header.number}: ${event.toString()}`)

  // Close the current epoch
  const [poolId, epochId] = event.event.data
  let epoch = await Epoch.get(`${poolId.toString()}-${epochId.toString()}`)
  epoch.closedAt = event.block.timestamp
  await epoch.save()

  // Create the new epoch
  const newIndex = Number(epochId.toString()) + 1
  let newEpoch = new Epoch(`${poolId.toString()}-${newIndex}`)
  newEpoch.index = newIndex
  newEpoch.poolId = poolId.toString()
  newEpoch.openedAt = event.block.timestamp
  await newEpoch.save()
}


export async function handleEpochExecuted(event: SubstrateEvent): Promise<void> {
  logger.info(`Epoch executed: ${event.toString()}`)

  // Execute the epoch
  const [poolId, epochId] = event.event.data
  let epoch = await Epoch.get(`${poolId.toString()}-${epochId.toString()}`)
  logger.info(`Epoch Execution Block: ${JSON.stringify(event.block)}`)
  epoch.executedAt = event.block.timestamp
  await epoch.save()

  // TODO: loop over OutstandingOrder, apply fulfillment from epoch, create InvestorTransactions, optionally remove orders
  const orders = await OutstandingOrder.getByPoolId(poolId.toString())
  logger.info(`Orders: ${JSON.stringify(orders)}`)
}
