import { Option } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { EpochDetails } from '../../helpers/types'
import { Epoch, EpochState } from '../../types'

export class EpochService {
  epoch: Epoch
  epochStates: EpochState[]

  constructor(epoch: Epoch, epochStates: EpochState[]) {
    this.epoch = epoch
    this.epochStates = epochStates
  }

  static init = async (poolId: string, epochId: number, trancheIds: string[], timestamp: Date) => {
    const epoch = new Epoch(`${poolId}-${epochId.toString()}`)

    epoch.index = epochId
    epoch.poolId = poolId
    epoch.openedAt = timestamp

    epoch.totalBorrowed = BigInt(0)
    epoch.totalRepaid = BigInt(0)

    const epochStates: EpochState[] = []
    for (const trancheId of trancheIds) {
      const epochState = new EpochState(`${poolId}-${epochId}-${trancheId}`)
      epochState.epochId = epoch.id
      epochState.trancheId = trancheId
      epochState.outstandingInvestOrders = BigInt(0)
      epochState.outstandingRedeemOrders = BigInt(0)
      epochStates.push(epochState)
    }
    return new EpochService(epoch, epochStates)
  }

  static getById = async (epochId: string) => {
    const epoch = await Epoch.get(epochId)
    const epochStates = await EpochState.getByEpochId(epochId)
    return new EpochService(epoch, epochStates)
  }

  save = async () => {
    await this.epoch.save()
    await Promise.all(this.epochStates.map((epochState) => epochState.save()))
  }

  public closeEpoch = (timestamp: Date) => {
    this.epoch.closedAt = timestamp
  }

  public executeEpoch = async (timestamp: Date) => {
    logger.info(`Updating EpochExecutionDetails for tranche ${this.epoch.poolId} on epoch ${this.epoch.index}`)

    this.epoch.executedAt = timestamp

    for (const epochState of this.epochStates) {
      const epochResponse = await api.query.pools.epoch<Option<EpochDetails>>(epochState.trancheId, this.epoch.index)
      logger.info(`EpochResponse: ${JSON.stringify(epochResponse)}`)

      if (epochResponse.isNone) throw new Error('No epoch details')

      const epochDetails = epochResponse.unwrap()
      epochState.price = epochDetails.tokenPrice.toBigInt()
      epochState.investFulfillment = epochDetails.investFulfillment.toBigInt()
      epochState.redeemFulfillment = epochDetails.redeemFulfillment.toBigInt()
      epochState.fulfilledInvestOrders = nToBigInt(
        bnToBn(epochState.outstandingInvestOrders)
          .mul(epochDetails.investFulfillment.toBn())
          .div(bnToBn(10).pow(bnToBn(18)))
      )
      epochState.fulfilledRedeemOrders = nToBigInt(
        bnToBn(epochState.outstandingRedeemOrders)
          .mul(epochDetails.redeemFulfillment.toBn())
          .div(bnToBn(10).pow(bnToBn(18)))
      )
    }
    return this
  }

  public updateOutstandingInvestOrders = (trancheId: string, newAmount: bigint, oldAmount: bigint) => {
    const trancheState = this.epochStates.find((trancheState) => trancheState.trancheId === trancheId)
    trancheState.outstandingInvestOrders = trancheState.outstandingInvestOrders + newAmount - oldAmount
    return this
  }

  public updateOutstandingRedeemOrders = (trancheId: string, newAmount: bigint, oldAmount: bigint) => {
    const trancheState = this.epochStates.find((trancheState) => trancheState.trancheId === trancheId)
    trancheState.outstandingRedeemOrders = trancheState.outstandingRedeemOrders + newAmount - oldAmount
    return this
  }
}
