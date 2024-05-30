import { SubstrateEvent } from '@subql/types'
import { OracleFedEvent } from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { OracleTransactionData, OracleTransactionService } from '../services/oracleTransactionService'

export const handleOracleFed = errorHandler(_handleOracleFed)
async function _handleOracleFed(event: SubstrateEvent<OracleFedEvent>) {
  const [feeder, key, value] = event.event.data
  logger.info(`Oracle feed: ${feeder.toString()} key: ${key.isin.toString()} value: ${value.toString()}`)

  const oracleTxData: OracleTransactionData = {
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    key: key.isin.toString(),
    value: value.toBigInt(),
  }

  const oracleTx = OracleTransactionService.init(oracleTxData)
  await oracleTx.save()
}
