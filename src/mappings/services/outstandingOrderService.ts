import { bnToBn, nToBigInt } from '@polkadot/util'
import { WAD } from '../../config'
import { OutstandingOrder } from '../../types'

export class OutstandingOrderService {
  readonly outstandingOrder: OutstandingOrder

  constructor(outstandingOrder: OutstandingOrder) {
    this.outstandingOrder = outstandingOrder
  }

  static init = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    invest: bigint,
    redeem: bigint,
    timestamp: Date
  ) => {
    const oo = new OutstandingOrder(`${poolId}-${trancheId}-${address}`)
    oo.hash = hash
    oo.accountId = address
    oo.poolId = poolId
    oo.trancheId = `${poolId}-${trancheId}`
    oo.epochNumber = epochNumber
    oo.timestamp = timestamp

    oo.invest = invest
    oo.redeem = redeem
    return new OutstandingOrderService(oo)
  }

  static initInvest = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(poolId, trancheId, epochNumber, address, hash, amount, BigInt(0), timestamp)
  }

  static initRedeem = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(poolId, trancheId, epochNumber, address, hash, BigInt(0), amount, timestamp)
  }

  static getByTrancheId = async (poolId: string, trancheId: string) => {
    const outstandingOrders = (await OutstandingOrder.getByTrancheId(`${poolId}-${trancheId}`)).map(
      (oo) => new OutstandingOrderService(oo)
    )
    return outstandingOrders
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
    const unfulfilledRatio = WAD.sub(bnToBn(investFulfillment))
    this.outstandingOrder.invest = nToBigInt(bnToBn(this.outstandingOrder.invest).mul(unfulfilledRatio).div(WAD))
    return this
  }

  updateUnfulfilledRedeem = (redeemFulfillment: bigint) => {
    const unfulfilledRatio = WAD.sub(bnToBn(redeemFulfillment))
    this.outstandingOrder.redeem = nToBigInt(bnToBn(this.outstandingOrder.redeem).mul(unfulfilledRatio).div(WAD))
    return this
  }
}
