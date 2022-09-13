import { Option } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { CPREC, RAY_DIGITS, WAD, WAD_DIGITS } from '../../config'
import { EpochDetails } from '../../helpers/types'
import { Epoch, EpochState } from '../../types'

export class EpochService {
  readonly epoch: Epoch
  readonly epochStates: EpochState[]

  constructor(epoch: Epoch, epochStates: EpochState[]) {
    this.epoch = epoch
    this.epochStates = epochStates
  }

  static init = async (poolId: string, epochNr: number, trancheIds: string[], timestamp: Date) => {
    logger.info(`Initialising epoch ${epochNr} for pool ${poolId}`)
    const epoch = new Epoch(`${poolId}-${epochNr.toString()}`)

    epoch.index = epochNr
    epoch.poolId = poolId
    epoch.openedAt = timestamp

    epoch.totalBorrowed = BigInt(0)
    epoch.totalRepaid = BigInt(0)

    const epochStates: EpochState[] = []
    for (const trancheId of trancheIds) {
      const epochState = new EpochState(`${poolId}-${epochNr}-${trancheId}`)
      epochState.epochId = epoch.id
      epochState.trancheId = trancheId
      epochState.outstandingInvestOrders = BigInt(0)
      epochState.outstandingRedeemOrders = BigInt(0)
      epochState.outstandingRedeemOrdersCurrency = BigInt(0)
      epochStates.push(epochState)
    }
    return new EpochService(epoch, epochStates)
  }

  static getById = async (poolId: string, epochNr: number) => {
    const epoch = await Epoch.get(`${poolId}-${epochNr.toString()}`)
    if (epoch === undefined) return undefined
    const epochStates = await EpochState.getByEpochId(`${poolId}-${epochNr.toString()}`)
    return new EpochService(epoch, epochStates)
  }

  save = async () => {
    await this.epoch.save()
    await Promise.all(this.epochStates.map((epochState) => epochState.save()))
  }

  public closeEpoch = (timestamp: Date) => {
    this.epoch.closedAt = timestamp
  }

  public executeEpoch = async (timestamp: Date, digits: number) => {
    logger.info(`Updating EpochExecutionDetails for pool ${this.epoch.poolId} on epoch ${this.epoch.index}`)

    this.epoch.executedAt = timestamp

    for (const epochState of this.epochStates) {
      logger.info(`Querying execution information for tranche :${epochState.trancheId}`)
      const epochResponse = await api.query.pools.epoch<Option<EpochDetails>>(epochState.trancheId, this.epoch.index)
      logger.info(`EpochResponse: ${JSON.stringify(epochResponse)}`)

      if (epochResponse.isNone) throw new Error('No epoch details')

      const epochDetails = epochResponse.unwrap()
      epochState.price = epochDetails.tokenPrice.toBigInt()
      epochState.investFulfillment = epochDetails.investFulfillment.toBigInt()
      epochState.redeemFulfillment = epochDetails.redeemFulfillment.toBigInt()
      epochState.fulfilledInvestOrders = nToBigInt(
        bnToBn(epochState.outstandingInvestOrders).mul(epochDetails.investFulfillment.toBn()).div(WAD)
      )
      epochState.fulfilledRedeemOrders = nToBigInt(
        bnToBn(epochState.outstandingRedeemOrders).mul(epochDetails.redeemFulfillment.toBn()).div(WAD)
      )
      epochState.fulfilledRedeemOrdersCurrency = this.computeCurrencyAmount(
        epochState.fulfilledRedeemOrders,
        epochState.price,
        digits
      )
    }
    return this
  }

  public updateOutstandingInvestOrders = (trancheId: string, newAmount: bigint, oldAmount: bigint) => {
    const trancheState = this.epochStates.find((trancheState) => trancheState.trancheId === trancheId)
    if (trancheState === undefined) throw new Error(`No epochState with could be found for tranche: ${trancheId}`)
    trancheState.outstandingInvestOrders = trancheState.outstandingInvestOrders + newAmount - oldAmount
    return this
  }

  public updateOutstandingRedeemOrders = (
    trancheId: string,
    newAmount: bigint,
    oldAmount: bigint,
    tokenPrice: bigint,
    digits: number
  ) => {
    const trancheState = this.epochStates.find((trancheState) => trancheState.trancheId === trancheId)
    if (trancheState === undefined) throw new Error(`No epochState with could be found for tranche: ${trancheId}`)
    trancheState.outstandingRedeemOrders = trancheState.outstandingRedeemOrders + newAmount - oldAmount
    trancheState.outstandingRedeemOrdersCurrency = this.computeCurrencyAmount(
      trancheState.outstandingRedeemOrders,
      tokenPrice,
      digits
    )
    return this
  }

  private computeCurrencyAmount = (amount: bigint, price: bigint, digits: number) =>
    nToBigInt(
      bnToBn(amount)
        .mul(bnToBn(price))
        .div(CPREC(RAY_DIGITS + WAD_DIGITS - digits))
    )
}
