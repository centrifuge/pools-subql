import { bnToBn, nToBigInt } from '@polkadot/util'
import { paginatedGetter } from '../../helpers/paginatedGetter'
import { OutstandingOrder } from '../../types'
import { InvestorTransactionData } from './investorTransactionService'

export class OutstandingOrderService {
  readonly outstandingOrder: OutstandingOrder

  constructor(outstandingOrder: OutstandingOrder) {
    this.outstandingOrder = outstandingOrder
  }

  static init = (data: InvestorTransactionData, invest, redeem) => {
    const oo = new OutstandingOrder(`${data.poolId}-${data.trancheId}-${data.address}`)
    oo.hash = data.hash
    oo.accountId = data.address
    oo.poolId = data.poolId
    oo.trancheId = `${data.poolId}-${data.trancheId}`
    oo.epochNumber = data.epochNumber
    oo.timestamp = data.timestamp

    oo.invest = invest
    oo.redeem = redeem
    return new OutstandingOrderService(oo)
  }

  static initInvest = (data: InvestorTransactionData) => {
    return this.init(data, data.amount, BigInt(0))
  }

  static initRedeem = (data: InvestorTransactionData) => {
    return this.init(data, BigInt(0), data.amount)
  }

  static getByTrancheId = async (poolId: string, trancheId: string) => {
    const entities = (await paginatedGetter(
      'OutstandingOrder',
      'trancheId',
      `${poolId}-${trancheId}`
    )) as OutstandingOrder[]
    return entities.map((ooEntity) => new OutstandingOrderService(OutstandingOrder.create(ooEntity)))
  }

  save = async () => {
    await this.outstandingOrder.save()
    return this
  }

  remove = async () => {
    await OutstandingOrder.remove(this.outstandingOrder.id)
    return this
  }

  updateUnfulfilledInvest = (investFulfillment: bigint) => {
    this.outstandingOrder.invest = nToBigInt(bnToBn(this.outstandingOrder.invest).sub(bnToBn(investFulfillment)))
    return this
  }

  updateUnfulfilledRedeem = (redeemFulfillment: bigint) => {
    this.outstandingOrder.redeem = nToBigInt(bnToBn(this.outstandingOrder.redeem).sub(bnToBn(redeemFulfillment)))
    return this
  }
}
