import { bnToBn, nToBigInt } from '@polkadot/util'
import { WAD } from '../../config'
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
  InvestorTransactionType.INVEST_LP_COLLECT,
  InvestorTransactionType.TRANSFER_IN,
  InvestorTransactionType.TRANSFER_OUT,
]

export interface InvestorTransactionData {
  readonly poolId: string
  readonly trancheId: string
  readonly epochNumber?: number
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
    const epochRef = data.epochNumber ? data.epochNumber.toString() : '0'
    const tx = new this(
      `${data.hash}-${epochRef}-${type.toString()}`,
      data.hash,
      data.address,
      data.poolId,
      `${data.poolId}-${data.trancheId}`,
      data.timestamp,
      type
    )

    tx.epochNumber = data.epochNumber
    tx.epochId = data.epochNumber ? `${data.poolId}-${data.epochNumber.toString()}` : undefined

    tx.tokenPrice = data.price
    tx.transactionFee = data.fee

    tx.currencyAmount = currencyTypes.includes(type) ? data.amount : this.computeCurrencyAmount(data)
    tx.tokenAmount = tokenTypes.includes(type) ? data.amount : this.computeTokenAmount(data)

    tx.realizedProfitFifo = BigInt(0)

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
    logger.info(
      `Executing invest order update for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} ` +
        `with amount: ${data.amount}`
    )
    return this.init(data, InvestorTransactionType.INVEST_ORDER_UPDATE)
  }

  static updateRedeemOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing redeem order update for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} ` +
        `with amount: ${data.amount}`
    )
    return this.init(data, InvestorTransactionType.REDEEM_ORDER_UPDATE)
  }

  static cancelInvestOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing invest order cancel for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} `
    )
    return this.init(data, InvestorTransactionType.INVEST_ORDER_CANCEL)
  }

  static cancelRedeemOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing redeem order cancel for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} `
    )
    return this.init(data, InvestorTransactionType.REDEEM_ORDER_CANCEL)
  }

  static collectInvestOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing invest order collect for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} `
    )
    return this.init(data, InvestorTransactionType.INVEST_COLLECT)
  }

  static collectRedeemOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing redeem order collect for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} `
    )
    return this.init(data, InvestorTransactionType.REDEEM_COLLECT)
  }

  static collectLpInvestOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing LP invest order collect for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} `
    )
    return this.init(data, InvestorTransactionType.INVEST_LP_COLLECT)
  }

  static collectLpRedeemOrder(data: InvestorTransactionData) {
    logger.info(
      `Executing LP redeem order collect for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} `
    )
    return this.init(data, InvestorTransactionType.REDEEM_LP_COLLECT)
  }

  static transferIn(data: InvestorTransactionData) {
    logger.info(
      `Transfer In for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} ` +
        `with amount: ${data.amount}`
    )
    return this.init(data, InvestorTransactionType.TRANSFER_IN)
  }

  static transferOut(data: InvestorTransactionData) {
    logger.info(
      `Transfer Out for address ${data.address} in pool ${data.poolId} tranche ${data.trancheId} ` +
        `with amount: ${data.amount}`
    )
    return this.init(data, InvestorTransactionType.TRANSFER_OUT)
  }

  static async getById(hash: string) {
    const tx = (await this.get(hash)) as InvestorTransactionService
    return tx
  }

  static computeTokenAmount(data: InvestorTransactionData) {
    return data.price ? nToBigInt(bnToBn(data.amount).mul(WAD).div(bnToBn(data.price))) : null
  }

  static computeCurrencyAmount(data: InvestorTransactionData) {
    return data.price ? nToBigInt(bnToBn(data.amount).mul(bnToBn(data.price)).div(WAD)) : null
  }

  static computeFulfilledAmount(data: InvestorTransactionData) {
    return nToBigInt(bnToBn(data.amount).mul(bnToBn(data.fulfillmentPercentage)).div(WAD))
  }

  public setRealizedProfitFifo(profit: bigint) {
    this.realizedProfitFifo = profit
  }
}
