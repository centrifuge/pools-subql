import { SubstrateEvent } from '@subql/types'
import {
  LoanBorrowedEvent,
  LoanClosedEvent,
  LoanCreatedEvent,
  LoanDebtTransferred,
  LoanDebtTransferred1024,
  LoanRepaidEvent,
  LoanWrittenOffEvent,
} from '../../helpers/types'
import { errorHandler, missingPool } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'
import { AssetService } from '../services/assetService'
import { AssetTransactionData, AssetTransactionService } from '../services/assetTransactionService'
import { AccountService } from '../services/accountService'
import { EpochService } from '../services/epochService'
import { AssetType, AssetValuationMethod } from '../../types'

export const handleLoanCreated = errorHandler(_handleLoanCreated)
async function _handleLoanCreated(event: SubstrateEvent<LoanCreatedEvent>) {
  const [poolId, loanId, loanInfo] = event.event.data
  logger.info(`Loan created event for pool: ${poolId.toString()} loan: ${loanId.toString()}`)

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const isInternal = loanInfo.pricing.isInternal
  const internalLoanPricing = isInternal ? loanInfo.pricing.asInternal : null

  const assetType: AssetType =
    isInternal && internalLoanPricing.valuationMethod.isCash ? AssetType.OffchainCash : AssetType.Other

  const valuationMethod: AssetValuationMethod = isInternal
    ? AssetValuationMethod[internalLoanPricing.valuationMethod.type]
    : AssetValuationMethod.Oracle

  const asset = await AssetService.init(
    poolId.toString(),
    loanId.toString(),
    assetType,
    valuationMethod, //TODO: valuationmethod
    loanInfo.collateral[0].toBigInt(),
    loanInfo.collateral[1].toBigInt(),
    event.block.timestamp
  )

  const assetSpecs = {
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

  await asset.updateAssetSpecs(assetSpecs)
  await asset.updateIpfsAssetName().catch((err) => {
    logger.error(`IPFS Request failed ${err}`)
    return Promise.resolve()
  })
  await asset.save()

  const at = await AssetTransactionService.created({
    poolId: poolId.toString(),
    assetId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
  })
  await at.save()

  // Update pool info
  await pool.increaseNumberOfAssets()
  await pool.save()
}

export const handleLoanBorrowed = errorHandler(_handleLoanBorrowed)
async function _handleLoanBorrowed(event: SubstrateEvent<LoanBorrowedEvent>): Promise<void> {
  const [poolId, loanId, borrowAmount] = event.event.data

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  const amount = AssetService.extractPrincipalAmount(borrowAmount)
  if (amount === BigInt(0)) return

  logger.info(`Loan borrowed event for pool: ${poolId.toString()} amount: ${amount.toString()}`)

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  // Update loan amount
  const asset = await AssetService.getById(poolId.toString(), loanId.toString())
  await asset.activate()
  await asset.borrow(amount)
  await asset.updateItemMetadata()
  await asset.updateIpfsAssetName().catch((err) => logger.error(`IPFS Request failed ${err}`))
  await asset.save()

  const at = await AssetTransactionService.borrowed({
    poolId: poolId.toString(),
    assetId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    amount: amount,
    principalAmount: amount,
    quantity: borrowAmount.isExternal ? borrowAmount.asExternal.quantity.toBigInt() : null,
    settlementPrice: borrowAmount.isExternal ? borrowAmount.asExternal.settlementPrice.toBigInt() : null,
  })
  await at.save()

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

  const principalAmount = AssetService.extractPrincipalAmount(principal)
  const amount = principalAmount + interest.toBigInt() + unscheduled.toBigInt()

  if (amount === BigInt(0)) return

  logger.info(`Loan repaid event for pool: ${poolId.toString()} amount: ${amount.toString()}`)

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const asset = await AssetService.getById(poolId.toString(), loanId.toString())
  await asset.repay(amount)
  await asset.updateItemMetadata()
  await asset.save()

  const at = await AssetTransactionService.repaid({
    poolId: poolId.toString(),
    assetId: loanId.toString(),
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
  await at.save()

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
  const loan = await AssetService.getById(poolId.toString(), loanId.toString())
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

  const loan = await AssetService.getById(poolId.toString(), loanId.toString())
  await loan.close()
  await loan.updateItemMetadata()
  await loan.save()

  const at = await AssetTransactionService.closed({
    poolId: poolId.toString(),
    assetId: loanId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
  })
  await at.save()
}

export const handleLoanDebtTransferred = errorHandler(_handleLoanDebtTransferred)
async function _handleLoanDebtTransferred(event: SubstrateEvent<LoanDebtTransferred>) {
  const [poolId, fromLoanId, toLoanId, _repaidAmount, _borrowAmount] = event.event.data
  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  const repaidPrincipalAmount = AssetService.extractPrincipalAmount(_repaidAmount.principal)
  const repaidInterestAmount = _repaidAmount.interest.toBigInt()
  const repaidUnscheduledAmount = _repaidAmount.unscheduled.toBigInt()
  const repaidAmount = repaidPrincipalAmount + repaidInterestAmount + repaidUnscheduledAmount

  const borrowPrincipalAmount = AssetService.extractPrincipalAmount(_borrowAmount)

  if (repaidAmount === BigInt(0) || borrowPrincipalAmount === BigInt(0)) return

  logger.info(
    `Asset debt transferred event for pool: ${poolId.toString()}, from loan: ${fromLoanId.toString()} ` +
      `to loan: ${toLoanId.toString()} amount: ${repaidAmount.toString()}`
  )

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const fromAsset = await AssetService.getById(poolId.toString(), fromLoanId.toString())
  await fromAsset.repay(repaidAmount)
  await fromAsset.updateItemMetadata()
  await fromAsset.save()

  const toAsset = await AssetService.getById(poolId.toString(), toLoanId.toString())
  await toAsset.borrow(borrowPrincipalAmount)
  await toAsset.updateItemMetadata()
  await toAsset.save()

  const txData: Omit<
    AssetTransactionData,
    'assetId' | 'amount' | 'interestAmount' | 'principalAmount' | 'unscheduledAmount'
  > = {
    poolId: poolId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
  }

  const repaidAt = await AssetTransactionService.repaid({
    ...txData,
    assetId: fromLoanId.toString(),
    amount: repaidAmount,
    interestAmount: repaidAmount,
    principalAmount: repaidPrincipalAmount,
    unscheduledAmount: repaidUnscheduledAmount,
    quantity: _repaidAmount.principal.isExternal ? _repaidAmount.principal.asExternal.quantity.toBigInt() : null,
    settlementPrice: _repaidAmount.principal.isExternal
      ? _repaidAmount.principal.asExternal.settlementPrice.toBigInt()
      : null,
    fromAsset: fromLoanId.toString(),
    toAsset: toLoanId.toString(),
  })
  await repaidAt.save()

  const borrowedAt = await AssetTransactionService.borrowed({
    ...txData,
    assetId: toLoanId.toString(),
    amount: borrowPrincipalAmount,
    principalAmount: borrowPrincipalAmount,
    quantity: _borrowAmount.isExternal ? _borrowAmount.asExternal.quantity.toBigInt() : null,
    settlementPrice: _borrowAmount.isExternal ? _borrowAmount.asExternal.settlementPrice.toBigInt() : null,
    fromAsset: fromLoanId.toString(),
    toAsset: toLoanId.toString(),
  })
  await borrowedAt.save()
}

export const handleLoanDebtTransferred1024 = errorHandler(_handleLoanDebtTransferred1024)
async function _handleLoanDebtTransferred1024(event: SubstrateEvent<LoanDebtTransferred1024>) {
  const [poolId, fromLoanId, toLoanId, amount] = event.event.data

  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  if (amount.toBigInt() === BigInt(0)) return

  logger.info(
    `Asset debt transferred (deprecated) event for pool: ${poolId.toString()}, from loan: ${fromLoanId.toString()} ` +
      `to loan: ${toLoanId.toString()} amount: ${amount.toString()}`
  )

  const account = await AccountService.getOrInit(event.extrinsic.extrinsic.signer.toHex())

  const fromAsset = await AssetService.getById(poolId.toString(), fromLoanId.toString())
  await fromAsset.repay(amount.toBigInt())
  await fromAsset.updateItemMetadata()
  await fromAsset.save()

  const toAsset = await AssetService.getById(poolId.toString(), toLoanId.toString())
  await toAsset.repay(amount.toBigInt())
  await toAsset.updateItemMetadata()
  await toAsset.save()

  const txData: Omit<AssetTransactionData, 'assetId'> = {
    poolId: poolId.toString(),
    address: account.id,
    epochNumber: pool.currentEpoch,
    hash: event.extrinsic.extrinsic.hash.toString(),
    timestamp: event.block.timestamp,
    amount: amount.toBigInt(),
  }

  const repaidAt = await AssetTransactionService.repaid({ ...txData, assetId: fromLoanId.toString() })
  await repaidAt.save()

  const borrowedAt = await AssetTransactionService.borrowed({ ...txData, assetId: toLoanId.toString() })
  await borrowedAt.save()
}
