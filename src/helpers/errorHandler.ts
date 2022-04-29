import { SubstrateBlock, SubstrateEvent, SubstrateExtrinsic } from '@subql/types'

export interface HandlerFunction {
  (obj: SubstrateBlock | SubstrateEvent | SubstrateExtrinsic): Promise<any>
}

export function errorHandler(method: HandlerFunction): HandlerFunction {
    return async function(obj: SubstrateBlock | SubstrateEvent | SubstrateExtrinsic): Promise<any> {
      return method(obj).catch(err => {
        logger.error(err)
      })
    }
}