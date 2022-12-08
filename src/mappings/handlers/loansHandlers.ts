import { SubstrateEvent } from '@subql/types'
import {
  LoanBorrowedRepaidEvent,
  LoanCreatedClosedEvent,
  LoanPricedEvent,
  LoanWrittenOffEvent,
  LoanSpecs,
} from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'
import { LoanService } from '../services/loanService'
import { BorrowerTransactionService } from '../services/borrowerTransactionService'
import { AccountService } from '../services/accountService'

export const handleLoanCreated = errorHandler(_handleLoanCreated)
async function _handleLoanCreated(event: SubstrateEvent<LoanCreatedClosedEvent>) {
  const [poolId, loanId, [nftClassId, nftItemId]] = event.event.data
  logger.info(`Loan created event for pool: ${poolId.toString()} loan: ${loanId.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toString())

  const loan = await LoanService.init(
    poolId.toString(),
    loanId.toString(),
    nftClassId.toBigInt(),
    nftItemId.toBigInt(),
    event.block.timestamp
  )
  await loan.updateItemMetadata()
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
}

export const handleLoanBorrowed = errorHandler(_handleLoanBorrowed)
async function _handleLoanBorrowed(event: SubstrateEvent<LoanBorrowedRepaidEvent>): Promise<void> {
  const [poolId, loanId, amount] = event.event.data
  logger.info(`Loan borrowed event for pool: ${poolId.toString()} amount: ${amount.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toString())

  // Update loan amount
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.borrow(amount.toBigInt())
  await loan.updateItemMetadata()
  await loan.save()

  const bt = await BorrowerTransactionService.borrowed({
    poolId: poolId.toString(),
    loanId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    amount: amount.toBigInt(),
  })
  await bt.save()

  // Update poolState info
  await pool.increaseBorrowings(amount.toBigInt())
  await pool.save()
}

export const handleLoanPriced = errorHandler(_handleLoanPriced)
async function _handleLoanPriced(event: SubstrateEvent<LoanPricedEvent>) {
  const [poolId, loanId, interestRatePerSec, loanType] = event.event.data
  logger.info(`Loan priced event for pool: ${poolId.toString()} loan: ${loanId.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toString())

  const loanSpecs = loanType.inner as LoanSpecs
  const decodedLoanSpecs = {
    advanceRate: loanSpecs.advanceRate.toBigInt(),
    value: loanSpecs.value.toBigInt(),
    probabilityOfDefault: loanSpecs.probabilityOfDefault ? loanSpecs.probabilityOfDefault.toBigInt() : null,
    lossGivenDefault: loanSpecs.lossGivenDefault ? loanSpecs.lossGivenDefault.toBigInt() : null,
    discountRate: loanSpecs.discountRate ? loanSpecs.discountRate.toBigInt() : null,
    maturityDate: loanSpecs.maturityDate ? new Date(loanSpecs.maturityDate.toNumber() * 1000) : null,
  }
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.activate()
  await loan.updateInterestRate(interestRatePerSec.toBigInt())
  await loan.updateLoanType(loanType.type, loanType.inner.toJSON())
  await loan.updateLoanSpecs(decodedLoanSpecs)
  await loan.updateItemMetadata()
  await loan.save()

  const bt = await BorrowerTransactionService.priced({
    poolId: poolId.toString(),
    loanId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
  })
  await bt.save()
}

export const handleLoanRepaid = errorHandler(_handleLoanRepaid)
async function _handleLoanRepaid(event: SubstrateEvent<LoanBorrowedRepaidEvent>) {
  const [poolId, loanId, amount] = event.event.data
  logger.info(`Loan borrowed event for pool: ${poolId.toString()} amount: ${amount.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toString())

  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  await loan.repay(amount.toBigInt())
  await loan.updateItemMetadata()
  await loan.save()

  const bt = await BorrowerTransactionService.repaid({
    poolId: poolId.toString(),
    loanId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    amount: amount.toBigInt(),
  })
  await bt.save()
}

export const handleLoanWrittenOff = errorHandler(_handleLoanWrittenOff)
async function _handleLoanWrittenOff(event: SubstrateEvent<LoanWrittenOffEvent>) {
  const [poolId, loanId, percentage, penaltyInterestRatePerSec, writeOffGroupIndex] = event.event.data
  logger.info(`Loan writtenoff event for pool: ${poolId.toString()} loanId: ${loanId.toString()}`)
  const loan = await LoanService.getById(poolId.toString(), loanId.toString())
  const writeOffIndex = writeOffGroupIndex.isSome ? writeOffGroupIndex.unwrap().toNumber() : null
  await loan.writeOff(percentage.toBigInt(), penaltyInterestRatePerSec.toBigInt(), writeOffIndex)
  await loan.updateItemMetadata()
  await loan.save()

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  await pool.increaseWriteOff(loan.writtenOffAmount_R)
  await pool.save()
}

export const handleLoanClosed = errorHandler(_handleLoanClosed)
async function _handleLoanClosed(event: SubstrateEvent<LoanCreatedClosedEvent>) {
  const [poolId, loanId] = event.event.data
  logger.info(`Loan closed event for pool: ${poolId.toString()} loanId: ${loanId.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw new Error('Pool not found!')

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toString())

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
