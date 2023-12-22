import { TrancheBalance } from '../../types/models/TrancheBalance'

export class TrancheBalanceService extends TrancheBalance {
  static init(address: string, poolId: string, trancheId: string) {
    logger.info(`Initialising new TrancheBalance: ${address}-${poolId}-${trancheId}`)
    const trancheBalance = new this(
      `${address}-${poolId}-${trancheId}`,
      address,
      poolId,
      `${poolId}-${trancheId}`,
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0)
    )
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
    this.pendingInvestCurrency = currencyAmount
  }

  public redeemOrder(tokenAmount: bigint) {
    this.pendingRedeemTrancheTokens = tokenAmount
  }

  public investExecute(currencyAmount: bigint, tokenAmount: bigint) {
    this.pendingInvestCurrency -= currencyAmount
    this.claimableTrancheTokens += tokenAmount
  }

  public redeemExecute(tokenAmount: bigint, currencyAmount: bigint) {
    this.pendingRedeemTrancheTokens -= tokenAmount
    this.claimableCurrency += currencyAmount
  }

  public investCollect(tokenAmount: bigint) {
    this.claimableTrancheTokens -= tokenAmount
    this.sumClaimedTrancheTokens += tokenAmount
  }

  public redeemCollect(currencyAmount: bigint) {
    this.claimableCurrency -= currencyAmount
    this.sumClaimedCurrency += currencyAmount
  }
}
