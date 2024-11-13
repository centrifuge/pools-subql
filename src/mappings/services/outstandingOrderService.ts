import { bnToBn, nToBigInt } from '@polkadot/util'
import { paginatedGetter } from '../../helpers/paginatedGetter'
import { OutstandingOrder } from '../../types'
import { InvestorTransactionData } from './investorTransactionService'
import { assertPropInitialized } from '../../helpers/validation'

export class OutstandingOrderService extends OutstandingOrder {
  static init(data: InvestorTransactionData, investAmount: bigint, redeemAmount: bigint) {
    assertPropInitialized(data, 'epochNumber', 'number')
    const oo = new this(
      `${data.poolId}-${data.trancheId}-${data.address}`,
      data.hash,
      data.address,
      data.poolId,
      `${data.poolId}-${data.trancheId}`,
      data.epochNumber!,
      data.timestamp,
      investAmount,
      redeemAmount
    )
    oo.investAmount = investAmount
    oo.redeemAmount = redeemAmount
    return oo
  }

  static initZero(data: InvestorTransactionData) {
    return this.init(data, BigInt(0), BigInt(0))
  }

  static async getById(poolId: string, trancheId: string, address: string) {
    const oo = await this.get(`${poolId}-${trancheId}-${address}`)
    return oo as OutstandingOrderService | undefined
  }

  static async getOrInit(data: InvestorTransactionData) {
    let oo = await this.getById(data.poolId, data.trancheId, data.address)
    if (!oo) oo = this.initZero(data)
    return oo
  }

  static async getAllByTrancheId(poolId: string, trancheId: string) {
    const entities = await paginatedGetter<OutstandingOrder>(this, [
      ['trancheId', '=', `${poolId}-${trancheId}`],
    ])
    return entities as OutstandingOrderService[]
  }

  updateInvest(data: InvestorTransactionData) {
    this.investAmount = data.amount
  }

  updateRedeem(data: InvestorTransactionData) {
    this.redeemAmount = data.amount
  }

  updateUnfulfilledInvest(investFulfillmentPercentage: bigint) {
    this.investAmount = nToBigInt(bnToBn(this.investAmount).sub(bnToBn(investFulfillmentPercentage)))
    return this
  }

  updateUnfulfilledRedeem(redeemFulfillmentPercentage: bigint) {
    this.redeemAmount = nToBigInt(bnToBn(this.redeemAmount).sub(bnToBn(redeemFulfillmentPercentage)))
    return this
  }
}
