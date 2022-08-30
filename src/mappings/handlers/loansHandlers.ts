import { SubstrateEvent } from '@subql/types'
import {
  LoanBorrowedRepaidEvent,
  LoanCreatedClosedEvent,
  LoanPricedEvent,
  LoanWrittenOffEvent,
} from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'
import { LoanService } from '../services/loanService'

export const handleLoanCreated = errorHandler(_handleLoanCreated)
async function _handleLoanCreated(event: SubstrateEvent<LoanCreatedClosedEvent>) {
  const [poolId, loanId] = event.event.data
  logger.info(`Loan created event for pool: ${poolId.toString()} loan: ${loanId.toString()}`)

  const loan = await LoanService.init(poolId.toString(), loanId.toString(), event.block.timestamp)
  await loan.save()
}

export const handleLoanBorrowed = errorHandler(_handleLoanBorrowed)
async function _handleLoanBorrowed(event: SubstrateEvent<LoanBorrowedRepaidEvent>): Promise<void> {
  const [poolId, loanId, amount] = event.event.data
  logger.info(`Loan borrowed event for pool: ${poolId.toString()} amount: ${amount.toString()}`)

  // Update loan amount
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.borrow(amount.toBigInt())
  await loan.save()

  // Update poolState info
  const poolService = await PoolService.getById(poolId.toString())
  await poolService.increaseTotalBorrowings(amount.toBigInt())
  await poolService.save()
}

export const handleLoanPriced = errorHandler(_handleLoanPriced)
async function _handleLoanPriced(event: SubstrateEvent<LoanPricedEvent>) {
  const [poolId, loanId, interestRatePerSec, loanType] = event.event.data
  logger.info(`Loan priced event for pool: ${poolId.toString()} loan: ${loanId.toString()}`)
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.activate()
  await loan.updateInterestRate(interestRatePerSec.toBigInt())
  await loan.updateLoanType(loanType.type, loanType.inner.toJSON())
  await loan.save()
}

export const handleLoanRepaid = errorHandler(_handleLoanRepaid)
async function _handleLoanRepaid(event: SubstrateEvent<LoanBorrowedRepaidEvent>) {
  const [poolId, loanId, amount] = event.event.data
  logger.info(`Loan borrowed event for pool: ${poolId.toString()} amount: ${amount.toString()}`)
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.repay(amount.toBigInt())
  await loan.save()
}

export const handleLoanWrittenOff = errorHandler(_handleLoanWrittenOff)
async function _handleLoanWrittenOff(event: SubstrateEvent<LoanWrittenOffEvent>) {
  const [poolId, loanId, percentage, penaltyInterestRatePerSec, writeOffGroupIndex] = event.event.data
  logger.info(`Loan writtenoff event for pool: ${poolId.toString()} loanId: ${loanId.toString()}`)
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  const writeOffIndex = writeOffGroupIndex.isSome ? writeOffGroupIndex.unwrap().toNumber() : null
  await loan.writeOff(percentage.toBigInt(), penaltyInterestRatePerSec.toBigInt(), writeOffIndex)
  await loan.save()
}

export const handleLoanClosed = errorHandler(_handleLoanClosed)
async function _handleLoanClosed(event: SubstrateEvent<LoanCreatedClosedEvent>) {
  const [poolId, loanId] = event.event.data
  logger.info(`Loan closed event for pool: ${poolId.toString()} loanId: ${loanId.toString()}`)
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.close()
  await loan.save()
}
