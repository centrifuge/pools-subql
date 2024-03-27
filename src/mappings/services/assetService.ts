import { Option } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { WAD } from '../../config'
import { LoanPricingAmount, NftItemMetadata } from '../../helpers/types'
import { Asset, AssetType, AssetValuationMethod, AssetStatus } from '../../types'
import { ActiveLoanData } from './poolService'
import { cid, readIpfs } from '../../helpers/ipfsFetch'

export class AssetService extends Asset {
  static init(
    poolId: string,
    assetId: string,
    type: AssetType,
    valuationMethod: AssetValuationMethod,
    nftClassId: bigint | undefined,
    nftItemId: bigint | undefined,
    timestamp: Date,
    blockchain = '0'
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

    asset.collateralNftClassId = nftClassId
    asset.collateralNftItemId = nftItemId

    asset.outstandingPrincipal = BigInt(0)
    asset.outstandingInterest = BigInt(0)
    asset.outstandingDebt = BigInt(0)
    asset.presentValue = BigInt(0)
    asset.writeOffPercentage = BigInt(0)
    asset.totalBorrowed = BigInt(0)
    asset.totalRepaid = BigInt(0)
    asset.totalRepaidPrincipal = BigInt(0)
    asset.totalRepaidInterest = BigInt(0)
    asset.totalRepaidUnscheduled = BigInt(0)

    asset.borrowedAmountByPeriod = BigInt(0)
    asset.repaidAmountByPeriod = BigInt(0)

    return asset
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
    Object.assign(this, activeAssetData)
    logger.info(`Updating outstanding debt for asset: ${this.id} to ${this.outstandingDebt.toString()}`)
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
    if (!this.metadata) return logger.warn('No IPFS metadata')
    const metadata = await readIpfs<AssetIpfsMetadata>(this.metadata.match(cid)[0])
    return metadata?.name ?? null
  }
}

interface AssetSpecs {
  advanceRate: bigint
  collateralValue: bigint
  probabilityOfDefault?: bigint
  lossGivenDefault?: bigint
  discountRate?: bigint
  maturityDate?: Date
}

interface AssetIpfsMetadata {
  name: string
  properties: unknown
  [key: string]: unknown
}
