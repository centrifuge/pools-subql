import { AssetTransaction, AssetTransactionType } from '../../types'

export interface AssetTransactionData {
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
  readonly assetId: string
  readonly fromAsset?: string
  readonly toAsset?: string
}

export class AssetTransactionService extends AssetTransaction {
  static init = (data: AssetTransactionData, type: AssetTransactionType) => {
    const tx = new this(
      `${data.hash}-${data.epochNumber.toString()}-${type.toString()}`,
      data.timestamp,
      data.poolId,
      data.hash,
      data.address,
      data.epochNumber,
      `${data.poolId}-${data.epochNumber.toString()}`,
      `${data.poolId}-${data.assetId}`,
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

  static created(data: AssetTransactionData) {
    logger.info(
      `Asset transaction of type created for address ${data.address} in pool ${data.poolId} for loan ${data.assetId}`
    )
    const tx = this.init(data, AssetTransactionType.CREATED)
    return tx
  }

  static borrowed(data: AssetTransactionData) {
    logger.info(
      `Asset transaction of type borrowed for address ${data.address} in pool ${data.poolId} ` +
        `for loan ${data.assetId} amount: ${data.amount}`
    )
    const tx = this.init(data, AssetTransactionType.BORROWED)
    return tx
  }

  static repaid(data: AssetTransactionData) {
    logger.info(
      `Asset transaction of type repaid for address ${data.address} in pool ${data.poolId} ` +
        `for loan ${data.assetId} amount: ${data.amount}`
    )
    const tx = this.init(data, AssetTransactionType.REPAID)
    return tx
  }

  static closed(data: AssetTransactionData) {
    logger.info(
      `Asset transaction of type closed for address ${data.address} in pool ${data.poolId} ` +
        `for loan ${data.assetId} amount: ${data.amount}`
    )
    const tx = this.init(data, AssetTransactionType.CLOSED)
    return tx
  }
}
