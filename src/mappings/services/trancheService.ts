import { u128 } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { errorHandler } from '../../helpers/errorHandler'
import { TrancheDetails } from '../../helpers/types'
import { Tranche, TrancheSnapshot, TrancheState } from '../../types'

export class TrancheService {
  readonly tranche: Tranche
  readonly trancheState: TrancheState

  constructor(tranche: Tranche, trancheState: TrancheState) {
    this.tranche = tranche
    this.trancheState = trancheState
  }

  static init = async (trancheId: string, poolId: string, trancheData: TrancheDetails) => {
    const trancheState = new TrancheState(`${poolId}-${trancheId}`)
    trancheState.type = 'ALL'

    trancheState.outstandingInvestOrders_ = BigInt(0)
    trancheState.outstandingRedeemOrders_ = BigInt(0)
    trancheState.fulfilledInvestOrders_ = BigInt(0)
    trancheState.fulfilledRedeemOrders_ = BigInt(0)

    const tranche = new Tranche(`${poolId}-${trancheId}`)
    tranche.type = 'ALL'
    tranche.poolId = poolId
    tranche.trancheId = trancheId
    tranche.isResidual = trancheData.trancheType.isResidual
    tranche.seniority = trancheData.seniority.toNumber()

    if (!tranche.isResidual) {
      tranche.interestRatePerSec = trancheData.trancheType.asNonResidual.interestRatePerSec.toBigInt()
      tranche.minRiskBuffer = trancheData.trancheType.asNonResidual.minRiskBuffer.toBigInt()
    }

    tranche.stateId = trancheState.id

    return new TrancheService(tranche, trancheState)
  }

  static getById = async (trancheId: string) => {
    const tranche = await Tranche.get(trancheId)
    const trancheState = await TrancheState.get(trancheId)
    if (tranche === undefined || trancheState === undefined) return undefined
    return new TrancheService(tranche, trancheState)
  }

  static getByPoolId = async (poolId: string) => {
    const tranches = await Tranche.getByPoolId(poolId)
    const result: TrancheService[] = []
    for (const tranche of tranches) {
      const element = new TrancheService(tranche, await TrancheState.get(tranche.id))
      result.push(element)
    }
    return result
  }

  public save = async () => {
    await this.trancheState.save()
    await this.tranche.save()
  }

  private _updateSupply = async () => {
    const requestPayload = { Tranche: [this.tranche.poolId, this.tranche.trancheId] }
    const supplyResponse = await api.query.ormlTokens.totalIssuance<u128>(requestPayload)
    logger.info(`SupplyResponse: ${JSON.stringify(supplyResponse)}`)
    this.trancheState.supply = supplyResponse.toBigInt()
    return this
  }
  public updateSupply = errorHandler(this._updateSupply)

  public updatePrice = (price: bigint) => {
    this.trancheState.price = price
    return this
  }

  private _computeYield = async (yieldField: string, referencePeriodStart: Date) => {
    logger.info(
      `Computing yield for tranche ${this.tranche.trancheId} of\
       pool ${this.tranche.poolId} with reference date ${referencePeriodStart}`
    )
    const trancheSnapshots = await TrancheSnapshot.getByPeriodStart(referencePeriodStart)
    if (trancheSnapshots.length === 0) {
      logger.warn(
        `No tranche snapshot exist for pool ${this.tranche.poolId} with reference date ${referencePeriodStart}`
      )
      return this
    }
    const trancheSnapshot = trancheSnapshots.find(
      (snapshot) => snapshot.trancheId === `${this.tranche.poolId}-${this.tranche.trancheId}`
    )
    if (trancheSnapshot === undefined) {
      logger.warn(
        `No tranche snapshot found tranche ${this.tranche.poolId}-${this.tranche.trancheId} with\
         reference date ${referencePeriodStart}`
      )
      return this
    }
    if (typeof this.trancheState.price !== 'bigint') {
      logger.warn('Price information missing')
      return this
    }
    const priceCurrent = bnToBn(this.trancheState.price)
    const priceOld = bnToBn(trancheSnapshot.price)
    this.trancheState[yieldField] = nToBigInt(
      priceCurrent
        .mul(bnToBn(10).pow(bnToBn(27)))
        .div(priceOld)
        .sub(bnToBn(10).pow(bnToBn(27)))
    )
    return this
  }
  public computeYield = errorHandler(this._computeYield)

  private _computeYieldAnnualized = async (
    yieldField: string,
    currentPeriodStart: Date,
    referencePeriodStart: Date
  ) => {
    logger.info(
      `Computing annualized yield for tranche ${this.tranche.trancheId} of\
       pool ${this.tranche.poolId} with reference date ${referencePeriodStart}`
    )
    const trancheSnapshots = await TrancheSnapshot.getByPeriodStart(referencePeriodStart)
    if (trancheSnapshots.length === 0) {
      logger.warn(`No tranche snapshot found pool ${this.tranche.poolId} with reference date ${referencePeriodStart}`)
      return this
    }
    const trancheSnapshot = trancheSnapshots.find(
      (snapshot) => snapshot.trancheId === `${this.tranche.poolId}-${this.tranche.trancheId}`
    )
    if (trancheSnapshot === undefined) {
      logger.warn(
        `No tranche snapshot found tranche ${this.tranche.poolId}-${this.tranche.poolId} with\
         reference date ${referencePeriodStart}`
      )
      return this
    }
    if (typeof this.trancheState.price !== 'bigint') {
      logger.warn('Price information missing')
      return this
    }
    const annualizationFactor = bnToBn(365 * 24 * 3600 * 1000).div(
      bnToBn(currentPeriodStart.valueOf() - referencePeriodStart.valueOf())
    )
    const priceCurrent = bnToBn(this.trancheState.price)
    const priceOld = bnToBn(trancheSnapshot.price)
    this.trancheState[yieldField] = nToBigInt(
      priceCurrent
        .mul(bnToBn(10).pow(bnToBn(27)))
        .div(priceOld)
        .sub(bnToBn(10).pow(bnToBn(27)))
        .mul(annualizationFactor)
    )
    return this
  }
  public computeYieldAnnualized = errorHandler(this._computeYieldAnnualized)

  public updateOutstandingInvestOrders = (newAmount: bigint, oldAmount: bigint) => {
    this.trancheState.outstandingInvestOrders_ = this.trancheState.outstandingInvestOrders_ + newAmount - oldAmount
    return this
  }

  public updateOutstandingRedeemOrders = (newAmount: bigint, oldAmount: bigint) => {
    this.trancheState.outstandingRedeemOrders_ = this.trancheState.outstandingRedeemOrders_ + newAmount - oldAmount
    return this
  }

  public updateFulfilledInvestOrders = (amount: bigint) => {
    this.trancheState.fulfilledInvestOrders_ = this.trancheState.fulfilledInvestOrders_ + amount
    return this
  }

  public updateFulfilledRedeemOrders = (amount: bigint) => {
    this.trancheState.fulfilledRedeemOrders_ = this.trancheState.fulfilledRedeemOrders_ + amount
    return this
  }
}
