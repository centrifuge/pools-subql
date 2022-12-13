import { Option } from '@polkadot/types'
import { AnyJson } from '@polkadot/types/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { RAY, WAD } from '../../config'
import { InterestAccrualRateDetails, NftItemMetadata } from '../../helpers/types'
import { Loan, LoanStatus, LoanType } from '../../types'

export class LoanService extends Loan {
  static init(poolId: string, loanId: string, nftClassId: bigint, nftItemId: bigint, timestamp: Date) {
    logger.info(`Initialising loan ${loanId} for pool ${poolId}`)
    const loan = new this(`${poolId}-${loanId}`)

    loan.createdAt = timestamp
    loan.poolId = poolId
    loan.collateralNftClassId = nftClassId
    loan.collateralNftItemId = nftItemId
    loan.isActive = false
    loan.status = LoanStatus.CREATED
    loan.outstandingDebt = BigInt(0)
    loan.borrowedAmountByPeriod = BigInt(0)
    loan.repaidAmountByPeriod = BigInt(0)

    return loan
  }

  static async getById(poolId: string, loanId: string) {
    const loan = (await this.get(`${poolId}-${loanId}`)) as LoanService
    return loan
  }

  public borrow(amount: bigint) {
    logger.info(`Increasing outstanding debt for loan ${this.id} by ${amount}`)
    this.borrowedAmountByPeriod += amount
  }

  public repay(amount: bigint) {
    logger.info(`Decreasing outstanding debt for loan ${this.id} by ${amount}`)
    this.repaidAmountByPeriod += amount
  }

  public updateInterestRate(interestRatePerSec: bigint) {
    logger.info(`Updating interest rate for loan ${this.id} to ${interestRatePerSec}`)
    this.interestRatePerSec = interestRatePerSec
  }

  public writeOff(percentage: bigint, penaltyInterestRatePerSec: bigint, writeOffIndex: number) {
    logger.info(`Writing off loan ${this.id} with ${percentage}`)
    this.writtenOffPercentageByPeriod = percentage
    this.penaltyInterestRatePerSec = penaltyInterestRatePerSec
    this.writeOffIndex = writeOffIndex

    this.writtenOffAmountByPeriod = nToBigInt(bnToBn(this.outstandingDebt).mul(bnToBn(percentage)).div(WAD))
  }

  public updateLoanType(loanType: string, loanSpec?: AnyJson) {
    logger.info(`Updating loan type for loan ${this.id} to ${loanType}`)
    this.type = loanType as LoanType
    const specBuff = Buffer.from(JSON.stringify(loanSpec))
    this.spec = specBuff.toString('base64')
  }

  public updateLoanSpecs(decodedLoanSpecs: DecodedLoanSpecs) {
    Object.assign(this, decodedLoanSpecs)
  }

  public activate() {
    logger.info(`Activating loan ${this.id}`)
    this.isActive = true
    this.status = LoanStatus.ACTIVE
  }

  public close() {
    logger.info(`Closing loan ${this.id}`)
    this.isActive = false
    this.status = LoanStatus.CLOSED
  }

  public async updateOutstandingDebt(normalizedDebt: bigint, interestRatePerSec: bigint) {
    const rateDetails = await api.query.interestAccrual.rate<Option<InterestAccrualRateDetails>>(interestRatePerSec)
    if (rateDetails.isNone) return
    const { accumulatedRate } = rateDetails.unwrap()
    this.outstandingDebt = nToBigInt(bnToBn(normalizedDebt).mul(bnToBn(accumulatedRate)).div(RAY))
    logger.info(`Updating outstanding debt for loan: ${this.id} to ${this.outstandingDebt.toString()}`)
  }

  public async updateItemMetadata() {
    logger.info(
      `Updating metadata for loan: ${this.id} with ` +
        `collectionId ${this.collateralNftClassId.toString()}, ` +
        `itemId: ${this.collateralNftItemId.toString()}`
    )
    const itemMetadata = await api.query.uniques.instanceMetadataOf<Option<NftItemMetadata>>(
      this.collateralNftClassId,
      this.collateralNftItemId
    )
    if (itemMetadata.isNone) {
      throw new Error(
        `No metadata returned for loan: ${this.id} with ` +
          `collectionId ${this.collateralNftClassId.toString()}, ` +
          `itemId: ${this.collateralNftItemId.toString()}`
      )
    }

    const payload = itemMetadata.unwrap()
    this.metadata = payload.data.toUtf8()

    return this
  }
}

interface DecodedLoanSpecs {
  advanceRate: bigint
  value: bigint
  probabilityOfDefault?: bigint
  lossGivenDefault?: bigint
  discountRate?: bigint
  maturityDate?: Date
}