import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { TokensEndowedDepositedWithdrawnEvent, TokensTransferEvent } from '../../helpers/types'
import { AccountService } from '../services/accountService'
import { CurrencyBalanceService } from '../services/currencyBalance'
import { CurrencyService } from '../services/currencyService'
import { InvestorTransactionService } from '../services/investorTransactionService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EvmAccountService } from '../services/evmAccountService'

export const handleTokenTransfer = errorHandler(_handleTokenTransfer)
async function _handleTokenTransfer(event: SubstrateEvent<TokensTransferEvent>): Promise<void> {
  const [currency, from, to, amount] = event.event.data

  // Skip tokent transfers from and to pool addresses
  const fromAddress = String.fromCharCode(...from.toU8a())
  const toAddress = String.fromCharCode(...to.toU8a())

  // TRANCHE TOKEN TRANSFERS
  if (currency.isTranche) {
    if (fromAddress.startsWith('pool') || toAddress.startsWith('pool')) return

    const [fromAccount, toAccount] = await Promise.all([
      AccountService.getOrInit(from.toHex(), EvmAccountService),
      AccountService.getOrInit(to.toHex(), EvmAccountService),
    ])

    const [poolId, trancheId] = currency.asTranche

    logger.info(
      `Tranche Token transfer tor tranche: ${poolId.toString()}-${trancheId.toString()}. ` +
        `from: ${from.toHex()} to: ${to.toHex()} amount: ${amount.toString()} ` +
        `at block ${event.block.block.header.number.toString()}`
    )

    // Get corresponding pool
    const pool = await PoolService.getById(poolId.toString())
    if (pool === undefined) throw new Error('Pool not found!')

    const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())
    if (tranche === undefined) throw new Error('Tranche not found!')

    // Update tranche price
    await tranche.updatePriceFromRpc(event.block.block.header.number.toNumber())
    await tranche.save()

    const orderData = {
      poolId: poolId.toString(),
      trancheId: trancheId.toString(),
      epochNumber: pool.currentEpoch,
      hash: event.extrinsic.extrinsic.hash.toString(),
      timestamp: event.block.timestamp,
      price: tranche.tokenPrice,
      amount: amount.toBigInt(),
    }

    // CREATE 2 TRANSFERS FOR FROM AND TO ADDRESS
    // with from create TRANSFER_OUT
    const txOut = InvestorTransactionService.transferOut({ ...orderData, address: fromAccount.id })
    await txOut.save()

    // with to create TRANSFER_IN
    const txIn = InvestorTransactionService.transferIn({ ...orderData, address: toAccount.id })
    await txIn.save()

    // CURRENCY TOKEN TRANSFER
  } else {
    const currencyTicker = currency.type
    const currencyId = currency.value.toString()
    const currencyService = await CurrencyService.getOrInit(currencyTicker, currencyId)
    logger.info(
      `Currency transfer ${currencyId} from: ${from.toHex()} to: ${to.toHex()} amount: ${amount.toString()} ` +
        `at block ${event.block.block.header.number.toString()}`
    )

    if (!fromAddress.startsWith('pool')) {
      const fromAccount = await AccountService.getOrInit(from.toHex(), EvmAccountService)
      const fromCurrencyBalance = await CurrencyBalanceService.getOrInit(fromAccount.id, currencyService.id)
      await fromCurrencyBalance.debit(amount.toBigInt())
      await fromCurrencyBalance.save()
    }

    if (!toAddress.startsWith('pool')) {
      const toAccount = await AccountService.getOrInit(to.toHex(), EvmAccountService)
      const toCurrencyBalance = await CurrencyBalanceService.getOrInit(toAccount.id, currencyService.id)
      await toCurrencyBalance.credit(amount.toBigInt())
      await toCurrencyBalance.save()
    }
  }
}

export const handleTokenEndowed = errorHandler(_handleTokenEndowed)
async function _handleTokenEndowed(event: SubstrateEvent<TokensEndowedDepositedWithdrawnEvent>): Promise<void> {
  const [currency, address, amount] = event.event.data
  if (currency.isTranche) return
  logger.info(
    `Currency endowment in ${currency.toString()} for: ${address.toHex()} amount: ${amount.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )
  const currencyTicker = currency.type
  const currencyId = currency.value.toString()
  const currencyService = await CurrencyService.getOrInit(currencyTicker, currencyId)
  const toAccount = await AccountService.getOrInit(address.toHex(), EvmAccountService)
  const toCurrencyBalance = await CurrencyBalanceService.getOrInit(toAccount.id, currencyService.id)
  await toCurrencyBalance.credit(amount.toBigInt())
  await toCurrencyBalance.save()
}

export const handleTokenDeposited = errorHandler(_handleTokenDeposited)
async function _handleTokenDeposited(event: SubstrateEvent<TokensEndowedDepositedWithdrawnEvent>): Promise<void> {
  const [currency, address, amount] = event.event.data
  if (currency.isTranche) return
  logger.info(
    `Currency deposit in ${currency.toString()} for: ${address.toHex()} amount: ${amount.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )
  const currencyTicker = currency.type
  const currencyId = currency.value.toString()
  const currencyService = await CurrencyService.getOrInit(currencyTicker, currencyId)
  const toAccount = await AccountService.getOrInit(address.toHex(), EvmAccountService)
  const toCurrencyBalance = await CurrencyBalanceService.getOrInit(toAccount.id, currencyService.id)
  await toCurrencyBalance.credit(amount.toBigInt())
  await toCurrencyBalance.save()
}

export const handleTokenWithdrawn = errorHandler(_handleTokenWithdrawn)
async function _handleTokenWithdrawn(event: SubstrateEvent<TokensEndowedDepositedWithdrawnEvent>): Promise<void> {
  const [currency, address, amount] = event.event.data
  if (currency.isTranche) return
  logger.info(
    `Currency withdrawal in ${currency.toString()} for: ${address.toHex()} amount: ${amount.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )
  const currencyTicker = currency.type
  const currencyId = currency.value.toString()
  const currencyService = await CurrencyService.getOrInit(currencyTicker, currencyId)
  const toAccount = await AccountService.getOrInit(address.toHex(), EvmAccountService)
  const toCurrencyBalance = await CurrencyBalanceService.getOrInit(toAccount.id, currencyService.id)
  await toCurrencyBalance.debit(amount.toBigInt())
  await toCurrencyBalance.save()
}
