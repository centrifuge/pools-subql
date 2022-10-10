import { Option } from '@polkadot/types'
import { AnyJson } from '@polkadot/types/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { RAY } from '../../config'
import { errorHandler } from '../../helpers/errorHandler'
import { InterestAccrualRateDetails } from '../../helpers/types'
import { Loan, LoanState, LoanType } from '../../types'

export class LoanService {
  readonly loan: Loan
  readonly loanState: LoanState

  constructor(loan: Loan, loanState: LoanState) {
    this.loan = loan
    this.loanState = loanState
  }

  static init = async (poolId: string, loanId: string, collateral: bigint, timestamp: Date) => {
    logger.info(`Initialising loan ${loanId} for pool ${poolId}`)
    const loan = new Loan(`${poolId}-${loanId}`)
    const loanState = new LoanState(`${poolId}-${loanId}`)

    loan.createdAt = timestamp
    loan.poolId = poolId
    loan.collateral = collateral
    loan.stateId = `${poolId}-${loanId}`
    loanState.status = 'CREATED'
    loanState.outstandingDebt = BigInt(0)
    loanState.totalBorrowed_ = BigInt(0)
    loanState.totalRepaid_ = BigInt(0)

    return new LoanService(loan, loanState)
  }

  static getById = async (poolId: string, loanId: string) => {
    const [loan, loanState] = await Promise.all([Loan.get(`${poolId}-${loanId}`), LoanState.get(`${poolId}-${loanId}`)])
    if (loan === undefined || loanState === undefined) return undefined
    return new LoanService(loan, loanState)
  }

  public save = async () => {
    await this.loanState.save()
    await this.loan.save()
  }

  public borrow = (amount: bigint) => {
    logger.info(`Increasing outstanding debt for loan ${this.loan.id} by ${amount}`)
    this.loanState.totalBorrowed_ = this.loanState.totalBorrowed_ + amount
  }

  public repay = (amount: bigint) => {
    logger.info(`Decreasing outstanding debt for loan ${this.loan.id} by ${amount}`)
    this.loanState.totalRepaid_ = this.loanState.totalRepaid_ + amount
  }

  public updateInterestRate = (interestRatePerSec: bigint) => {
    logger.info(`Updating interest rate for loan ${this.loan.id} to ${interestRatePerSec}`)
    this.loan.interestRatePerSec = interestRatePerSec
  }

  public writeOff = (percentage: bigint, penaltyInterestRatePerSec: bigint, writeOffIndex: number) => {
    logger.info(`Writing off loan ${this.loan.id} with ${percentage}`)
    this.loanState.writtenOffPercentage = percentage
    this.loanState.penaltyInterestRatePerSec = penaltyInterestRatePerSec
    this.loanState.writeOffIndex = writeOffIndex
  }

  public updateLoanType = (loanType: string, loanSpec?: AnyJson) => {
    logger.info(`Updating loan type for loan ${this.loan.id} to ${loanType}`)
    this.loan.type = loanType as LoanType
    const specBuff = Buffer.from(JSON.stringify(loanSpec))
    this.loan.spec = specBuff.toString('base64')
  }

  public updateMaturityDate = (maturityDate: Date) => {
    logger.info(`Updating maturity date for loan ${this.loan.id} to ${maturityDate.toISOString()}`)
    this.loan.maturityDate = maturityDate
  }

  public activate = () => {
    logger.info(`Activating loan ${this.loan.id}`)
    this.loanState.status = 'ACTIVE'
  }

  public close = () => {
    logger.info(`Closing loan ${this.loan.id}`)
    this.loanState.status = 'CLOSED'
  }

  private _updateOutstandingDebt = async (normalizedDebt: bigint, interestRatePerSec: bigint) => {
    const rateDetails = await api.query.interestAccrual.rate<Option<InterestAccrualRateDetails>>(interestRatePerSec)
    if (rateDetails.isNone) return
    const { accumulatedRate } = rateDetails.unwrap()
    this.loanState.outstandingDebt = nToBigInt(bnToBn(normalizedDebt).mul(bnToBn(accumulatedRate)).div(RAY))
    logger.info(`Updating outstanding debt for loan: ${this.loan.id} to ${this.loanState.outstandingDebt.toString()}`)
  }
  public updateOutstandingDebt = errorHandler(this._updateOutstandingDebt)
}
