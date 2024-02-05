import { SubstrateEvent } from '@subql/types'
import { nToBigInt } from '@polkadot/util'
import {
  LoanBorrowedEvent,
  LoanClosedEvent,
  LoanCreatedEvent,
  LoanDebtTransferred,
  LoanRepaidEvent,
  LoanWrittenOffEvent,
} from '../../helpers/types'
import { errorHandler, missingPool } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'
import { LoanService } from '../services/loanService'
import { BorrowerTransactionData, BorrowerTransactionService } from '../services/borrowerTransactionService'
import { AccountService } from '../services/accountService'
import { EpochService } from '../services/epochService'
import { WAD } from '../../config'

export const handleLoanCreated = errorHandler(_handleLoanCreated)
async function _handleLoanCreated(event: SubstrateEvent<LoanCreatedEvent>) {
  const [poolId, loanId, loanInfo] = event.event.data
  logger.info(`Loan created event for pool: ${poolId.toString()} loan: ${loanId.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const loan = await LoanService.init(
    poolId.toString(),
    loanId.toString(),
    loanInfo.collateral[0].toBigInt(),
    loanInfo.collateral[1].toBigInt(),
    event.block.timestamp
  )

  const internalLoanPricing = loanInfo.pricing?.isInternal ? loanInfo.pricing.asInternal : null

  const loanSpecs = {
    advanceRate:
      internalLoanPricing && internalLoanPricing.maxBorrowAmount.isUpToOutstandingDebt
        ? internalLoanPricing.maxBorrowAmount.asUpToOutstandingDebt.advanceRate.toBigInt()
        : null,
    collateralValue: internalLoanPricing ? internalLoanPricing.collateralValue.toBigInt() : null,
    probabilityOfDefault:
      internalLoanPricing && internalLoanPricing.valuationMethod.isDiscountedCashFlow
        ? internalLoanPricing.valuationMethod.asDiscountedCashFlow.probabilityOfDefault.toBigInt()
        : null,
    lossGivenDefault:
      internalLoanPricing && internalLoanPricing.valuationMethod.isDiscountedCashFlow
        ? internalLoanPricing.valuationMethod.asDiscountedCashFlow.lossGivenDefault.toBigInt()
        : null,
    discountRate:
      internalLoanPricing?.valuationMethod.isDiscountedCashFlow &&
      internalLoanPricing.valuationMethod.asDiscountedCashFlow.discountRate.isFixed
        ? internalLoanPricing.valuationMethod.asDiscountedCashFlow.discountRate.asFixed.ratePerYear.toBigInt()
        : null,
    maturityDate: loanInfo.schedule.maturity.isFixed
      ? new Date(loanInfo.schedule.maturity.asFixed.date.toNumber() * 1000)
      : null,
  }

  await loan.updateLoanSpecs(loanSpecs)
  await loan.save()

  const bt = await BorrowerTransactionService.created({
    poolId: poolId.toString(),
    loanId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
  })
  await bt.save()

  // Update pool info
  await pool.increaseNumberOfLoans()
  await pool.save()
}

export const handleLoanBorrowed = errorHandler(_handleLoanBorrowed)
async function _handleLoanBorrowed(event: SubstrateEvent<LoanBorrowedEvent>): Promise<void> {
  const [poolId, loanId, borrowAmount] = event.event.data

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  const amount = borrowAmount.isInternal
    ? borrowAmount.asInternal.toBigInt()
    : nToBigInt(borrowAmount.asExternal.quantity.toBn().mul(borrowAmount.asExternal.settlementPrice.toBn()).div(WAD))

  if (amount === BigInt(0)) return

  logger.info(`Loan borrowed event for pool: ${poolId.toString()} amount: ${amount.toString()}`)

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  // Update loan amount
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.activate()
  await loan.borrow(amount)
  await loan.updateItemMetadata()
  await loan.save()

  const bt = await BorrowerTransactionService.borrowed({
    poolId: poolId.toString(),
    loanId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    amount: amount,
    principalAmount: amount,
    quantity: borrowAmount.isExternal ? borrowAmount.asExternal.quantity.toBigInt() : null,
    settlementPrice: borrowAmount.isExternal ? borrowAmount.asExternal.settlementPrice.toBigInt() : null,
  })
  await bt.save()

  // Update pool info
  await pool.increaseBorrowings(amount)
  await pool.save()

  // Update epoch info
  const epoch = await EpochService.getById(pool.id, pool.currentEpoch)
  if (epoch === undefined) throw new Error('Epoch not found!')
  await epoch.increaseBorrowings(BigInt(amount))
  await epoch.save()
}

export const handleLoanRepaid = errorHandler(_handleLoanRepaid)
async function _handleLoanRepaid(event: SubstrateEvent<LoanRepaidEvent>) {
  const [poolId, loanId, { principal, interest, unscheduled }] = event.event.data

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  const principalAmount = principal.isInternal
    ? principal.asInternal.toBigInt()
    : nToBigInt(principal.asExternal.quantity.toBn().mul(principal.asExternal.settlementPrice.toBn()).div(WAD))
  const amount = principalAmount + interest.toBigInt() + unscheduled.toBigInt()

  if (amount === BigInt(0)) return

  logger.info(`Loan repaid event for pool: ${poolId.toString()} amount: ${amount.toString()}`)

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.repay(amount)
  await loan.updateItemMetadata()
  await loan.save()

  const bt = await BorrowerTransactionService.repaid({
    poolId: poolId.toString(),
    loanId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    amount: amount,
    principalAmount: principalAmount,
    interestAmount: interest.toBigInt(),
    unscheduledAmount: unscheduled.toBigInt(),
    quantity: principal.isExternal ? principal.asExternal.quantity.toBigInt() : null,
    settlementPrice: principal.isExternal ? principal.asExternal.settlementPrice.toBigInt() : null,
  })
  await bt.save()

  // Update pool info
  await pool.increaseRepayments(principalAmount, interest.toBigInt(), unscheduled.toBigInt())
  await pool.save()

  // Update epoch info
  const epoch = await EpochService.getById(pool.id, pool.currentEpoch)
  if (!epoch) throw new Error('Epoch not found!')
  await epoch.increaseRepayments(amount)
  await epoch.save()
}

export const handleLoanWrittenOff = errorHandler(_handleLoanWrittenOff)
async function _handleLoanWrittenOff(event: SubstrateEvent<LoanWrittenOffEvent>) {
  const [poolId, loanId, status] = event.event.data
  logger.info(`Loan writtenoff event for pool: ${poolId.toString()} loanId: ${loanId.toString()}`)
  const { percentage, penalty } = status
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.writeOff(percentage.toBigInt(), penalty.toBigInt())
  await loan.updateItemMetadata()
  await loan.save()

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool

  await pool.increaseWriteOff(loan.writtenOffAmountByPeriod)
  await pool.save()
}

export const handleLoanClosed = errorHandler(_handleLoanClosed)
async function _handleLoanClosed(event: SubstrateEvent<LoanClosedEvent>) {
  const [poolId, loanId] = event.event.data
  logger.info(`Loan closed event for pool: ${poolId.toString()} loanId: ${loanId.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.close()
  await loan.updateItemMetadata()
  await loan.save()

  const bt = await BorrowerTransactionService.closed({
    poolId: poolId.toString(),
    loanId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
  })
  await bt.save()
}

export const handleLoanDebtTransferred = errorHandler(_handleLoanDebtTransferred)
async function _handleLoanDebtTransferred(event: SubstrateEvent<LoanDebtTransferred>) {
  const [poolId, fromLoanId, toLoanId, amount] = event.event.data

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  if (amount.toBigInt() === BigInt(0)) return

  logger.info(
    `Loan debt transferred event for pool: ${poolId.toString()}, from loan: ${fromLoanId.toString()} ` +
      `to loan: ${toLoanId.toString()} amount: ${amount.toString()}`
  )

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const fromLoan = await LoanService.getById(poolId.toString(), fromLoanId.toString())
  await fromLoan.repay(amount.toBigInt())
  await fromLoan.updateItemMetadata()
  await fromLoan.save()

  const toLoan = await LoanService.getById(poolId.toString(), toLoanId.toString())
  await toLoan.repay(amount.toBigInt())
  await toLoan.updateItemMetadata()
  await toLoan.save()

  const txData: Omit<BorrowerTransactionData, 'loanId'> = {
    poolId: poolId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    amount: amount.toBigInt(),
  }

  const repaidBt = await BorrowerTransactionService.repaid({ ...txData, loanId: fromLoanId.toString() })
  await repaidBt.save()

  const borrowedBt = await BorrowerTransactionService.borrowed({ ...txData, loanId: toLoanId.toString() })
  await borrowedBt.save()
}
