import { BorrowerTransaction, BorrowerTransactionType } from '../../types'

export interface BorrowerTransactionData {
  readonly poolId: string
  readonly epochNumber: number
  readonly address: string
  readonly hash: string
  readonly amount?: bigint
  readonly timestamp: Date
  readonly loanId: string
}

export class BorrowerTransactionService extends BorrowerTransaction {
  static init = (data: BorrowerTransactionData, type: BorrowerTransactionType) => {
    const tx = new BorrowerTransactionService(`${data.hash}-${data.epochNumber.toString()}-${type.toString()}`)
    tx.poolId = data.poolId.toString()
    tx.epochNumber = data.epochNumber
    tx.accountId = data.address
    tx.hash = data.hash
    tx.timestamp = data.timestamp

    tx.epochId = `${data.poolId}-${data.epochNumber.toString()}`
    tx.loanId = `${data.poolId}-${data.loanId}`
    tx.type = type
    tx.amount = data.amount ?? null

    return tx
  }

  static created(data: BorrowerTransactionData) {
    logger.info(
      `Borrower transaction of type created for address ${data.address} in pool ${data.poolId} for loan ${data.loanId}`
    )
    const tx = this.init(data, BorrowerTransactionType.CREATED)
    return tx
  }

  static borrowed(data: BorrowerTransactionData) {
    logger.info(
      `Borrower transaction of type borrowed for address ${data.address} in pool ${data.poolId} ` +
        `for loan ${data.loanId} amount: ${data.amount}`
    )
    const tx = this.init(data, BorrowerTransactionType.BORROWED)
    return tx
  }

  static repaid(data: BorrowerTransactionData) {
    logger.info(
      `Borrower transaction of type repaid for address ${data.address} in pool ${data.poolId} ` +
        `for loan ${data.loanId} amount: ${data.amount}`
    )
    const tx = this.init(data, BorrowerTransactionType.REPAID)
    return tx
  }

  static closed(data: BorrowerTransactionData) {
    logger.info(
      `Borrower transaction of type closed for address ${data.address} in pool ${data.poolId} ` +
        `for loan ${data.loanId} amount: ${data.amount}`
    )
    const tx = this.init(data, BorrowerTransactionType.CLOSED)
    return tx
  }
}
