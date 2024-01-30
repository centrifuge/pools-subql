import { EthereumBlock } from '@subql/types-ethereum'
import { Provider } from '@ethersproject/providers'
import { Loan, LoanStatus, createTrancheTrackerDatasource } from '../../types'
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
import { PoolManagerAbi__factory, Shelf__factory } from '../../types/contracts'
import { Navfeed__factory } from '../../types/contracts/factories/Navfeed__factory'
import { Reserve__factory } from '../../types/contracts/factories/Reserve__factory'
import { Pile__factory } from '../../types/contracts/factories/Pile__factory'
import { TimekeeperService } from '../../helpers/timekeeperService'
import { stateSnapshotter } from '../../helpers/stateSnapshot'
import { LoanService } from '../services/loanService'

const timekeeper = TimekeeperService.init()
const pools = [
  {
    id: '0x09e43329552c9d81cf205fd5f44796fbc40c822e',
    shortName: 'REIF Pool',
    startBlock: 13796246,
    navFeed: { address: '0x67ee93df5ff0805d6bfbcd747bf4e3ad20af5cc3', startBlock: 13796262 },
    reserve: { address: '0xdcc68229b0d0fb7668f3304d88ee9a2738a7b51d', startBlock: 13796304 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x0ced6166873038ac0cc688e7e6d19e2cbe251bf0',
    shortName: 'Bling Series 1',
    startBlock: 11196893,
    navFeed: { address: '0x1621b607a62dac0dc2e4044ff1235a30f135cbd2', startBlock: 11197170 },
    reserve: { address: '0x932344ba99bf34035b4bc25cbd98f912ebc60371', startBlock: 11197219 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x235893bf9695f68a922dac055598401d832b538b',
    shortName: 'Pezesha 1',
    startBlock: 12453056,
    navFeed: { address: '0xd9b2471f5c7494254b8d52f4ab3146e747abc9ab', startBlock: 12453087 },
    reserve: { address: '0xb12e705733042610174ed22f6726d26db12dbdfe', startBlock: 12703288 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x3170d353772ed68676044f8b76f0641b2cba084e',
    shortName: 'Fortunafi 2',
    startBlock: 13512637,
    navFeed: { address: '0x3263b3a84543abfceca35ab1b02c6ab4f1e66b17', startBlock: 13512663 },
    reserve: { address: '0x101e8f7598639bf3d1320ac9999977a0678aa186', startBlock: 13513359 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x3b03863bd553c4ce07eabf2278016533451c9101',
    shortName: 'Cauris Global Fintech 1',
    startBlock: 13397601,
    navFeed: { address: '0x431548e6f14134b7e2955c4f2d42054f7588afce', startBlock: 13397666 },
    reserve: { address: '0xb15ccb81f633b98845a0f6c91a89483298a41cc3', startBlock: 13402984 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x3d167bd08f762fd391694c67b5e6af0868c45538',
    shortName: 'GIG Pool',
    startBlock: 12901666,
    navFeed: { address: '0x468eb2408c6f24662a291892550952eb0d70b707', startBlock: 12901939 },
    reserve: { address: '0x1794a4b29ff2ecdc044ad5d4972fa118d4c121b9', startBlock: 12902086 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x4597f91cc06687bdb74147c80c097a79358ed29b',
    shortName: 'BT1',
    startBlock: 16041343,
    navFeed: { address: '0x479506bff98b18d62e62862a02a55047ca6583fa', startBlock: 16041344 },
    reserve: { address: '0x50f8a1cdedd9aef2901c7ec0859d8adbf61b1263', startBlock: 16041344 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x4b6ca198d257d755a5275648d471fe09931b764a',
    shortName: 'Fortunafi 1',
    startBlock: 11282587,
    navFeed: { address: '0x887db3ee1166ddaf5f7df96b195912594112431e', startBlock: 16799275 },
    reserve: { address: '0xd9cec614db2b5a7490df2462a4621d96bcd4bfe2', startBlock: 12996577 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x4ca805ce8ece2e63ffc1f9f8f2731d3f48df89df',
    shortName: 'Harbor Trade 2',
    startBlock: 11464178,
    navFeed: { address: '0xdb9a84e5214e03a4e5dd14cfb3782e0bcd7567a7', startBlock: 11464206 },
    reserve: { address: '0x86284a692430c25eff37007c5707a530a6d63a41', startBlock: 13004076 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x53b2d22d07e069a3b132bfeaad275b10273d381e',
    shortName: 'New Silver 2',
    startBlock: 11288849,
    navFeed: { address: '0x41fad1eb242de19da0206b0468763333bb6c2b3d', startBlock: 11288866 },
    reserve: { address: '0x1f5fa2e665609ce4953c65ce532ac8b47ec97cd5', startBlock: 12702995 },
    shelf: { address: '0x7d057A056939bb96D682336683C10EC89b78D7CE' },
    pile: { address: '0x3eC5c16E7f2C6A80E31997C68D8Fa6ACe089807f' },
  },
  {
    id: '0x55d86d51ac3bcab7ab7d2124931fba106c8b60c7',
    shortName: 'BT4',
    startBlock: 16047892,
    navFeed: { address: '0x60eeba86ce045d54ce625d71a5c2baebfb2e46e9', startBlock: 16047892 },
    reserve: { address: '0xeeaeb5dd73f59b985620ba957c7c1917efcaa36b', startBlock: 16047892 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x560ac248ce28972083b718778eeb0dbc2de55740',
    shortName: 'Branch Series 3',
    startBlock: 12554323,
    navFeed: { address: '0x2cc23f2c2451c55a2f4da389bc1d246e1cf10fc6', startBlock: 12554399 },
    reserve: { address: '0xb74c0a7929f5c35e5f4e74b628ee32a35a7535d7', startBlock: 12703246 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x714d520cfac2027834c8af8ffc901855c3ad41ec',
    shortName: 'FactorChain 1',
    startBlock: 12003036,
    navFeed: { address: '0x30e3f738f22f5a4671d1252793deb6e657e4b8aa', startBlock: 12003518 },
    reserve: { address: '0x0958c089e6389f2bba2eedd754047265241baf55', startBlock: 12003573 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x82b8617a16e388256617febba1826093401a3fe5',
    shortName: 'Paperchain 3',
    startBlock: 11458901,
    navFeed: { address: '0xc61e65114cbd5508e31fd755a49a817798c132cb', startBlock: 11458986 },
    reserve: { address: '0xb873c152c06be54c704f891e37a7e3b554514964', startBlock: 11459264 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x90040f96ab8f291b6d43a8972806e977631affde',
    shortName: 'BT3',
    startBlock: 16047729,
    navFeed: { address: '0xea5e577df382889497534a0258345e78bbd4e31d', startBlock: 16047729 },
    reserve: { address: '0xb54900bcc0674e356627b58420fd051f2d47b9e9', startBlock: 16047729 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x92332a9831ac04275bc0f22b9140b21c72984eb8',
    shortName: 'Pezesha 1',
    startBlock: 12113740,
    navFeed: { address: '0xcea9f97d7fe55154e4a35a8b3316a8cdf9e08626', startBlock: 12114080 },
    reserve: { address: '0x7f5dea6c463a7250c53f1347f82b506f40e1b0cb', startBlock: 12114265 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0x9de3064f49696a25066252c35ede68850ea33bf8',
    shortName: 'UP Series 1',
    startBlock: 12951444,
    navFeed: { address: '0x800aa0dd91374364e3de476d97dca32848cea6c4', startBlock: 12951456 },
    reserve: { address: '0x6942f8779c5c4aa385121a3ee203f2ca1d9d10bc', startBlock: 12951486 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0xb5c08534d1e73582fbd79e7c45694cad6a5c5ab2',
    shortName: 'BT2',
    startBlock: 16047557,
    navFeed: { address: '0xeff42b6d4527a6a2fb429082386b34f5d4050b2c', startBlock: 16047557 },
    reserve: { address: '0x86ade02617911d2bf020b29b3035e6b3d805992d', startBlock: 16047557 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0xd8486c565098360a24f858088a6d29a380ddf7ec',
    shortName: 'FNO1',
    startBlock: 15460148,
    navFeed: { address: '0x9ec3f3a40ba2572a48c8865e4aa89b3ee4ad4915', startBlock: 15460155 },
    reserve: { address: '0xc156aa23a29ef7678b4dec5b812b84797ed21ee0', startBlock: 15460175 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0xdb3bc9fb1893222d266762e9ff857eb74d75c7d6',
    shortName: 'ConsolFreight 4',
    startBlock: 11063000,
    navFeed: { address: '0x69504da6b2cd8320b9a62f3aed410a298d3e7ac6', startBlock: 11063046 },
    reserve: { address: '0xfaec38ffee969cf18e88097ec62e30b70494e234', startBlock: 13004061 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0xf96f18f2c70b57ec864cc0c8b828450b82ff63e3',
    shortName: 'ALT 1.0',
    startBlock: 14167745,
    navFeed: { address: '0x6fb02533b264d103b84d8f13d11a4865ec96307a', startBlock: 14167760 },
    reserve: { address: '0x35f7de72c8597599ef4f2a18eafd162257301435', startBlock: 14167898 },
    shelf: { address: '' },
    pile: { address: '' },
  },
  {
    id: '0xfc2950dd337ca8496c18dfc0256fb905a7e7e5c6',
    shortName: 'databased.FINANCE 1',
    startBlock: 11639815,
    navFeed: { address: '0x00cd3ae59fdbd375a187bf8074db59edaf766c19', startBlock: 11639830 },
    reserve: { address: '0x729e12cdc0190a2e4ab4401bca4c16132d75adc5', startBlock: 11639877 },
    shelf: { address: '' },
    pile: { address: '' },
  },
]

export const handleEvmBlock = errorHandler(_handleEvmBlock)
async function _handleEvmBlock(block: EthereumBlock): Promise<void> {
  const date = new Date(Number(block.timestamp) * 1000)
  const blockNumber = block.number
  const newPeriod = (await timekeeper).processBlock(date)

  const DAIAddress = '0x6b175474e89094c44da98b954eedeac495271d0f'
  const blockchain = await BlockchainService.getOrInit('1')
  const currency = await CurrencyService.getOrInitEvm(blockchain.id, DAIAddress)

  if (newPeriod) {
    logger.info(`It's a new period on EVM block ${blockNumber}: ${date.toISOString()}`)

    // update pool states
    for (const tinlakePool of pools) {
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
        if (block.number >= tinlakePool.navFeed.startBlock) {
          const navFeedContract = Navfeed__factory.connect(tinlakePool.navFeed.address, api as unknown as Provider)
          pool.portfolioValuation = (await navFeedContract.currentNAV()).toBigInt()
          await pool.save()
          logger.info(`Updating pool ${tinlakePool.id} with portfolioValuation: ${pool.portfolioValuation}`)
        }
        if (block.number >= tinlakePool.reserve.startBlock) {
          const reserveContract = Reserve__factory.connect(tinlakePool.reserve.address, api as unknown as Provider)
          pool.totalReserve = (await reserveContract.totalBalance()).toBigInt()
          await pool.save()
          logger.info(`Updating pool ${tinlakePool.id} with totalReserve: ${pool.totalReserve}`)
        }
        // Update loans
        if (tinlakePool.shelf?.address !== '' && tinlakePool.pile?.address !== '') {
          updateLoans(
            tinlakePool.id,
            date,
            tinlakePool.shelf?.address,
            tinlakePool.pile?.address,
            tinlakePool.navFeed.address
          )
        }
      }
    }

    // Take pool snapshot
    await stateSnapshotter('Pool', 'PoolSnapshot', { number: block.number, timestamp: date }, 'poolId')
  }
}

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

async function updateLoans(poolId: string, blockDate: Date, shelf: string, pile: string, navFeed: string) {
  let loanIndex = 1
  const contractLoans = []
  // eslint-disable-next-line
  while (true) {
    const shelfContract = Shelf__factory.connect(shelf, api as unknown as Provider)
    const response = await shelfContract.token(loanIndex)
    if (Number(response.nft) === 0) {
      // no more loans
      break
    }
    contractLoans.push(loanIndex)
    loanIndex++
  }
  let existingLoans = await LoanService.getByPoolId(poolId)
  const newLoans = contractLoans.filter((loanIndex) => !existingLoans.includes(loanIndex))
  // create new loans
  for (const loanIndex of newLoans) {
    const loan = new Loan(`${poolId}-${loanIndex}`, blockDate, poolId, true, LoanStatus.CREATED)

    const navFeedContract = Navfeed__factory.connect(navFeed, api as unknown as Provider)
    const nftId = await navFeedContract['nftID(uint256)'](loanIndex)
    const maturityDate = await navFeedContract.maturityDate(nftId)
    loan.maturityDate = new Date(Number(maturityDate) * 1000)
    loan.save()
  }

  // update all loans
  existingLoans = await LoanService.getByPoolId(poolId)
  for (const loan of existingLoans) {
    const shelfContract = Shelf__factory.connect(shelf, api as unknown as Provider)
    const loanIndex = loan.id.split('-')[1]
    const nftLocked = await shelfContract.nftLocked(loanIndex)
    if (!nftLocked) {
      loan.isActive = false
      loan.status = LoanStatus.CLOSED
      loan.save()
    }
    const pileContract = Pile__factory.connect(pile, api as unknown as Provider)
    const debt = await pileContract.debt(loanIndex)
    loan.outstandingDebt = debt.toBigInt()
    const rateGroup = await pileContract.loanRates(loanIndex)
    const rates = await pileContract.rates(rateGroup)
    loan.interestRatePerSec = rates.ratePerSecond.toBigInt()
  }
}
