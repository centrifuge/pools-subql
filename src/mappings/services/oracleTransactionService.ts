import { assertPropInitialized } from '../../helpers/validation'
import { OracleTransaction } from '../../types'

export class OracleTransactionService extends OracleTransaction {
  static init(data: OracleTransactionData) {
    const id = `${data.hash}-${data.key.toString()}`
    logger.info(`Initialising new oracle transaction with id ${id} `)
    assertPropInitialized(data, 'value', 'bigint')
    const tx = new this(id, data.timestamp, data.key.toString(), data.value!)
    tx.timestamp = data.timestamp ?? null
    tx.key = data.key ?? null
    tx.value = data.value!
    return tx
  }
}

export interface OracleTransactionData {
  readonly hash: string
  readonly timestamp: Date
  readonly key: string
  readonly value?: bigint
}
