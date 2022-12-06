import { Option } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { u64 } from '@polkadot/types'
import { CPREC, RAY_DIGITS, WAD, WAD_DIGITS } from '../../config'
import { OrdersFulfillment } from '../../helpers/types'
import { Epoch, EpochState } from '../../types'

export class EpochService extends Epoch {
  readonly states: EpochState[]

  constructor(id) {
    super(id)
    this.states = []
  }

  static async init(poolId: string, epochNr: number, trancheIds: string[], timestamp: Date) {
    logger.info(`Initialising epoch ${epochNr} for pool ${poolId}`)
    const epoch = new this(`${poolId}-${epochNr.toString()}`)

    epoch.index = epochNr
    epoch.poolId = poolId
    epoch.openedAt = timestamp

    epoch.totalBorrowed = BigInt(0)
    epoch.totalRepaid = BigInt(0)
    epoch.totalInvested = BigInt(0)
    epoch.totalRedeemed = BigInt(0)

    for (const trancheId of trancheIds) {
      const epochState = new EpochState(`${poolId}-${epochNr}-${trancheId}`)
      epochState.epochId = epoch.id
      epochState.trancheId = trancheId
      epochState.outstandingInvestOrders = BigInt(0)
      epochState.outstandingRedeemOrders = BigInt(0)
      epochState.outstandingRedeemOrdersCurrency = BigInt(0)
      epoch.states.push(epochState)
    }
    return epoch
  }

  static async getById(poolId: string, epochNr: number) {
    const epoch = (await this.get(`${poolId}-${epochNr.toString()}`)) as EpochService
    if (epoch === undefined) return undefined
    const epochStates = await EpochState.getByEpochId(`${poolId}-${epochNr.toString()}`)
    epoch.states.push(...epochStates)
    return epoch
  }

  async saveWithStates() {
    await this.save()
    await Promise.all(this.states.map((epochState) => epochState.save()))
  }

  public closeEpoch(timestamp: Date) {
    this.closedAt = timestamp
  }

  public async executeEpoch(timestamp: Date, digits: number) {
    logger.info(`Updating OrderFulfillmentData for pool ${this.poolId} on epoch ${this.index}`)
    this.executedAt = timestamp

    for (const epochState of this.states) {
      logger.info(`Fetching data for tranche: ${epochState.trancheId}`)
      const trancheCurrency = [this.poolId, epochState.trancheId]
      const [investOrderId, redeemOrderId] = await Promise.all([
        api.query.investments.investOrderId<u64>(trancheCurrency),
        api.query.investments.redeemOrderId<u64>(trancheCurrency),
      ])
      logger.info(`investOrderId: ${investOrderId.toNumber()}, redeemOrderId: ${redeemOrderId.toNumber()}`)
      const [investOrderFulfillment, redeemOrderFulfillment] = await Promise.all([
        api.query.investments.clearedInvestOrders<Option<OrdersFulfillment>>(
          trancheCurrency,
          investOrderId.toNumber() - 1
        ),
        api.query.investments.clearedRedeemOrders<Option<OrdersFulfillment>>(
          trancheCurrency,
          redeemOrderId.toNumber() - 1
        ),
      ])

      logger.info(JSON.stringify(investOrderFulfillment))
      logger.info(JSON.stringify(redeemOrderFulfillment))

      if (investOrderFulfillment.isNone || redeemOrderFulfillment.isNone)
        throw new Error('Failed to fetch epoch solutions')

      const investSolution = investOrderFulfillment.unwrap(),
        redeemSolution = redeemOrderFulfillment.unwrap()

      epochState.price = investSolution.price.toBigInt()
      epochState.investFulfillment = investSolution.ofAmount.toBigInt()
      epochState.redeemFulfillment = redeemSolution.ofAmount.toBigInt()
      epochState.fulfilledInvestOrders = nToBigInt(
        bnToBn(epochState.outstandingInvestOrders).mul(investSolution.ofAmount.toBn()).div(WAD)
      )
      epochState.fulfilledRedeemOrders = nToBigInt(
        bnToBn(epochState.outstandingRedeemOrders).mul(redeemSolution.ofAmount.toBn()).div(WAD)
      )
      epochState.fulfilledRedeemOrdersCurrency = this.computeCurrencyAmount(
        epochState.fulfilledRedeemOrders,
        epochState.price,
        digits
      )

      this.totalInvested += epochState.fulfilledInvestOrders
      this.totalRedeemed += epochState.fulfilledRedeemOrdersCurrency
    }
    return this
  }

  public updateOutstandingInvestOrders(trancheId: string, newAmount: bigint, oldAmount: bigint) {
    const trancheState = this.states.find((epochState) => epochState.trancheId === trancheId)
    if (trancheState === undefined) throw new Error(`No epochState with could be found for tranche: ${trancheId}`)
    trancheState.outstandingInvestOrders = trancheState.outstandingInvestOrders + newAmount - oldAmount
    return this
  }

  public updateOutstandingRedeemOrders(
    trancheId: string,
    newAmount: bigint,
    oldAmount: bigint,
    tokenPrice: bigint,
    digits: number
  ) {
    const trancheState = this.states.find((trancheState) => trancheState.trancheId === trancheId)
    if (trancheState === undefined) throw new Error(`No epochState with could be found for tranche: ${trancheId}`)
    trancheState.outstandingRedeemOrders = trancheState.outstandingRedeemOrders + newAmount - oldAmount
    trancheState.outstandingRedeemOrdersCurrency = this.computeCurrencyAmount(
      trancheState.outstandingRedeemOrders,
      tokenPrice,
      digits
    )
    return this
  }

  private computeCurrencyAmount(amount: bigint, price: bigint, digits: number) {
    return nToBigInt(
      bnToBn(amount)
        .mul(bnToBn(price))
        .div(CPREC(RAY_DIGITS + WAD_DIGITS - digits))
    )
  }
}
