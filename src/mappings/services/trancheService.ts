import { u128, u64 } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { CPREC, RAY, RAY_DIGITS, WAD_DIGITS } from '../../config'
import { errorHandler } from '../../helpers/errorHandler'
import { ExtendedRpc, TrancheDetails } from '../../helpers/types'
import { Tranche, TrancheSnapshot, TrancheState } from '../../types'

export class TrancheService {
  readonly tranche: Tranche
  readonly trancheState: TrancheState

  constructor(tranche: Tranche, trancheState: TrancheState) {
    this.tranche = tranche
    this.trancheState = trancheState
  }

  static init = (poolId: string, trancheId: string, index: number, trancheData: TrancheDetails) => {
    const trancheState = new TrancheState(`${poolId}-${trancheId}`)
    trancheState.type = 'ALL'
    trancheState.active = true
    trancheState.outstandingInvestOrders_ = BigInt(0)
    trancheState.outstandingRedeemOrders_ = BigInt(0)
    trancheState.outstandingRedeemOrdersCurrency_ = BigInt(0)
    trancheState.fulfilledInvestOrders_ = BigInt(0)
    trancheState.fulfilledRedeemOrders_ = BigInt(0)
    trancheState.fulfilledRedeemOrdersCurrency_ = BigInt(0)
    trancheState.price = nToBigInt(RAY)

    const tranche = new Tranche(`${poolId}-${trancheId}`)
    tranche.type = 'ALL'
    tranche.poolId = poolId
    tranche.trancheId = trancheId
    tranche.index = index
    tranche.isResidual = trancheData.trancheType.isResidual
    tranche.seniority = trancheData.seniority.toNumber()

    if (!tranche.isResidual) {
      tranche.interestRatePerSec = trancheData.trancheType.asNonResidual.interestRatePerSec.toBigInt()
      tranche.minRiskBuffer = trancheData.trancheType.asNonResidual.minRiskBuffer.toBigInt()
    }

    tranche.stateId = trancheState.id

    return new TrancheService(tranche, trancheState)
  }

  static getById = async (poolId: string, trancheId: string) => {
    const tranche = await Tranche.get(`${poolId}-${trancheId}`)
    const trancheState = await TrancheState.get(`${poolId}-${trancheId}`)
    if (tranche === undefined || trancheState === undefined) return undefined
    return new TrancheService(tranche, trancheState)
  }

  static getOrInit = async (poolId: string, trancheId: string, index: number, trancheData: TrancheDetails) => {
    let tranche = await this.getById(poolId, trancheId)
    if (tranche === undefined) {
      tranche = this.init(poolId, trancheId, index, trancheData)
      await tranche.save()
    }
    return tranche
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

  static getActives = async (poolId: string) => {
    const tranches = await Tranche.getByPoolId(poolId)
    const ids = tranches.map((tranche) => tranche.id)
    const states = await Promise.all(ids.map((id) => TrancheState.get(id)))
    const activeStates = states.filter((state) => state.active === true)
    const result: TrancheService[] = []
    for (const trancheState of activeStates) {
      const element = new TrancheService(await Tranche.get(trancheState.id), trancheState)
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
    logger.info(`Updating price for tranche ${this.tranche.id} to :${price}`)
    this.trancheState.price = price
    return this
  }

  private _updatePricefromRpc = async () => {
    logger.info(`Qerying RPC price for tranche ${this.tranche.id}`)
    const poolId = new u64(api.registry, this.tranche.poolId)
    const tokenPrices = await (api.rpc as ExtendedRpc).pools.trancheTokenPrices(poolId)
    const trancheTokenPrice = tokenPrices[this.tranche.index].toBigInt()
    if (trancheTokenPrice <= BigInt(0))
      throw new Error(`Zero or negative price returned for tranche: ${this.tranche.id}`)
    this.updatePrice(trancheTokenPrice)
    return this
  }
  public updatePriceFromRpc = errorHandler(this._updatePricefromRpc)

  public updateDebt = (debt: bigint) => {
    logger.info(`Updating debt for tranche ${this.tranche.id} to :${debt}`)
    this.trancheState.debt = debt
    return this
  }

  private _computeYield = async (yieldField: string, referencePeriodStart?: Date) => {
    logger.info(
      `Computing yield for tranche ${this.tranche.trancheId} of ` +
        `pool ${this.tranche.poolId} with reference date ${referencePeriodStart}`
    )

    let trancheSnapshot: TrancheSnapshot
    if (referencePeriodStart) {
      const trancheSnapshots = await TrancheSnapshot.getByPeriodStart(referencePeriodStart)
      if (trancheSnapshots.length === 0) {
        logger.warn(
          `No tranche snapshot exist for pool ${this.tranche.poolId} with reference date ${referencePeriodStart}`
        )
        return this
      }

      trancheSnapshot = trancheSnapshots.find(
        (snapshot) => snapshot.trancheId === `${this.tranche.poolId}-${this.tranche.trancheId}`
      )
      if (trancheSnapshot === undefined) {
        logger.warn(
          `No tranche snapshot found tranche ${this.tranche.poolId}-${this.tranche.trancheId} with ` +
            `reference date ${referencePeriodStart}`
        )
        return this
      }
      if (typeof this.trancheState.price !== 'bigint') {
        logger.warn('Price information missing')
        return this
      }
    }
    const priceCurrent = bnToBn(this.trancheState.price)
    const priceOld = referencePeriodStart ? bnToBn(trancheSnapshot.price) : RAY
    this.trancheState[yieldField] = nToBigInt(priceCurrent.mul(RAY).div(priceOld).sub(RAY))
    return this
  }
  public computeYield = errorHandler(this._computeYield)

  private _computeYieldAnnualized = async (
    yieldField: string,
    currentPeriodStart: Date,
    referencePeriodStart: Date
  ) => {
    logger.info(
      `Computing annualized yield for tranche ${this.tranche.trancheId} of ` +
        `pool ${this.tranche.poolId} with reference date ${referencePeriodStart}`
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
        `No tranche snapshot found tranche ${this.tranche.poolId}-${this.tranche.poolId} with ` +
          `reference date ${referencePeriodStart}`
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
    this.trancheState[yieldField] = nToBigInt(priceCurrent.mul(RAY).div(priceOld).sub(RAY).mul(annualizationFactor))
    return this
  }
  public computeYieldAnnualized = errorHandler(this._computeYieldAnnualized)

  public updateOutstandingInvestOrders = (newAmount: bigint, oldAmount: bigint) => {
    this.trancheState.outstandingInvestOrders_ = this.trancheState.outstandingInvestOrders_ + newAmount - oldAmount
    return this
  }

  public updateOutstandingRedeemOrders = (newAmount: bigint, oldAmount: bigint, digits: number) => {
    this.trancheState.outstandingRedeemOrders_ = this.trancheState.outstandingRedeemOrders_ + newAmount - oldAmount
    this.trancheState.outstandingRedeemOrdersCurrency_ = this.computeCurrencyAmount(
      this.trancheState.outstandingRedeemOrders_,
      digits
    )
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

  private computeCurrencyAmount = (amount: bigint, digits: number) =>
    nToBigInt(
      bnToBn(amount)
        .mul(bnToBn(this.trancheState.price))
        .div(CPREC(RAY_DIGITS + WAD_DIGITS - digits))
    )

  public deactivate = () => {
    this.trancheState.active = false
  }

  public activate = () => {
    this.trancheState.active = true
  }
}
