import { u128 } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { paginatedGetter } from '../../helpers/paginatedGetter'
import { WAD } from '../../config'
import { ExtendedRpc, TrancheDetails } from '../../helpers/types'
import { Tranche, TrancheSnapshot } from '../../types'
import { TrancheProps } from '../../types/models/Tranche'
import { SubstrateEvent } from '@subql/types'

export class TrancheService extends Tranche {
  static init(poolId: string, trancheId: string, index: number, trancheData: TrancheDetails) {
    const tranche = new this(`${poolId}-${trancheId}`)
    tranche.isActive = true
    tranche.sumOutstandingInvestOrdersByPeriod = BigInt(0)
    tranche.sumOutstandingRedeemOrdersByPeriod = BigInt(0)
    tranche.sumOutstandingRedeemOrdersCurrencyByPeriod = BigInt(0)
    tranche.sumFulfilledInvestOrdersByPeriod = BigInt(0)
    tranche.sumFulfilledRedeemOrdersByPeriod = BigInt(0)
    tranche.sumFulfilledRedeemOrdersCurrencyByPeriod = BigInt(0)
    tranche.tokenPrice = nToBigInt(WAD)

    tranche.type = 'ALL'
    tranche.poolId = poolId
    tranche.trancheId = trancheId
    tranche.index = index
    tranche.isResidual = trancheData.trancheType.isResidual
    tranche.seniority = trancheData.seniority.toNumber()
    tranche.sumDebt = trancheData.debt.toBigInt()

    if (!tranche.isResidual) {
      tranche.interestRatePerSec = trancheData.trancheType.asNonResidual.interestRatePerSec.toBigInt()
      tranche.minRiskBuffer = trancheData.trancheType.asNonResidual.minRiskBuffer.toBigInt()
    }

    return tranche
  }

  static async getById(poolId: string, trancheId: string) {
    const tranche = (await this.get(`${poolId}-${trancheId}`)) as TrancheService
    return tranche
  }

  static async getOrInit(poolId: string, trancheId: string, index: number, trancheData: TrancheDetails) {
    let tranche = await this.getById(poolId, trancheId)
    if (tranche === undefined) {
      tranche = this.init(poolId, trancheId, index, trancheData)
      await tranche.save()
    }
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

  public updatePrice(price: bigint, block: number) {
    logger.info(`Updating price for tranche ${this.id} to: ${price}`)
    // https://centrifuge.subscan.io/council/75
    // fix decimal error in old blocks, issue was fixed at #4017237
    if (block < 4017237) {
      this.tokenPrice = nToBigInt(bnToBn(price).div(bnToBn(1000000000)))
      return this
    }
    this.tokenPrice = price
    return this
  }

  public async updatePriceFromRpc(event: SubstrateEvent) {
    logger.info(`Querying RPC price for tranche ${this.id}`)
    const poolId = this.poolId
    const tokenPrices = await (api.rpc as ExtendedRpc).pools.trancheTokenPrices(poolId)
    const trancheTokenPrice = tokenPrices[this.index].toBigInt()
    if (trancheTokenPrice <= BigInt(0)) throw new Error(`Zero or negative price returned for tranche: ${this.id}`)
    this.updatePrice(trancheTokenPrice, event.block.block.header.number.toNumber())
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
