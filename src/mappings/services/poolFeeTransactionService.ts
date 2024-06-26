import { PoolFeeTransactionType } from '../../types'
import { PoolFeeTransaction } from '../../types/models'
import { PoolFeeData } from './poolFeeService'

export class PoolFeeTransactionService extends PoolFeeTransaction {
  static init(data: PoolFeeData, type: keyof typeof PoolFeeTransactionType) {
    const { hash, epochId, poolId, feeId, timestamp, blockNumber } = data
    const _type = PoolFeeTransactionType[type]
    const epochNumber = parseInt(epochId.split('-')[1],10)
    return new this(
      `${epochId}-${feeId}-${type}-${hash}`,
      `${poolId}-${feeId}`,
      _type,
      timestamp,
      blockNumber,
      epochNumber,
      epochId
    )
  }

  static propose(data: PoolFeeData) {
    return this.init(data, 'PROPOSED')
  }

  static add(data: PoolFeeData) {
    return this.init(data, 'ADDED')
  }

  static delete(data: PoolFeeData) {
    return this.init(data, 'REMOVED')
  }

  static charge(data: Omit<PoolFeeData, 'amount'> & Required<Pick<PoolFeeData, 'amount'>>) {
    const poolFeeTransaction = this.init(data, 'CHARGED')
    poolFeeTransaction.amount = data.amount
    return poolFeeTransaction
  }

  static uncharge(data: Omit<PoolFeeData, 'amount'> & Required<Pick<PoolFeeData, 'amount'>>) {
    const poolFeeTransaction = this.init(data, 'UNCHARGED')
    poolFeeTransaction.amount = data.amount
    return poolFeeTransaction
  }

  static pay(data: Omit<PoolFeeData, 'amount'> & Required<Pick<PoolFeeData, 'amount'>>) {
    const poolFeeTransaction = this.init(data, 'PAID')
    poolFeeTransaction.amount = data.amount
    return poolFeeTransaction
  }

  static accrue(data: Omit<PoolFeeData, 'amount'> & Required<Pick<PoolFeeData, 'amount'>>) {
    const poolFeeTransaction = this.init(data, 'ACCRUED')
    poolFeeTransaction.amount = data.amount
    return poolFeeTransaction
  }
}
