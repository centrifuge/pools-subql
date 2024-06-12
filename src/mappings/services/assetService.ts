import { Option } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { WAD } from '../../config'
import { ApiQueryLoansActiveLoans, LoanPricingAmount, NftItemMetadata } from '../../helpers/types'
import { Asset, AssetType, AssetValuationMethod, AssetStatus } from '../../types'
import { ActiveLoanData } from './poolService'
import { cid, readIpfs } from '../../helpers/ipfsFetch'

export const ONCHAIN_CASH_ASSET_ID = '0'
export class AssetService extends Asset {
  static init(
    poolId: string,
    assetId: string,
    type: AssetType,
    valuationMethod: AssetValuationMethod,
    nftClassId: bigint | undefined,
    nftItemId: bigint | undefined,
    timestamp: Date,
    blockchain = '0',
    name?: string
  ) {
    logger.info(`Initialising asset ${assetId} for pool ${poolId}`)
    const isActive = false
    const asset = new this(
      `${poolId}-${assetId}`,
      timestamp,
      blockchain,
      type,
      valuationMethod,
      poolId,
      isActive,
      AssetStatus.CREATED
    )

    asset.name = name

    asset.collateralNftClassId = nftClassId
    asset.collateralNftItemId = nftItemId

    asset.outstandingPrincipal = BigInt(0)
    asset.outstandingInterest = BigInt(0)
    asset.outstandingDebt = BigInt(0)
    asset.presentValue = BigInt(0)
    asset.outstandingQuantity = BigInt(0)
    asset.currentPrice = BigInt(0)
    asset.notional = BigInt(0)
    asset.writeOffPercentage = BigInt(0)
    asset.totalBorrowed = BigInt(0)
    asset.totalRepaid = BigInt(0)
    asset.totalRepaidPrincipal = BigInt(0)
    asset.totalRepaidInterest = BigInt(0)
    asset.totalRepaidUnscheduled = BigInt(0)

    asset.borrowedAmountByPeriod = BigInt(0)
    asset.repaidAmountByPeriod = BigInt(0)
    asset.writtenOffPercentageByPeriod = BigInt(0)
    asset.writtenOffAmountByPeriod = BigInt(0)
    asset.interestAccruedByPeriod = BigInt(0)

    asset.unrealizedProfitAtMarketPrice = BigInt(0)
    asset.unrealizedProfitAtNotional = BigInt(0)
    asset.unrealizedProfitByPeriod = BigInt(0)

    return asset
  }

  static initOnchainCash(poolId: string, timestamp: Date) {
    return this.init(
      poolId,
      ONCHAIN_CASH_ASSET_ID,
      AssetType.OnchainCash,
      AssetValuationMethod.Cash,
      undefined,
      undefined,
      timestamp,
      '0',
      'Onchain reserve'
    )
  }

  static async getById(poolId: string, assetId: string) {
    const asset = (await this.get(`${poolId}-${assetId}`)) as AssetService
    return asset
  }

  public borrow(amount: bigint) {
    logger.info(`Increasing borrowings for asset ${this.id} by ${amount}`)
    this.borrowedAmountByPeriod += amount
  }

  public repay(amount: bigint) {
    logger.info(`Increasing repayments for asset ${this.id} by ${amount}`)
    this.repaidAmountByPeriod += amount
  }

  public increaseQuantity(increase: bigint) {
    this.outstandingQuantity += increase
  }

  public decreaseQuantity(decrease: bigint) {
    this.outstandingQuantity -= decrease
  }

  public updateInterestRate(interestRatePerSec: bigint) {
    logger.info(`Updating interest rate for asset ${this.id} to ${interestRatePerSec}`)
    this.interestRatePerSec = interestRatePerSec
  }

  public writeOff(percentage: bigint, penaltyInterestRatePerSec: bigint) {
    logger.info(`Writing off asset ${this.id} with ${percentage}`)
    this.writtenOffPercentageByPeriod = percentage
    this.penaltyInterestRatePerSec = penaltyInterestRatePerSec

    this.writtenOffAmountByPeriod = nToBigInt(bnToBn(this.outstandingDebt).mul(bnToBn(percentage)).div(WAD))
  }

  public updateAssetSpecs(decodedAssetSpecs: AssetSpecs) {
    logger.info(`Updating asset specs for ${this.id}`)
    Object.assign(this, decodedAssetSpecs)
  }

  public updateCurrentPrice(currentPrice: bigint) {
    logger.info(`Updating current price for asset ${this.id} to ${currentPrice}`)
    this.currentPrice = currentPrice
  }

  public activate() {
    logger.info(`Activating asset ${this.id}`)
    this.isActive = true
    this.status = AssetStatus.ACTIVE
  }

  public close() {
    logger.info(`Closing asset ${this.id}`)
    this.isActive = false
    this.status = AssetStatus.CLOSED
  }

  public async updateActiveAssetData(activeAssetData: ActiveLoanData[keyof ActiveLoanData]) {
    const oldOutstaidingInterest = this.outstandingInterest
    const oldTotalRepaidInterest = this.totalRepaidInterest

    // Current price was always 0 until spec version 1025
    const specVersion = api.runtimeVersion.specVersion.toNumber()
    if (specVersion < 1025) delete activeAssetData.currentPrice

    // Set all active asset values
    Object.assign(this, activeAssetData)

    const deltaRepaidInterestAmount = this.totalRepaid - oldTotalRepaidInterest
    this.interestAccruedByPeriod = this.outstandingInterest - oldOutstaidingInterest + deltaRepaidInterestAmount
    logger.info(`Updated outstanding debt for asset: ${this.id} to ${this.outstandingDebt.toString()}`)
  }

  public async updateItemMetadata() {
    logger.info(
      `Updating metadata for asset: ${this.id} with ` +
        `collectionId ${this.collateralNftClassId.toString()}, ` +
        `itemId: ${this.collateralNftItemId.toString()}`
    )
    const itemMetadata = await api.query.uniques.instanceMetadataOf<Option<NftItemMetadata>>(
      this.collateralNftClassId,
      this.collateralNftItemId
    )
    if (itemMetadata.isNone) {
      throw new Error(
        `No metadata returned for asset: ${this.id} with ` +
          `collectionId ${this.collateralNftClassId.toString()}, ` +
          `itemId: ${this.collateralNftItemId.toString()}`
      )
    }

    const payload = itemMetadata.unwrap()
    this.metadata = payload.data.toUtf8()

    return this
  }

  static extractPrincipalAmount(principalObject: LoanPricingAmount) {
    let principal: bigint
    switch (principalObject.type) {
      case 'Internal':
        principal = principalObject.asInternal.toBigInt()
        break
      case 'External':
        principal = nToBigInt(
          principalObject.asExternal.quantity.toBn().mul(principalObject.asExternal.settlementPrice.toBn()).div(WAD)
        )
        break
    }
    return principal
  }

  public async updateIpfsAssetName(): Promise<string | null> {
    logger.info(`Fetching IPFS asset name for asset ${this.id} `)
    if (!this.metadata) return logger.warn('No IPFS metadata')
    const metadata = await readIpfs<AssetIpfsMetadata>(this.metadata.match(cid)[0])
    if (metadata?.name) {
      this.name = metadata.name
    }
    return metadata?.name ?? null
  }

  public isOffchainCash() {
    return this.type === AssetType.OffchainCash
  }

  public isNonCash() {
    return this.type === AssetType.Other
  }

  public async updateExternalAssetPricingFromState() {
    logger.info(`Executing state call loans.activeLoans to update asset ${this.id} pricing information`)
    const loansCall = await api.query.loans.activeLoans<ApiQueryLoansActiveLoans>(this.poolId)
    const assetTuple = loansCall.find((tuple) => tuple[0].toString(10) === this.id.split('-')[1])
    if (!assetTuple) throw new Error(`Asset ${this.id} not found in pool active loans!`)
    const loanData = assetTuple[1]
    if (loanData.pricing.isInternal) throw new Error(`Asset ${this.id} is not of type External!`)
    const { outstandingQuantity, latestSettlementPrice } = loanData.pricing.asExternal
    this.outstandingQuantity = outstandingQuantity.toBigInt()
    this.updateCurrentPrice(latestSettlementPrice.toBigInt())
    logger.info(
      `Updated outstandingQuantity: ${outstandingQuantity.toString(10)} ` +
        `currentPrice: ${latestSettlementPrice.toString(10)} for asset ${this.id}`
    )
  }

  public updateUnrealizedProfit(atMarketPrice: bigint, atNotional: bigint) {
    logger.info(`Updating unrealizedProfit for asset ${this.id}: ${atMarketPrice}, ${atNotional}`)

    this.unrealizedProfitAtMarketPrice = atMarketPrice
    this.unrealizedProfitAtNotional = atNotional
    this.unrealizedProfitByPeriod = nToBigInt(
      bnToBn(this.outstandingQuantity)
        .mul(bnToBn(this.currentPrice).sub(bnToBn(this.periodPrice)))
        .div(WAD)
    )

    this.periodPrice = this.currentPrice
  }
}

interface AssetSpecs {
  advanceRate: bigint
  collateralValue: bigint
  probabilityOfDefault?: bigint
  lossGivenDefault?: bigint
  discountRate?: bigint
  maturityDate?: Date
  currentPrice?: bigint
  notional?: bigint
}

interface AssetIpfsMetadata {
  name: string
  properties: unknown
  [key: string]: unknown
}
