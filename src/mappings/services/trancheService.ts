import { u128 } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { paginatedGetter } from '../../helpers/paginatedGetter'
import { WAD } from '../../config'
import { ExtendedRpc, TrancheDetails } from '../../helpers/types'
import { Tranche, TrancheSnapshot } from '../../types'
import { TrancheProps } from '../../types/models/Tranche'

const MAINNET_CHAINID = '0xb3db41421702df9a7fcac62b53ffeac85f7853cc4e689e0b93aeb3db18c09d82'

export class TrancheService extends Tranche {
  static seed(poolId: string, trancheId: string) {
    return new this(`${poolId}-${trancheId}`, 'ALL', poolId, trancheId, false)
  }

  static async getOrSeed(poolId: string, trancheId: string) {
    let tranche = await this.getById(poolId, trancheId)
    if (!tranche) {
      tranche = this.seed(poolId, trancheId)
      await tranche.save()
    }
    return tranche
  }

  public init(index: number, trancheData: TrancheDetails) {
    this.index = index
    this.isResidual = trancheData.trancheType.isResidual
    this.seniority = trancheData.seniority.toNumber()
    this.isActive = true
    this.sumOutstandingInvestOrdersByPeriod = BigInt(0)
    this.sumOutstandingRedeemOrdersByPeriod = BigInt(0)
    this.sumOutstandingRedeemOrdersCurrencyByPeriod = BigInt(0)
    this.sumFulfilledInvestOrdersByPeriod = BigInt(0)
    this.sumFulfilledRedeemOrdersByPeriod = BigInt(0)
    this.sumFulfilledRedeemOrdersCurrencyByPeriod = BigInt(0)

    this.tokenPrice = nToBigInt(WAD)
    this.sumDebt = trancheData.debt.toBigInt()

    if (!this.isResidual) {
      this.interestRatePerSec = trancheData.trancheType.asNonResidual.interestRatePerSec.toBigInt()
      this.minRiskBuffer = trancheData.trancheType.asNonResidual.minRiskBuffer.toBigInt()
    }

    return this
  }

  static async getById(poolId: string, trancheId: string) {
    const tranche = (await this.get(`${poolId}-${trancheId}`)) as TrancheService
    return tranche
  }

  static async getByPoolId(poolId: string) {
    const tranches = (await paginatedGetter('Tranche', 'poolId', poolId)).map((tranche) =>
      this.create(tranche as TrancheProps)
    )
    return tranches as TrancheService[]
  }

  static async getActives(poolId: string) {
    const tranches = (await this.getByPoolId(poolId)) as TrancheService[]
    const activeTranches = tranches.filter((state) => state.isActive === true)
    return activeTranches
  }

  public async updateSupply() {
    const requestPayload = { Tranche: [this.poolId, this.trancheId] }
    const supplyResponse = await api.query.ormlTokens.totalIssuance<u128>(requestPayload)
    logger.info(`SupplyResponse: ${JSON.stringify(supplyResponse)}`)
    this.tokenSupply = supplyResponse.toBigInt()
    return this
  }

  public updatePrice(price: bigint, block?: number) {
    // https://centrifuge.subscan.io/extrinsic/4058350-0?event=4058350-0
    // fix decimal error in old blocks, the fix was enacted at block #4058350
    if (MAINNET_CHAINID === chainId && !!block && block < 4058350) {
      this.tokenPrice = nToBigInt(bnToBn(price).div(bnToBn(1000000000)))
      logger.info(`Updating price for tranche ${this.id} to: ${this.tokenPrice} (WITH CORRECTION FACTOR)`)
    } else {
      this.tokenPrice = price
      logger.info(`Updating price for tranche ${this.id} to: ${this.tokenPrice}`)
    }
    this.tokenPrice = price
    return this
  }

  public async updatePriceFromRpc(block?: number) {
    logger.info(`Querying RPC price for tranche ${this.id}`)
    const poolId = this.poolId
    const tokenPrices = await (api.rpc as ExtendedRpc).pools.trancheTokenPrices(poolId)
    const trancheTokenPrice = tokenPrices[this.index].toBigInt()
    if (trancheTokenPrice <= BigInt(0)) throw new Error(`Zero or negative price returned for tranche: ${this.id}`)
    this.updatePrice(trancheTokenPrice, block)
    return this
  }

  public updateDebt(debt: bigint) {
    logger.info(`Updating debt for tranche ${this.id} to :${debt}`)
    this.sumDebt = debt
    return this
  }

  public async computeYield(yieldField: string, referencePeriodStart?: Date) {
    logger.info(
      `Computing yield for tranche ${this.trancheId} of ` +
        `pool ${this.poolId} with reference date ${referencePeriodStart}`
    )

    let trancheSnapshot: TrancheSnapshot
    if (referencePeriodStart) {
      const trancheSnapshots = await TrancheSnapshot.getByPeriodStart(referencePeriodStart)
      if (trancheSnapshots.length === 0) {
        logger.warn(`No tranche snapshot exist for pool ${this.poolId} with reference date ${referencePeriodStart}`)
        return this
      }

      trancheSnapshot = trancheSnapshots.find((snapshot) => snapshot.trancheId === `${this.poolId}-${this.trancheId}`)
      if (trancheSnapshot === undefined) {
        logger.warn(
          `No tranche snapshot found tranche ${this.poolId}-${this.trancheId} with ` +
            `reference date ${referencePeriodStart}`
        )
        return this
      }
      if (typeof this.tokenPrice !== 'bigint') {
        logger.warn('Price information missing')
        return this
      }
    }
    const priceCurrent = bnToBn(this.tokenPrice)
    const priceOld = referencePeriodStart ? bnToBn(trancheSnapshot.tokenPrice) : WAD
    this[yieldField] = nToBigInt(priceCurrent.mul(WAD).div(priceOld).sub(WAD))
    return this
  }

  public async computeYieldAnnualized(yieldField: string, currentPeriodStart: Date, referencePeriodStart: Date) {
    logger.info(
      `Computing annualized yield for tranche ${this.trancheId} of ` +
        `pool ${this.poolId} with reference date ${referencePeriodStart}`
    )
    const trancheSnapshots = await TrancheSnapshot.getByPeriodStart(referencePeriodStart)
    if (trancheSnapshots.length === 0) {
      logger.warn(`No tranche snapshot found pool ${this.poolId} with reference date ${referencePeriodStart}`)
      return this
    }
    const trancheSnapshot = trancheSnapshots.find(
      (snapshot) => snapshot.trancheId === `${this.poolId}-${this.trancheId}`
    )
    if (trancheSnapshot === undefined) {
      logger.warn(
        `No tranche snapshot found tranche ${this.poolId}-${this.poolId} with ` +
          `reference date ${referencePeriodStart}`
      )
      return this
    }
    if (typeof this.tokenPrice !== 'bigint') {
      logger.warn('Price information missing')
      return this
    }
    const annualizationFactor = bnToBn(365 * 24 * 3600 * 1000).div(
      bnToBn(currentPeriodStart.valueOf() - referencePeriodStart.valueOf())
    )
    const priceCurrent = bnToBn(this.tokenPrice)
    const priceOld = bnToBn(trancheSnapshot.tokenPrice)
    this[yieldField] = nToBigInt(priceCurrent.mul(WAD).div(priceOld).sub(WAD).mul(annualizationFactor))
    return this
  }

  public updateOutstandingInvestOrders = (newAmount: bigint, oldAmount: bigint) => {
    this.sumOutstandingInvestOrdersByPeriod = this.sumOutstandingInvestOrdersByPeriod + newAmount - oldAmount
    return this
  }

  public updateOutstandingRedeemOrders(newAmount: bigint, oldAmount: bigint) {
    this.sumOutstandingRedeemOrdersByPeriod = this.sumOutstandingRedeemOrdersByPeriod + newAmount - oldAmount
    this.sumOutstandingRedeemOrdersCurrencyByPeriod = this.computeCurrencyAmount(
      this.sumOutstandingRedeemOrdersByPeriod
    )
    return this
  }

  public updateFulfilledInvestOrders(amount: bigint) {
    this.sumFulfilledInvestOrdersByPeriod = this.sumFulfilledInvestOrdersByPeriod + amount
    return this
  }

  public updateFulfilledRedeemOrders(amount: bigint) {
    this.sumFulfilledRedeemOrdersByPeriod = this.sumFulfilledRedeemOrdersByPeriod + amount
    this.sumFulfilledRedeemOrdersCurrencyByPeriod = this.computeCurrencyAmount(this.sumFulfilledRedeemOrdersByPeriod)
    return this
  }

  private computeCurrencyAmount(amount: bigint) {
    return nToBigInt(bnToBn(amount).mul(bnToBn(this.tokenPrice)).div(WAD))
  }

  public deactivate() {
    this.isActive = false
  }

  public activate() {
    this.isActive = true
  }
}
