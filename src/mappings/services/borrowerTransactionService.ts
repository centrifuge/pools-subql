import { BorrowerTransaction, BorrowerTransactionType } from '../../types'

export interface BorrowerTransactionData {
  readonly poolId: string
  readonly epochNumber: number
  readonly address: string
  readonly hash: string
  readonly amount?: bigint
  readonly principalAmount?: bigint
  readonly interestAmount?: bigint
  readonly unscheduledAmount?: bigint
  readonly quantity?: bigint
  readonly settlementPrice?: bigint
  readonly timestamp: Date
  readonly loanId: string
}

export class BorrowerTransactionService extends BorrowerTransaction {
  static init = (data: BorrowerTransactionData, type: BorrowerTransactionType) => {
    const tx = new BorrowerTransactionService(
      `${data.hash}-${data.epochNumber.toString()}-${type.toString()}`,
      data.timestamp,
      data.poolId,
      data.hash,
      data.address,
      data.epochNumber,
      `${data.poolId}-${data.epochNumber.toString()}`,
      `${data.poolId}-${data.loanId}`,
      type
    )

    tx.amount = data.amount ?? null
    tx.principalAmount = data.principalAmount ?? null
    tx.interestAmount = data.interestAmount ?? null
    tx.unscheduledAmount = data.unscheduledAmount ?? null
    tx.quantity = data.quantity ?? null
    tx.settlementPrice = data.settlementPrice ?? null

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
