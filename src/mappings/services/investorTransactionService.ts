import { bnToBn, nToBigInt } from '@polkadot/util'
import { WAD, RAY } from '../../config'
import { InvestorTransaction, InvestorTransactionType } from '../../types'

const currencyTypes = [
  InvestorTransactionType.INVEST_ORDER_UPDATE,
  InvestorTransactionType.INVEST_ORDER_CANCEL,
  InvestorTransactionType.INVEST_EXECUTION,
  InvestorTransactionType.REDEEM_COLLECT,
]

const tokenTypes = [
  InvestorTransactionType.REDEEM_ORDER_UPDATE,
  InvestorTransactionType.REDEEM_ORDER_CANCEL,
  InvestorTransactionType.REDEEM_EXECUTION,
  InvestorTransactionType.INVEST_COLLECT,
  InvestorTransactionType.TRANSFER_IN,
  InvestorTransactionType.TRANSFER_OUT,
]

export interface InvestorTransactionData {
  readonly poolId: string
  readonly trancheId: string
  readonly epochNumber: number
  readonly address: string
  readonly hash: string
  readonly amount: bigint
  readonly timestamp: Date
  readonly price?: bigint
  readonly fee?: bigint
  readonly fulfillmentPercentage?: bigint
}

export class InvestorTransactionService extends InvestorTransaction {
  static init(data: InvestorTransactionData, type: InvestorTransactionType) {
    const tx = new this(`${data.hash}-${data.epochNumber.toString()}-${type.toString()}`)
    tx.poolId = data.poolId.toString()
    tx.trancheId = `${data.poolId}-${data.trancheId}`
    tx.epochNumber = data.epochNumber
    tx.accountId = data.address
    tx.hash = data.hash
    tx.timestamp = data.timestamp
    tx.tokenPrice = data.price
    tx.transactionFee = data.fee

    tx.epochId = `${data.poolId}-${data.epochNumber.toString()}`
    tx.type = type

    tx.currencyAmount = currencyTypes.includes(type) ? data.amount : this.computeCurrencyAmount(data)
    tx.tokenAmount = tokenTypes.includes(type) ? data.amount : this.computeTokenAmount(data)

    return tx
  }

  static executeInvestOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing invest order for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} ` +
        `with amount: ${data.amount} fulfillmentPercentage: ${data.fulfillmentPercentage} ` +
        `price: ${data.price}`
    )
    const extendedData = {
      ...data,
      amount: this.computeFulfilledAmount(data),
    }
    const tx = this.init(extendedData, InvestorTransactionType.INVEST_EXECUTION)
    return tx
  }

  static executeRedeemOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing redeem order for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} ` +
        `with amount: ${data.amount} fulfillmentPercentage: ${data.fulfillmentPercentage} ` +
        `price: ${data.price}`
    )
    const extendedData = {
      ...data,
      amount: this.computeFulfilledAmount(data),
    }
    const tx = this.init(extendedData, InvestorTransactionType.REDEEM_EXECUTION)
    return tx
  }

  static updateInvestOrder(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.INVEST_ORDER_UPDATE)
  }

  static updateRedeemOrder(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.REDEEM_ORDER_UPDATE)
  }

  static cancelInvestOrder(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.INVEST_ORDER_CANCEL)
  }

  static cancelRedeemOrder(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.REDEEM_ORDER_CANCEL)
  }

  static collectInvestOrder(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.INVEST_COLLECT)
  }

  static collectRedeemOrder(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.REDEEM_COLLECT)
  }

  static transferIn(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.TRANSFER_IN)
  }

  static transferOut(data: InvestorTransactionData) {
    return this.init(data, InvestorTransactionType.TRANSFER_OUT)
  }

  static async getById(hash: string) {
    const tx = (await this.get(hash)) as InvestorTransactionService
    return tx
  }

  static computeTokenAmount(data: InvestorTransactionData) {
    return data.price ? nToBigInt(bnToBn(data.amount).mul(RAY).div(bnToBn(data.price))) : null
  }

  static computeCurrencyAmount(data: InvestorTransactionData) {
    return data.price ? nToBigInt(bnToBn(data.amount).mul(bnToBn(data.price)).div(RAY)) : null
  }

  static computeFulfilledAmount(data: InvestorTransactionData) {
    return nToBigInt(bnToBn(data.amount).mul(bnToBn(data.fulfillmentPercentage)).div(WAD))
  }
}
