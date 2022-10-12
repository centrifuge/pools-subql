import { TrancheBalance } from '../../types/models/TrancheBalance'

export class TrancheBalanceService {
  readonly trancheBalance: TrancheBalance

  constructor(trancheBalance: TrancheBalance) {
    this.trancheBalance = trancheBalance
  }

  static init = (address: string, poolId: string, trancheId: string) => {
    logger.info(`Initialising new TrancheBalance: ${address}-${poolId}-${trancheId}`)
    const trancheBalance = new TrancheBalance(`${address}-${poolId}-${trancheId}`)
    trancheBalance.accountId = address
    trancheBalance.poolId = poolId
    trancheBalance.trancheId = `${poolId}-${trancheId}`
    trancheBalance.investOrdered = BigInt(0)
    trancheBalance.investUncollected = BigInt(0)
    trancheBalance.investCollected = BigInt(0)
    trancheBalance.redeemOrdered = BigInt(0)
    trancheBalance.redeemUncollected = BigInt(0)
    trancheBalance.redeemCollected = BigInt(0)
    return new TrancheBalanceService(trancheBalance)
  }

  static getById = async (address: string, poolId: string, trancheId: string) => {
    const trancheBalance = await TrancheBalance.get(`${address}-${poolId}-${trancheId}`)
    if (trancheBalance === undefined) {
      return undefined
    } else {
      return new TrancheBalanceService(trancheBalance)
    }
  }

  static getOrInit = async (address: string, poolId: string, trancheId: string) => {
    let trancheBalance = await this.getById(address, poolId, trancheId)
    if (trancheBalance === undefined) {
      trancheBalance = this.init(address, poolId, trancheId)
      await trancheBalance.save()
    }
    return trancheBalance
  }

  public save = async () => {
    await this.trancheBalance.save()
  }

  public investOrdered = (currencyAmount: bigint) => {
    this.trancheBalance.investOrdered += currencyAmount
  }

  public redeemOrdered = (tokenAmount: bigint) => {
    this.trancheBalance.redeemOrdered += tokenAmount
  }

  public investExecuted = (currencyAmount: bigint, tokenAmount: bigint) => {
    this.trancheBalance.investOrdered -= currencyAmount
    this.trancheBalance.investUncollected += tokenAmount
  }

  public redeemExecuted = (tokenAmount: bigint, currencyAmount: bigint) => {
    this.trancheBalance.redeemOrdered -= tokenAmount
    this.trancheBalance.redeemUncollected += currencyAmount
  }

  public investCollected = (tokenAmount: bigint) => {
    this.trancheBalance.investUncollected -= tokenAmount
    this.trancheBalance.investCollected += tokenAmount
  }

  public redeemCollected = (currencyAmount: bigint) => {
    this.trancheBalance.redeemUncollected -= currencyAmount
    this.trancheBalance.redeemCollected += currencyAmount
  }
}
