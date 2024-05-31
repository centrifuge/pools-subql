import { SubstrateEvent } from '@subql/types'
import { OracleFedEvent } from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { OracleTransactionData, OracleTransactionService } from '../services/oracleTransactionService'

export const handleOracleFed = errorHandler(_handleOracleFed)
async function _handleOracleFed(event: SubstrateEvent<OracleFedEvent>) {
  const [feeder, key, value] = event.event.data
  const formattedKey = key.asIsin
  logger.info(`Oracle feed: ${feeder.toString()} key: ${hex2a(formattedKey)} value: ${value.toString()}`)
  logger.info(
    `Oracle feed: key: ${formattedKey} value: ${formattedKey.toString()}  ${formattedKey.toString().substr(2)}`
  )
  logger.info(`Oracle feed: ${formattedKey.toString().substring(2)} ${hex2a(formattedKey.toString().substring(2))}`)

  const oracleTxData: OracleTransactionData = {
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    key: hex2a(formattedKey),
    value: value.toBigInt(),
  }

  const oracleTx = OracleTransactionService.init(oracleTxData)
  await oracleTx.save()
}

const hex2a = (hexx: string) => {
  const hex = hexx.toString()
  let str = ''
  for (let i = 0; i < hex.length; i += 2) str += String.fromCharCode(parseInt(hex.substr(i, 2), 16))
  return str
}
