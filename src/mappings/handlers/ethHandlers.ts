import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'

export const ethLogger = errorHandler(_ethLogger)
async function _ethLogger(event: SubstrateEvent): Promise<void> {
  logger.info(JSON.stringify(event))
}
