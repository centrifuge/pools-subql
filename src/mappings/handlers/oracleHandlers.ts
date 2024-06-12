import { SubstrateEvent } from '@subql/types'
import { OracleFedEvent } from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { OracleTransactionData, OracleTransactionService } from '../services/oracleTransactionService'

export const handleOracleFed = errorHandler(_handleOracleFed)
async function _handleOracleFed(event: SubstrateEvent<OracleFedEvent>) {
  const [feeder, key, value] = event.event.data

  let formattedKey: string

  switch (key.type) {
    case 'Isin': {
      formattedKey = key.asIsin.toUtf8()
      break
    }
    case 'PoolLoanId': {
      const [poolId, loanId] = key.asPoolLoanId.map((item) => item.toString(10))
      formattedKey = `${poolId}-${loanId}`
      break
    }
    default:
      logger.warn(`Oracle feed: ${feeder.toString()} key: ${formattedKey} value: ${value.toString()}`)
      return
  }

  logger.info(`Oracle feeder: ${feeder.toString()} key: ${formattedKey} value: ${value.toString()}`)

  const oracleTxData: OracleTransactionData = {
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    key: formattedKey,
    value: value.toBigInt(),
  }

  const oracleTx = OracleTransactionService.init(oracleTxData)
  await oracleTx.save()
}
