import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'

export const logEvents = errorHandler(_logEvents)
async function _logEvents(event: SubstrateEvent) {
  if (event.event.section === 'system') return
  logger.info(
    `Event method fired for pallet ${event.event.section}: ${event.event.method} ` +
      `at block ${event.block.block.header.number.toNumber()}`
  )
}
