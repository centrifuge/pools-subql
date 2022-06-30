import { SubstrateEvent, SubstrateBlock } from '@subql/types'
import { EpochEvent } from 'centrifuge-subql/helpers/types'
import { errorHandler } from '../helpers/errorHandler'
import { Epoch, OutstandingOrder, PoolState, Tranche } from '../types'
import { updateTranchePrice } from './tranches'

export const createEpoch = errorHandler(_createEpoch)
async function _createEpoch(poolId: string, epochId: number, block: SubstrateBlock): Promise<Epoch> {
  const epoch = new Epoch(`${poolId.toString()}-${epochId.toString()}`)

  epoch.index = epochId
  epoch.poolId = poolId

  epoch.openedAt = block.timestamp

  await epoch.save()
  return epoch
}

export const closeEpoch = errorHandler(_closeEpoch)
async function _closeEpoch(poolId: string, epochId: number, block?: SubstrateBlock): Promise<Epoch> {
  const epoch = await Epoch.get(`${poolId.toString()}-${epochId.toString()}`)
  epoch.openedAt = block.timestamp
  await epoch.save()
  return epoch
}

export const executeEpoch = errorHandler(_executeEpoch)
async function _executeEpoch(poolId: string, epochId: number, block?: SubstrateBlock): Promise<Epoch> {
  const epoch = await Epoch.get(`${poolId.toString()}-${epochId.toString()}`)

  epoch.openedAt = block.timestamp

  await epoch.save()
  return epoch
}

export const handleEpochClosed = errorHandler(_handleEpochClosed)
async function _handleEpochClosed(event: SubstrateEvent): Promise<void> {
  logger.info(`Epoch closed in block ${event.block.block.header.number}: ${event.toString()}`)

  // Close the current epoch and open a new one
  const [poolId, epochId] = event.event.data as unknown as EpochEvent
  await closeEpoch(poolId.toString(), epochId.toNumber(), event.block)
  await createEpoch(poolId.toString(), epochId.toNumber() + 1, event.block)
}

export const handleEpochExecuted = errorHandler(_handleEpochExecuted)
async function _handleEpochExecuted(event: SubstrateEvent): Promise<void> {
  const [poolId, epochId] = event.event.data as unknown as EpochEvent
  logger.info(
    `Epoch ${epochId.toString()} executed for pool ${poolId.toString()} at block ${event.block.block.header.number.toString()}`
  )
  await executeEpoch(poolId.toString(), epochId.toNumber(), event.block)
  const tranches = await Tranche.getByPoolId(poolId.toString())
  for (const tranche of tranches) {
    await updateTranchePrice(poolId.toString(), tranche.trancheId, epochId.toNumber())
  }

  // TODO: loop over OutstandingOrder, apply fulfillment from epoch, create InvestorTransactions, optionally remove orders
  const orders = await OutstandingOrder.getByPoolId(poolId.toString())
  logger.info(`Orders: ${JSON.stringify(orders)}`)
}
