import { SubstrateEvent } from '@subql/types'
import { OracleFedEvent } from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'

export const handleOracleFed = errorHandler(_handleOracleFed)
async function _handleOracleFed(event: SubstrateEvent<OracleFedEvent>) {
  const [feeder, key, value] = event.event.data
  logger.info(`Oracle feed: ${feeder.toString()} key: ${key.toString()} value: ${value.toString()}`)
}
