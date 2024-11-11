import { SubstrateEvent } from '@subql/types'
import { OracleFedEvent } from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { OracleTransactionData, OracleTransactionService } from '../services/oracleTransactionService'

export const handleOracleFed = errorHandler(_handleOracleFed)
async function _handleOracleFed(event: SubstrateEvent<OracleFedEvent>) {
  const [feeder, key, value] = event.event.data
  const timestamp = event.block.timestamp
  if (!timestamp) throw new Error(`Block ${event.block.block.header.number.toString()} has no timestamp`)
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
      logger.warn(`Oracle feed: ${feeder.toString()} key: ${key.type.toString()} value: ${value.toString()}`)
      return
  }

  logger.info(`Oracle feeder: ${feeder.toString()} key: ${formattedKey} value: ${value.toString()}`)

  if (!event.extrinsic) throw new Error('Missing event extrinsic')
  const oracleTxData: OracleTransactionData = {
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp,
    key: formattedKey,
    value: value.toBigInt(),
  }

  const oracleTx = OracleTransactionService.init(oracleTxData)
  await oracleTx.save()
}
