import { bnToBn, nToBigInt } from '@polkadot/util'
import { RAY, WAD } from '../../config'
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
    tx.epochId = `${poolId}-${epochNumber.toString()}`
    tx.trancheId = `${poolId}-${trancheId}`
    tx.timestamp = timestamp
    tx.type = type

    const currencyTypes = [
      InvestorTransactionType.INVEST_ORDER_UPDATE,
      InvestorTransactionType.INVEST_ORDER_CANCEL,
      InvestorTransactionType.INVEST_EXECUTION,
      InvestorTransactionType.REDEEM_COLLECT,
    ]
    tx.currencyAmount = currencyTypes.includes(type) ? amount : BigInt(0)

    const tokenTypes = [
      InvestorTransactionType.REDEEM_ORDER_UPDATE,
      InvestorTransactionType.REDEEM_ORDER_CANCEL,
      InvestorTransactionType.REDEEM_EXECUTION,
      InvestorTransactionType.INVEST_COLLECT,
      InvestorTransactionType.TRANSFER_IN,
      InvestorTransactionType.TRANSFER_OUT,
    ]
    tx.tokenAmount = tokenTypes.includes(type) ? amount : BigInt(0)

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
      nToBigInt(bnToBn(amount).mul(bnToBn(fulfillmentRate)).div(WAD)),
      timestamp
    )

    tx.investorTransaction.tokenPrice = price
    tx.investorTransaction.transactionFee = fee
    tx.investorTransaction.tokenAmount = nToBigInt(bnToBn(amount).mul(RAY).div(bnToBn(price)))
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
      nToBigInt(bnToBn(amount).mul(bnToBn(fulfillmentRate)).div(WAD)),
      timestamp
    )

    tx.investorTransaction.tokenPrice = price
    tx.investorTransaction.transactionFee = fee
    tx.investorTransaction.currencyAmount = nToBigInt(bnToBn(amount).mul(bnToBn(price)).div(WAD))
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

  static collectInvestOrder = (
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
      InvestorTransactionType.INVEST_COLLECT,
      amount,
      timestamp
    )
  }

  static collectRedeemOrder = (
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
      InvestorTransactionType.REDEEM_COLLECT,
      amount,
      timestamp
    )
  }

  static transferIn = (
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
      InvestorTransactionType.TRANSFER_IN,
      amount,
      timestamp
    )
  }

  static transferOut = (
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
      InvestorTransactionType.TRANSFER_OUT,
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
