import { OracleTransaction } from '../../types'

export interface OracleTransactionData {
  readonly hash: string
  readonly timestamp: Date
  readonly key: string
  readonly value?: bigint
}

export class OracleTransactionService extends OracleTransaction {
  static init = (data: OracleTransactionData) => {
    const tx = new this(
      `${data.hash}-${data.timestamp.toString()}-${data.key.toString()}`,
      data.timestamp,
      data.key.toString(),
      data.value.toBigInt()
    )

    tx.timestamp = data.timestamp ?? null
    tx.key = data.key ?? null
    tx.value = data.value ?? null

    return tx
  }
}
