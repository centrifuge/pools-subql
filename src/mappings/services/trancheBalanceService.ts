import { TrancheBalance } from '../../types/models/TrancheBalance'

export class TrancheBalanceService extends TrancheBalance {
  static init(address: string, poolId: string, trancheId: string) {
    logger.info(`Initialising new TrancheBalance: ${address}-${poolId}-${trancheId}`)
    const trancheBalance = new this(`${address}-${poolId}-${trancheId}`)
    trancheBalance.accountId = address
    trancheBalance.poolId = poolId
    trancheBalance.trancheId = `${poolId}-${trancheId}`
    trancheBalance.investOrdered = BigInt(0)
    trancheBalance.investUncollected = BigInt(0)
    trancheBalance.investCollected = BigInt(0)
    trancheBalance.redeemOrdered = BigInt(0)
    trancheBalance.redeemUncollected = BigInt(0)
    trancheBalance.redeemCollected = BigInt(0)
    return trancheBalance
  }

  static async getById(address: string, poolId: string, trancheId: string) {
    const trancheBalance = await this.get(`${address}-${poolId}-${trancheId}`)
    return trancheBalance as TrancheBalanceService
  }

  static getOrInit = async (address: string, poolId: string, trancheId: string) => {
    let trancheBalance = await this.getById(address, poolId, trancheId)
    if (trancheBalance === undefined) {
      trancheBalance = this.init(address, poolId, trancheId)
      await trancheBalance.save()
    }
    return trancheBalance
  }

  public investOrder(currencyAmount: bigint) {
    this.investOrdered += currencyAmount
  }

  public redeemOrder(tokenAmount: bigint) {
    this.redeemOrdered += tokenAmount
  }

  public investExecute(currencyAmount: bigint, tokenAmount: bigint) {
    this.investOrdered -= currencyAmount
    this.investUncollected += tokenAmount
  }

  public redeemExecute(tokenAmount: bigint, currencyAmount: bigint) {
    this.redeemOrdered -= tokenAmount
    this.redeemUncollected += currencyAmount
  }

  public investCollect(tokenAmount: bigint) {
    this.investUncollected -= tokenAmount
    this.investCollected += tokenAmount
  }

  public redeemCollect(currencyAmount: bigint) {
    this.redeemUncollected -= currencyAmount
    this.redeemCollected += currencyAmount
  }
}
