import { TrancheBalance } from '../../types/models/TrancheBalance'

export class TrancheBalanceService extends TrancheBalance {
  static init(address: string, poolId: string, trancheId: string, timestamp: Date) {
    logger.info(`Initialising new TrancheBalance: ${address}-${poolId}-${trancheId}`)
    const trancheBalance = new this(
      `${address}-${poolId}-${trancheId}`,
      address,
      poolId,
      `${poolId}-${trancheId}`,
      timestamp,
      BigInt(0),
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
    return trancheBalance as TrancheBalanceService | undefined
  }

  static async getOrInit(address: string, poolId: string, trancheId: string, timestamp: Date) {
    let trancheBalance = await this.getById(address, poolId, trancheId)
    if (!trancheBalance) {
      trancheBalance = this.init(address, poolId, trancheId, timestamp)
      await trancheBalance.save()
    }
    return trancheBalance as TrancheBalanceService
  }

  public investOrder(currencyAmount: bigint) {
    logger.info(
      `Processing invest order for trancheBalance: ${this.id}-${this.poolId}-${this.trancheId}` +
        ` pendingInvestCurrency: ${currencyAmount}`
    )
    this.pendingInvestCurrency = currencyAmount
  }

  public redeemOrder(tokenAmount: bigint) {
    logger.info(
      `Processing redeem order for trancheBalance: ${this.id}-${this.poolId}-${this.trancheId}` +
        ` pendingRedeemTrancheTokens: ${tokenAmount}`
    )
    this.pendingRedeemTrancheTokens = tokenAmount
  }

  public investExecute(currencyAmount: bigint, tokenAmount: bigint) {
    logger.info(
      `Processing invest execution for trancheBalance: ${this.id}-${this.poolId}-${this.trancheId}` +
        ` currencyAmount: ${currencyAmount} tokenAmount: ${tokenAmount}`
    )
    this.pendingInvestCurrency -= currencyAmount
    this.claimableTrancheTokens += tokenAmount
  }

  public redeemExecute(tokenAmount: bigint, currencyAmount: bigint) {
    logger.info(
      `Processing redeem execution for trancheBalance: ${this.id}-${this.poolId}-${this.trancheId}` +
        ` tokenAmount: ${tokenAmount} currencyAmount: ${currencyAmount}`
    )
    this.pendingRedeemTrancheTokens -= tokenAmount
    this.claimableCurrency += currencyAmount
  }

  public investCollect(tokenAmount: bigint) {
    logger.info(
      `Processing invest collection for trancheBalance: ${this.id}-${this.poolId}-${this.trancheId}` +
        ` tokenAmount: ${tokenAmount}`
    )
    this.claimableTrancheTokens -= tokenAmount
    this.sumClaimedTrancheTokens += tokenAmount
  }

  public redeemCollect(currencyAmount: bigint) {
    logger.info(
      `Processing redeem collection for trancheBalance: ${this.id}-${this.poolId}-${this.trancheId}` +
        ` curreAmount: ${currencyAmount}`
    )
    this.claimableCurrency -= currencyAmount
    this.sumClaimedCurrency += currencyAmount
  }

  public updateUnrealizedProfit(unrealizedProfit: bigint) {
    logger.info(
      `Updating unrealizedProfit for trancheBalance: ${this.id}-${this.poolId}-${this.trancheId}` +
        ` to: ${unrealizedProfit}`
    )
    this.unrealizedProfit = unrealizedProfit
  }
}
