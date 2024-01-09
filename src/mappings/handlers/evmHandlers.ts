import { createTrancheTrackerDatasource } from '../../types'
import { errorHandler } from '../../helpers/errorHandler'
import { DeployTrancheLog } from '../../types/abi-interfaces/PoolManagerAbi'
import { TransferLog } from '../../types/abi-interfaces/Erc20Abi'
import { AccountService } from '../services/accountService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { InvestorTransactionData, InvestorTransactionService } from '../services/investorTransactionService'
import { CurrencyService } from '../services/currencyService'
import { BlockchainService } from '../services/blockchainService'
import { CurrencyBalanceService } from '../services/currencyBalanceService'
import { PoolManagerAbi__factory } from '../../types/contracts'

export const handleEvmDeployTranche = errorHandler(_handleEvmDeployTranche)
async function _handleEvmDeployTranche(event: DeployTrancheLog): Promise<void> {
  const [_poolId, _trancheId, tokenAddress] = event.args

  const chainId = parseInt(event.transaction.chainId, 16).toString(10)
  const blockchain = await BlockchainService.getOrInit(chainId)

  const poolId = _poolId.toString()
  const trancheId = _trancheId.substring(0, 34)

  logger.info(
    `Adding DynamicSource for tranche ${poolId}-${trancheId} token: ${tokenAddress} block: ${event.blockNumber}`
  )

  const pool = await PoolService.getOrSeed(poolId)
  const tranche = await TrancheService.getOrSeed(pool.id, trancheId)

  const currency = await CurrencyService.getOrInitEvm(blockchain.id, tokenAddress)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const poolManager = PoolManagerAbi__factory.connect(event.address, api as any)
  const escrowAddress = await poolManager.escrow()
  await currency.initEvmDetails(tokenAddress, escrowAddress, tranche.poolId, tranche.trancheId)
  await currency.save()

  await createTrancheTrackerDatasource({ address: tokenAddress })
}

const nullAddress = '0x0000000000000000000000000000000000000000'

export const handleEvmTransfer = errorHandler(_handleEvmTransfer)
async function _handleEvmTransfer(event: TransferLog): Promise<void> {
  const [fromEvmAddress, toEvmAddress, amount] = event.args
  logger.info(`Transfer ${fromEvmAddress}-${toEvmAddress} of ${amount.toString()} at block: ${event.blockNumber}`)

  const evmTokenAddress = event.address
  const chainId = parseInt(event.transaction.chainId, 16).toString(10)
  const blockchain = await BlockchainService.getOrInit(chainId)
  const evmToken = await CurrencyService.getOrInitEvm(blockchain.id, evmTokenAddress)
  const escrowAddress = evmToken.escrowAddress

  const orderData: Omit<InvestorTransactionData, 'address'> = {
    poolId: evmToken.poolId,
    trancheId: evmToken.trancheId,
    //epochNumber: pool.currentEpoch,
    hash: event.transactionHash,
    timestamp: new Date(Number(event.block.timestamp) * 1000),
    //price: tranche.tokenPrice,
    amount: amount.toBigInt(),
  }

  if (fromEvmAddress !== evmTokenAddress && fromEvmAddress !== escrowAddress && fromEvmAddress !== nullAddress) {
    const fromAddress = AccountService.evmToSubstrate(fromEvmAddress, blockchain.id)
    const fromAccount = await AccountService.getOrInit(fromAddress)

    const txOut = InvestorTransactionService.transferOut({ ...orderData, address: fromAccount.id })
    await txOut.save()

    const fromBalance = await CurrencyBalanceService.getOrInitEvm(fromAddress, evmToken.id)
    await fromBalance.debit(amount.toBigInt())
    await fromBalance.save()
  }

  if (toEvmAddress !== evmTokenAddress && toEvmAddress !== escrowAddress && toEvmAddress !== nullAddress) {
    const toAddress = AccountService.evmToSubstrate(toEvmAddress, blockchain.id)
    const toAccount = await AccountService.getOrInit(toAddress)
    const txIn = InvestorTransactionService.transferIn({ ...orderData, address: toAccount.id })
    await txIn.save()

    const toBalance = await CurrencyBalanceService.getOrInitEvm(toAddress, blockchain.id)
    await toBalance.credit(amount.toBigInt())
    await toBalance.save()
  }
}
