import { Loan, LoanStatus } from '../../types'
import { EthereumBlock } from '@subql/types-ethereum'
import { DAIMainnetAddress, tinlakePools } from '../../config'
import { errorHandler } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'
import { CurrencyService } from '../services/currencyService'
import { BlockchainService } from '../services/blockchainService'
import { ShelfAbi__factory, NavfeedAbi__factory, ReserveAbi__factory, PileAbi__factory } from '../../types/contracts'
import { Provider } from '@ethersproject/providers'
import { TimekeeperService, getPeriodStart } from '../../helpers/timekeeperService'
import { LoanService } from '../services/loanService'
import { evmStateSnapshotter } from '../../helpers/stateSnapshot'

const timekeeper = TimekeeperService.init()

export const handleEthBlock = errorHandler(_handleEthBlock)
async function _handleEthBlock(block: EthereumBlock): Promise<void> {
  if (chainId == '1') {
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
            const reserveContract = ReserveAbi__factory.connect(latestReserve.address, api as unknown as Provider)
            pool.totalReserve = (await reserveContract.totalBalance()).toBigInt()
            await pool.save()
            logger.info(`Updating pool ${tinlakePool.id} with totalReserve: ${pool.totalReserve}`)
          }
          // Update loans
          if (latestNavFeed) {
            logger.info(`Updating loans for pool ${tinlakePool.id}`)
            await updateLoans(
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
      await evmStateSnapshotter('Pool', 'PoolSnapshot', block, 'poolId')
      await evmStateSnapshotter('Loan', 'LoanSnapshot', block, 'loanId', 'isActive', true)

      //Update tracking of period and continue
      await (await timekeeper).update(blockPeriodStart)
    }
  }
}

async function updateLoans(poolId: string, blockDate: Date, shelf: string, pile: string, navFeed: string) {
  let existingLoans = await LoanService.getByPoolId(poolId)
  logger.info(`Existing loans for pool ${poolId}: ${existingLoans.length}`)
  let loanIndex = existingLoans.length || 1
  const contractLoans = []
  // eslint-disable-next-line
  while (true) {
    logger.info(`Checking loan ${loanIndex} for pool ${poolId}`)
    const shelfContract = ShelfAbi__factory.connect(shelf, api as unknown as Provider)
    logger.info(`after shelfContract ${shelfContract}`)
    let response
    try {
      response = await shelfContract.token(loanIndex)
      logger.info(`after response ${response}`)
    } catch (e) {
      logger.info(`Error ${e}`)
      break
    }
    if (!response || response.registry === '0x0000000000000000000000000000000000000000') {
      logger.info(`No more loans for pool ${poolId}`)
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

    const navFeedContract = NavfeedAbi__factory.connect(navFeed, api as unknown as Provider)
    const nftId = await navFeedContract['nftID(uint256)'](loanIndex)
    const maturityDate = await navFeedContract.maturityDate(nftId)
    loan.actualMaturityDate = new Date(Number(maturityDate) * 1000)
    loan.save()
  }

  // update all loans
  existingLoans = await LoanService.getByPoolId(poolId)
  for (const loan of existingLoans) {
    const shelfContract = ShelfAbi__factory.connect(shelf, api as unknown as Provider)
    const loanIndex = loan.id.split('-')[1]
    const nftLocked = await shelfContract.nftLocked(loanIndex)
    if (!nftLocked) {
      loan.isActive = false
      loan.status = LoanStatus.CLOSED
      loan.save()
    }
    const pileContract = PileAbi__factory.connect(pile, api as unknown as Provider)
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
