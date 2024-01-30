import { Option, Vec } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { RAY, WAD } from '../../config'
import { InterestAccrualRateDetails, NftItemMetadata } from '../../helpers/types'
import { Loan, LoanStatus } from '../../types'

const SECONDS_PER_YEAR = bnToBn('3600').muln(24).muln(365)

export class LoanService extends Loan {
  static init(poolId: string, loanId: string, nftClassId: bigint, nftItemId: bigint, timestamp: Date) {
    logger.info(`Initialising loan ${loanId} for pool ${poolId}`)
    const loan = new this(`${poolId}-${loanId}`, timestamp, poolId, false, LoanStatus.CREATED)

    loan.collateralNftClassId = nftClassId
    loan.collateralNftItemId = nftItemId
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

  public async updateOutstandingDebt(normalizedAcc: bigint, interestRate: bigint) {
    const interestRatePerSec = nToBigInt(bnToBn(interestRate).div(SECONDS_PER_YEAR).add(RAY))
    logger.info(`Calculated IRS: ${interestRatePerSec.toString()}`)
    const rateDetails = await api.query.interestAccrual.rates<Vec<InterestAccrualRateDetails>>()
    const { accumulatedRate } = rateDetails.find(
      (rateDetails) => rateDetails.interestRatePerSec.toBigInt() === interestRatePerSec
    )
    this.outstandingDebt = nToBigInt(bnToBn(normalizedAcc).mul(bnToBn(accumulatedRate)).div(RAY))
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
