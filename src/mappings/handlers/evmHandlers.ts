import { Loan, LoanStatus, createTrancheTrackerDatasource } from '../../types'
import { EthereumBlock } from '@subql/types-ethereum'
import { DAIMainnetAddress, tinlakePools } from '../../config'
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
import {
  InvestmentManagerAbi__factory,
  PoolManagerAbi__factory,
  ShelfAbi__factory,
  NavfeedAbi__factory,
  ReserveAbi__factory,
  PileAbi__factory,
} from '../../types/contracts'
import { Provider } from '@ethersproject/providers'
import { TrancheBalanceService } from '../services/trancheBalanceService'
import { TimekeeperService, getPeriodStart } from '../../helpers/timekeeperService'
import { LoanService } from '../services/loanService'
import { stateSnapshotter } from '../../helpers/stateSnapshot'

const ethApi = api as unknown as Provider
//const networkPromise = typeof ethApi.getNetwork === 'function' ? ethApi.getNetwork() : null

const timekeeper = TimekeeperService.init()

export const handleEvmBlock = errorHandler(_handleEvmBlock)
async function _handleEvmBlock(block: EthereumBlock): Promise<void> {
  const date = new Date(Number(block.timestamp) * 1000)
  const blockNumber = block.number
  const newPeriod = (await timekeeper).processBlock(date)
  const blockPeriodStart = getPeriodStart(date)

  const blockchain = await BlockchainService.getOrInit('1')
  const currency = await CurrencyService.getOrInitEvm(blockchain.id, DAIMainnetAddress)

  if (newPeriod) {
    logger.info(`It's a new period on EVM block ${blockNumber}: ${date.toISOString()}`)

    // update pool states
    for (const tinlakePool of tinlakePools) {
      let pool
      if (block.number >= tinlakePool.startBlock) {
        pool = await PoolService.getOrSeed(tinlakePool.id)
        if (block.number >= tinlakePool.startBlock && pool.totalReserve == null) {
          pool.totalReserve = BigInt(0)
          pool.portfolioValuation = BigInt(0)
          pool.currency
          pool.isActive = false
          pool.currencyId = currency.id
          await pool.save()
          logger.info(`Initializing pool ${tinlakePool.id}`)
        }
        const latestNavFeed = getLatestContract(tinlakePool.navFeed, blockNumber)
        if (latestNavFeed) {
          const navFeedContract = NavfeedAbi__factory.connect(latestNavFeed.address, api as unknown as Provider)
          pool.portfolioValuation = (await navFeedContract.currentNAV()).toBigInt()
          await pool.save()
          logger.info(`Updating pool ${tinlakePool.id} with portfolioValuation: ${pool.portfolioValuation}`)
        }
        const latestReserve = getLatestContract(tinlakePool.reserve, blockNumber)
        if (latestReserve) {
          const reserveContract = ReserveAbi__factory.connect(latestReserve.address, ethApi)
          pool.totalReserve = (await reserveContract.totalBalance()).toBigInt()
          await pool.save()
          logger.info(`Updating pool ${tinlakePool.id} with totalReserve: ${pool.totalReserve}`)
        }
        // Update loans
        if (latestNavFeed) {
          updateLoans(
            tinlakePool.id,
            date,
            tinlakePool.shelf[0].address,
            tinlakePool.pile[0].address,
            latestNavFeed.address
          )
        }
      }
    }

    // Take snapshots
    await stateSnapshotter('Pool', 'PoolSnapshot', { number: block.number, timestamp: date }, 'poolId')
    await stateSnapshotter(
      'Loan',
      'LoanSnapshot',
      { number: block.number, timestamp: date },
      'loanId',
      'isActive',
      true
    )

    //Update tracking of period and continue
    await (await timekeeper).update(blockPeriodStart)
  }
}

export const handleEvmDeployTranche = errorHandler(_handleEvmDeployTranche)
async function _handleEvmDeployTranche(event: DeployTrancheLog): Promise<void> {
  const [_poolId, _trancheId, tokenAddress] = event.args

  const chainId = await getNodeChainId() //(await networkPromise).chainId.toString(10)
  const blockchain = await BlockchainService.getOrInit(chainId)

  const poolId = _poolId.toString()
  const trancheId = _trancheId.substring(0, 34)

  logger.info(
    `Adding DynamicSource for tranche ${poolId}-${trancheId} token: ${tokenAddress} block: ${event.blockNumber}`
  )

  const pool = await PoolService.getOrSeed(poolId)
  const tranche = await TrancheService.getOrSeed(pool.id, trancheId)

  const currency = await CurrencyService.getOrInitEvm(blockchain.id, tokenAddress)
  const poolManager = PoolManagerAbi__factory.connect(event.address, ethApi)
  const escrowAddress = await poolManager.escrow()

  const investmentManagerAddress = await poolManager.investmentManager()
  const investmentManager = InvestmentManagerAbi__factory.connect(investmentManagerAddress, ethApi)
  const userEscrowAddress = await investmentManager.userEscrow()

  await currency.initTrancheDetails(tranche.poolId, tranche.trancheId, tokenAddress, escrowAddress, userEscrowAddress)
  await currency.save()

  await createTrancheTrackerDatasource({ address: tokenAddress })
}
const nullAddress = '0x0000000000000000000000000000000000000000'

export const handleEvmTransfer = errorHandler(_handleEvmTransfer)
async function _handleEvmTransfer(event: TransferLog): Promise<void> {
  const [fromEvmAddress, toEvmAddress, amount] = event.args
  logger.info(`Transfer ${fromEvmAddress}-${toEvmAddress} of ${amount.toString()} at block: ${event.blockNumber}`)

  const evmTokenAddress = event.address
  const chainId = await getNodeChainId() //(await networkPromise).chainId.toString(10)
  const blockchain = await BlockchainService.getOrInit(chainId)
  const evmToken = await CurrencyService.getOrInitEvm(blockchain.id, evmTokenAddress)
  const { escrowAddress, userEscrowAddress } = evmToken
  const serviceAddresses = [evmTokenAddress, escrowAddress, userEscrowAddress, nullAddress]

  const isFromUserAddress = !serviceAddresses.includes(fromEvmAddress)
  const isToUserAddress = !serviceAddresses.includes(toEvmAddress)
  const isFromEscrow = fromEvmAddress === escrowAddress
  const _isFromUserEscrow = fromEvmAddress === userEscrowAddress

  const orderData: Omit<InvestorTransactionData, 'address'> = {
    poolId: evmToken.poolId,
    trancheId: evmToken.trancheId.split('-')[1],
    //epochNumber: pool.currentEpoch,
    hash: event.transactionHash,
    timestamp: new Date(Number(event.block.timestamp) * 1000),
    //price: tranche.tokenPrice,
    amount: amount.toBigInt(),
  }

  let fromAddress: string = null,
    fromAccount: AccountService = null
  if (isFromUserAddress) {
    fromAddress = AccountService.evmToSubstrate(fromEvmAddress, blockchain.id)
    fromAccount = await AccountService.getOrInit(fromAddress)
  }

  let toAddress: string = null,
    toAccount: AccountService = null
  if (isToUserAddress) {
    toAddress = AccountService.evmToSubstrate(toEvmAddress, blockchain.id)
    toAccount = await AccountService.getOrInit(toAddress)
  }

  // Handle Currency Balance Updates
  if (isToUserAddress) {
    const toBalance = await CurrencyBalanceService.getOrInit(toAddress, evmToken.id)
    await toBalance.credit(amount.toBigInt())
    await toBalance.save()
  }

  if (isFromUserAddress) {
    const fromBalance = await CurrencyBalanceService.getOrInit(fromAddress, evmToken.id)
    await fromBalance.debit(amount.toBigInt())
    await fromBalance.save()
  }

  // Handle INVEST_LP_COLLECT
  if (isFromEscrow && isToUserAddress) {
    const investLpCollect = InvestorTransactionService.collectLpInvestOrder({ ...orderData, address: toAccount.id })
    await investLpCollect.save()

    const trancheBalance = await TrancheBalanceService.getOrInit(toAccount.id, orderData.poolId, orderData.trancheId)
    await trancheBalance.investCollect(orderData.amount)
    await trancheBalance.save()
  }
  // TODO: Handle REDEEM_LP_COLLECT
  // if (isFromUserEscrow && isToUserAddress) {
  //   const redeemLpCollect = InvestorTransactionService.collectLpRedeemOrder()
  // }

  // Handle Transfer In and Out
  if (isFromUserAddress && isToUserAddress) {
    const txIn = InvestorTransactionService.transferIn({ ...orderData, address: toAccount.id })
    await txIn.save()

    const txOut = InvestorTransactionService.transferOut({ ...orderData, address: fromAccount.id })
    await txOut.save()
  }
}

async function updateLoans(poolId: string, blockDate: Date, shelf: string, pile: string, navFeed: string) {
  let existingLoans = await LoanService.getByPoolId(poolId)
  let loanIndex = existingLoans.length || 1
  const contractLoans = []
  // eslint-disable-next-line
  while (true) {
    const shelfContract = ShelfAbi__factory.connect(shelf, ethApi)
    const response = await shelfContract.token(loanIndex)
    if (Number(response.nft) === 0) {
      // no more loans
      break
    }
    contractLoans.push(loanIndex)
    loanIndex++
  }
  const newLoans = contractLoans.filter((loanIndex) => !existingLoans.includes(loanIndex))
  // create new loans
  for (const loanIndex of newLoans) {
    const loan = new Loan(`${poolId}-${loanIndex}`, blockDate, poolId, true, LoanStatus.CREATED)

    const navFeedContract = NavfeedAbi__factory.connect(navFeed, ethApi)
    const nftId = await navFeedContract['nftID(uint256)'](loanIndex)
    const maturityDate = await navFeedContract.maturityDate(nftId)
    loan.actualMaturityDate = new Date(Number(maturityDate) * 1000)
    loan.save()
  }

  // update all loans
  existingLoans = await LoanService.getByPoolId(poolId)
  for (const loan of existingLoans) {
    const shelfContract = ShelfAbi__factory.connect(shelf, ethApi)
    const loanIndex = loan.id.split('-')[1]
    const nftLocked = await shelfContract.nftLocked(loanIndex)
    if (!nftLocked) {
      loan.isActive = false
      loan.status = LoanStatus.CLOSED
      loan.save()
    }
    const pileContract = PileAbi__factory.connect(pile, ethApi)
    const prevDebt = loan.outstandingDebt
    const debt = await pileContract.debt(loanIndex)
    loan.outstandingDebt = debt.toBigInt()
    const rateGroup = await pileContract.loanRates(loanIndex)
    const rates = await pileContract.rates(rateGroup)
    loan.interestRatePerSec = rates.ratePerSecond.toBigInt()

    if (prevDebt > loan.outstandingDebt) {
      loan.repaidAmountByPeriod = prevDebt - loan.outstandingDebt
    }
    loan.save()
  }
}

function getLatestContract(contractArray, blockNumber) {
  return contractArray.reduce(
    (prev, current) =>
      current.startBlock <= blockNumber && current.startBlock > (prev?.startBlock || 0) ? current : prev,
    null
  )
}
