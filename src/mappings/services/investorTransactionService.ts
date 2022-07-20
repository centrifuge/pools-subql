import { bnToBn, nToBigInt } from '@polkadot/util'
import { InvestorTransaction, InvestorTransactionType } from '../../types'

export class InvestorTransactionService {
  readonly investorTransaction: InvestorTransaction

  constructor(investorTransaction: InvestorTransaction) {
    this.investorTransaction = investorTransaction
  }

  static init = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    type: InvestorTransactionType,
    amount: bigint,
    timestamp: Date
  ) => {
    const tx = new InvestorTransaction(`${hash}-${epochNumber.toString()}-${type.toString()}`)
    tx.hash = hash
    tx.accountId = address
    tx.poolId = poolId.toString()
    tx.epochNumber = epochNumber
    tx.trancheId = `${poolId}-${trancheId}`
    tx.timestamp = timestamp
    tx.type = type

    // Invest orders are submitted in the currency amount, while redeem orders are submitted in the token amount
    tx.currencyAmount = type.startsWith('INVEST') ? amount : BigInt(0)
    tx.tokenAmount = type.startsWith('REDEEM') ? amount : BigInt(0)

    return new InvestorTransactionService(tx)
  }

  static executeInvestOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    fulfillmentRate: bigint,
    price: bigint,
    fee: bigint,
    timestamp: Date
  ) => {
    const tx = this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.INVEST_EXECUTION,
      nToBigInt(
        bnToBn(amount)
          .mul(bnToBn(fulfillmentRate))
          .div(bnToBn(10).pow(bnToBn(18)))
      ),
      timestamp
    )

    tx.investorTransaction.tokenPrice = price
    tx.investorTransaction.transactionFee = fee
    tx.investorTransaction.tokenAmount = nToBigInt(
      bnToBn(amount)
        .mul(bnToBn(10).pow(bnToBn(18)))
        .div(bnToBn(price))
    )
    return tx
  }

  static executeRedeemOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    fulfillmentRate: bigint,
    price: bigint,
    fee: bigint,
    timestamp: Date
  ) => {
    const tx = this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.REDEEM_EXECUTION,
      nToBigInt(
        bnToBn(amount)
          .mul(bnToBn(fulfillmentRate))
          .div(bnToBn(10).pow(bnToBn(18)))
      ),
      timestamp
    )

    tx.investorTransaction.tokenPrice = price
    tx.investorTransaction.transactionFee = fee
    tx.investorTransaction.currencyAmount = nToBigInt(
      bnToBn(amount)
        .mul(bnToBn(price))
        .div(bnToBn(10).pow(bnToBn(18)))
    )
    return tx
  }

  static updateInvestOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.INVEST_ORDER_UPDATE,
      amount,
      timestamp
    )
  }

  static updateRedeemOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.REDEEM_ORDER_UPDATE,
      amount,
      timestamp
    )
  }

  static cancelInvestOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.INVEST_ORDER_CANCEL,
      amount,
      timestamp
    )
  }

  static cancelRedeemOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.REDEEM_ORDER_CANCEL,
      amount,
      timestamp
    )
  }

  save = async () => {
    await this.investorTransaction.save()
    return this
  }

  static getById = async (hash: string) => {
    const tx = await InvestorTransaction.get(hash)
    if (tx === undefined) return undefined
    return new InvestorTransactionService(tx)
  }
}
