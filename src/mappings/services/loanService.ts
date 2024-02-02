import { Option } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { WAD } from '../../config'
import { NftItemMetadata } from '../../helpers/types'
import { Loan, LoanStatus } from '../../types'
import { ActiveLoanData } from './poolService'

export class LoanService extends Loan {
  static init(poolId: string, loanId: string, nftClassId: bigint, nftItemId: bigint, timestamp: Date) {
    logger.info(`Initialising loan ${loanId} for pool ${poolId}`)
    const loan = new this(`${poolId}-${loanId}`, timestamp, nftClassId, nftItemId, poolId, false, LoanStatus.CREATED)

    loan.outstandingPrincipal = BigInt(0)
    loan.outstandingInterest = BigInt(0)
    loan.outstandingDebt = BigInt(0)
    loan.presentValue = BigInt(0)
    loan.writeOffPercentage = BigInt(0)
    loan.totalBorrowed = BigInt(0)
    loan.totalRepaid = BigInt(0)
    loan.totalRepaidPrincipal = BigInt(0)
    loan.totalRepaidInterest = BigInt(0)
    loan.totalRepaidUnscheduled = BigInt(0)

    return loan
  }

  static async getById(poolId: string, loanId: string) {
    const loan = (await this.get(`${poolId}-${loanId}`)) as LoanService
    return loan
  }

  public borrow(amount: bigint) {
    logger.info(`Increasing borrowings for loan ${this.id} by ${amount}`)
    this.borrowedAmountByPeriod += amount
  }

  public repay(amount: bigint) {
    logger.info(`Increasing repayments for loan ${this.id} by ${amount}`)
    this.repaidAmountByPeriod += amount
  }

  public updateInterestRate(interestRatePerSec: bigint) {
    logger.info(`Updating interest rate for loan ${this.id} to ${interestRatePerSec}`)
    this.interestRatePerSec = interestRatePerSec
  }

  public writeOff(percentage: bigint, penaltyInterestRatePerSec: bigint) {
    logger.info(`Writing off loan ${this.id} with ${percentage}`)
    this.writtenOffPercentageByPeriod = percentage
    this.penaltyInterestRatePerSec = penaltyInterestRatePerSec

    this.writtenOffAmountByPeriod = nToBigInt(bnToBn(this.outstandingDebt).mul(bnToBn(percentage)).div(WAD))
  }

  public updateLoanSpecs(decodedLoanSpecs: LoanSpecs) {
    logger.info(`Updating loan specs for ${this.id}`)
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

  public async updateActiveLoanData(activeLoanData: ActiveLoanData[keyof ActiveLoanData]) {
    Object.assign(this, activeLoanData)
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

interface LoanSpecs {
  advanceRate: bigint
  collateralValue: bigint
  probabilityOfDefault?: bigint
  lossGivenDefault?: bigint
  discountRate?: bigint
  maturityDate?: Date
}
