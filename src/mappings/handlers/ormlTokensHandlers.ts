import { SubstrateEvent } from '@subql/types'
import { errorHandler, missingPool } from '../../helpers/errorHandler'
import { TokensEndowedDepositedWithdrawnEvent, TokensTransferEvent } from '../../helpers/types'
import { AccountService } from '../services/accountService'
import { CurrencyBalanceService } from '../services/currencyBalanceService'
import { CurrencyService, currencyFormatters } from '../services/currencyService'
import { InvestorTransactionService } from '../services/investorTransactionService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { BlockchainService, LOCAL_CHAIN_ID } from '../services/blockchainService'
import { InvestorPositionService } from '../services/investorPositionService'

export const handleTokenTransfer = errorHandler(_handleTokenTransfer)
async function _handleTokenTransfer(event: SubstrateEvent<TokensTransferEvent>): Promise<void> {
  const [_currency, from, to, amount] = event.event.data
  const timestamp = event.block.timestamp
  if (!timestamp) throw new Error('Timestamp missing from block')

  // Skip token transfers from and to excluded addresses
  const fromAddress = String.fromCharCode(...from.toU8a())
  const toAddress = String.fromCharCode(...to.toU8a())
  const isFromExcludedAddress =
    fromAddress.startsWith('pool') || fromAddress.startsWith('invs') || fromAddress.startsWith('domn')
  const isToExcludedAddress =
    toAddress.startsWith('pool') || toAddress.startsWith('invs') || toAddress.startsWith('domn')

  const [fromAccount, toAccount] = await Promise.all([
    AccountService.getOrInit(from.toHex()),
    AccountService.getOrInit(to.toHex()),
  ])

  const blockchain = await BlockchainService.getOrInit(LOCAL_CHAIN_ID)
  const currency = await CurrencyService.getOrInit(
    blockchain.id,
    _currency.type,
    ...currencyFormatters[_currency.type](_currency.value)
  )

  // TRANCHE TOKEN TRANSFERS BETWEEN INVESTORS
  if (_currency.isTranche && !isFromExcludedAddress && !isToExcludedAddress) {
    const poolId = Array.isArray(_currency.asTranche) ? _currency.asTranche[0] : _currency.asTranche.poolId
    const trancheId = Array.isArray(_currency.asTranche) ? _currency.asTranche[1] : _currency.asTranche.trancheId
    const pool = await PoolService.getById(poolId.toString())
    if (!pool) throw missingPool
    const tranche = await TrancheService.getById(pool.id, trancheId.toString())
    if (!tranche) throw Error('Tranche not found!')
    logger.info(
      `Tranche Token transfer between investors tor tranche: ${pool.id}-${tranche.trancheId}. ` +
        `from: ${from.toHex()} to: ${to.toHex()} amount: ${amount.toString()} ` +
        `at block ${event.block.block.header.number.toString()}`
    )

    // Update tranche price
    await tranche.updatePriceFromRuntime(event.block.block.header.number.toNumber())
    await tranche.save()
    if (!event.extrinsic) throw new Error('Missing extrinsic in event')
    const orderData = {
      poolId: pool.id,
      trancheId: tranche.trancheId,
      epochNumber: pool.currentEpoch,
      hash: event.extrinsic.extrinsic.hash.toString(),
      timestamp: timestamp,
      price: tranche.tokenPrice,
      amount: amount.toBigInt(),
    }

    // CREATE 2 TRANSFERS FOR FROM AND TO ADDRESS
    // with from create TRANSFER_OUT
    const txOut = InvestorTransactionService.transferOut({ ...orderData, address: fromAccount.id })
    const profit = await InvestorPositionService.sellFifo(
      txOut.accountId,
      txOut.trancheId,
      txOut.tokenAmount!,
      txOut.tokenPrice!
    )
    await txOut.setRealizedProfitFifo(profit)
    await txOut.save()

    // with to create TRANSFER_IN
    const txIn = InvestorTransactionService.transferIn({ ...orderData, address: toAccount.id })
    await InvestorPositionService.buy(
      txIn.accountId,
      txIn.trancheId,
      txIn.hash,
      txIn.timestamp,
      txIn.tokenAmount!,
      txIn.tokenPrice!
    )
    await txIn.save()
  }

  // TRACK CURRENCY TOKEN TRANSFER
  logger.info(
    `Currency transfer ${currency.id} from: ${fromAccount.id} to: ${toAccount.id} amount: ${amount.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )

  if (!isFromExcludedAddress) {
    const fromCurrencyBalance = await CurrencyBalanceService.getOrInit(fromAccount.id, currency.id)
    await fromCurrencyBalance.debit(amount.toBigInt())
    await fromCurrencyBalance.save()
  }

  if (!isToExcludedAddress) {
    const toCurrencyBalance = await CurrencyBalanceService.getOrInit(toAccount.id, currency.id)
    await toCurrencyBalance.credit(amount.toBigInt())
    await toCurrencyBalance.save()
  }
}

export const handleTokenDeposited = errorHandler(_handleTokenDeposited)
async function _handleTokenDeposited(event: SubstrateEvent<TokensEndowedDepositedWithdrawnEvent>): Promise<void> {
  const [_currency, address, amount] = event.event.data
  if (_currency.isTranche) return
  logger.info(
    `Currency deposit in ${_currency.toString()} for: ${address.toHex()} amount: ${amount.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )
  const toAccount = await AccountService.getOrInit(address.toHex())
  const blockchain = await BlockchainService.getOrInit(LOCAL_CHAIN_ID)
  const currency = await CurrencyService.getOrInit(
    blockchain.id,
    _currency.type,
    ...currencyFormatters[_currency.type](_currency.value)
  )

  const toCurrencyBalance = await CurrencyBalanceService.getOrInit(toAccount.id, currency.id)
  await toCurrencyBalance.credit(amount.toBigInt())
  await toCurrencyBalance.save()
}

export const handleTokenWithdrawn = errorHandler(_handleTokenWithdrawn)
async function _handleTokenWithdrawn(event: SubstrateEvent<TokensEndowedDepositedWithdrawnEvent>): Promise<void> {
  const [_currency, address, amount] = event.event.data
  if (_currency.isTranche) return
  logger.info(
    `Currency withdrawal in ${_currency.toString()} for: ${address.toHex()} amount: ${amount.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )
  const blockchain = await BlockchainService.getOrInit(LOCAL_CHAIN_ID)
  const toAccount = await AccountService.getOrInit(address.toHex())
  const currency = await CurrencyService.getOrInit(
    blockchain.id,
    _currency.type,
    ...currencyFormatters[_currency.type](_currency.value)
  )

  const toCurrencyBalance = await CurrencyBalanceService.getOrInit(toAccount.id, currency.id)
  await toCurrencyBalance.debit(amount.toBigInt())
  await toCurrencyBalance.save()
}
