import { Loan, LoanStatus } from '../../types'
import { EthereumBlock } from '@subql/types-ethereum'
import { DAIMainnetAddress, multicallAddress, tinlakePools } from '../../config'
import { errorHandler } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'
import { CurrencyService } from '../services/currencyService'
import { BlockchainService } from '../services/blockchainService'
import {
  ShelfAbi__factory,
  NavfeedAbi__factory,
  ReserveAbi__factory,
  PileAbi__factory,
  MulticallAbi__factory,
} from '../../types/contracts'
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
      const poolUpdateCalls = []
      // const poolUpdatePromises = [tinlakePools[0]].map(async (tinlakePool) => {
      for (const tinlakePool of [tinlakePools[0]]) {
        if (block.number >= tinlakePool.startBlock) {
          const pool = await PoolService.getOrSeed(tinlakePool.id)

          // initialize new pool
          if (block.number >= tinlakePool.startBlock && pool.totalReserve == null) {
            pool.totalReserve = BigInt(0)
            pool.portfolioValuation = BigInt(0)
            pool.isActive = false
            pool.currencyId = currency.id
            await pool.save()
            logger.info(`Initializing pool ${tinlakePool.id}`)
          }

          const latestNavFeed = getLatestContract(tinlakePool.navFeed, blockNumber)
          const latestReserve = getLatestContract(tinlakePool.reserve, blockNumber)

          if (latestNavFeed) {
            poolUpdateCalls.push([
              latestNavFeed.address,
              NavfeedAbi__factory.createInterface().encodeFunctionData('currentNAV'),
            ])
          }
          if (latestReserve) {
            poolUpdateCalls.push([
              latestReserve.address,
              ReserveAbi__factory.createInterface().encodeFunctionData('totalBalance'),
            ])
          }

          // if (latestNavFeed) {
          //   const navFeedContract = NavfeedAbi__factory.connect(latestNavFeed.address, api as unknown as Provider)
          //   pool.portfolioValuation = (await navFeedContract.currentNAV()).toBigInt()
          //   await pool.save()
          //   logger.info(`Updating pool ${tinlakePool.id} with portfolioValuation: ${pool.portfolioValuation}`)
          // }

          // if (latestReserve) {
          //   const reserveContract = ReserveAbi__factory.connect(latestReserve.address, api as unknown as Provider)
          //   pool.totalReserve = (await reserveContract.totalBalance()).toBigInt()
          //   await pool.save()
          //   logger.info(`Updating pool ${tinlakePool.id} with totalReserve: ${pool.totalReserve}`)
          // }

          if (poolUpdateCalls.length > 0) {
            const multicall = MulticallAbi__factory.connect(multicallAddress, api as unknown as Provider)
            logger.info(`Fetching multicall data for pool ${tinlakePool.id}`)
            const results = await multicall.callStatic.aggregate(poolUpdateCalls, { blockTag: blockNumber })
            logger.info(`Multicall results. Block Number: ${results[0]}`)
            if (latestNavFeed) {
              const navFeedContract = NavfeedAbi__factory.connect(latestNavFeed.address, api as unknown as Provider)
              logger.info(
                `Multicall results1.portfolioValuation: ${navFeedContract.interface.decodeFunctionResult(
                  'currentNAV',
                  results[1][0]
                )}`
              )
              //   pool.portfolioValuation = results.data[0].toBigInt()
              //   await pool.save()
              //   logger.info(`Updating pool ${tinlakePool.id} with portfolioValuation: ${pool.portfolioValuation}`)
            }
            if (latestReserve) {
              const reserveContract = ReserveAbi__factory.connect(latestReserve.address, api as unknown as Provider)
              logger.info(
                `Multicall results2.totalReserve: ${reserveContract.interface.decodeFunctionResult(
                  'totalBalance',
                  results[1][1]
                )}`
              )
              //   pool.totalReserve = results.data[1].toBigInt()
              //   await pool.save()
              //   logger.info(`Updating pool ${tinlakePool.id} with totalReserve: ${pool.totalReserve}`)
            }
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

      // await Promise.all(poolUpdatePromises)

      // Take snapshots
      await evmStateSnapshotter('Pool', 'PoolSnapshot', block, 'poolId')
      await evmStateSnapshotter('Loan', 'LoanSnapshot', block, 'loanId', 'isActive', true)

      //Update tracking of period and continue
      await (await timekeeper).update(blockPeriodStart)
    }
  }
}

async function updateLoans(poolId: string, blockDate: Date, shelf: string, pile: string, navFeed: string) {
  logger.info(`Updating loans for pool ${poolId}`)
  let existingLoans = await LoanService.getByPoolId(poolId)
  let loanIndex = existingLoans.length || 1
  const contractLoans = []
  const shelfContract = ShelfAbi__factory.connect(shelf, api as unknown as Provider)
  const navFeedContract = NavfeedAbi__factory.connect(navFeed, api as unknown as Provider)
  const pileContract = PileAbi__factory.connect(pile, api as unknown as Provider)
  const multicallContract = MulticallAbi__factory.connect(multicallAddress, api as unknown as Provider)
  // eslint-disable-next-line
  while (true) {
    let response
    try {
      response = await shelfContract.token(loanIndex)
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
  logger.info(`loans for pool ${poolId}: ${contractLoans.length}`)
  const newLoans = contractLoans.filter((loanIndex) => !existingLoans.includes(loanIndex))

  const nftIdCalls = newLoans.map((loanIndex) => ({
    target: navFeedContract.address,
    callData: navFeedContract.interface.encodeFunctionData('nftID', [loanIndex]),
  }))

  const nftIdResponses = await multicallContract.aggregate(nftIdCalls)
  const maturityDateCalls = newLoans.map((loanIndex) => {
    const nftId = navFeedContract.interface.decodeFunctionResult('nftID', nftIdResponses[loanIndex])
    return {
      target: navFeedContract.address,
      callData: navFeedContract.interface.encodeFunctionData('maturityDate', [nftId]),
    }
  })
  const maturityDateResponses = await multicallContract.aggregate(maturityDateCalls)

  for (let i = 0; i < newLoans.length; i++) {
    const loanIndex = newLoans[i]
    const loan = new Loan(`${poolId}-${loanIndex}`, blockDate, poolId, true, LoanStatus.CREATED)

    // const maturityDate = await navFeedContract.maturityDate(nftId)
    loan.actualMaturityDate = new Date(Number(maturityDateResponses[i]) * 1000)
    loan.save()
  }
  logger.info(`New loans for pool ${poolId}: ${newLoans.length}`)

  // update all loans
  existingLoans = (await LoanService.getByPoolId(poolId)).filter((loan) => loan.status !== LoanStatus.CLOSED)
  const loanDetailsCalls = []
  existingLoans.forEach((loan) => {
    const loanIndex = loan.id.split('-')[1]
    loanDetailsCalls.push([shelf, ShelfAbi__factory.createInterface().encodeFunctionData('nftLocked', [loanIndex])])
    loanDetailsCalls.push([pile, PileAbi__factory.createInterface().encodeFunctionData('debt', [loanIndex])])
    loanDetailsCalls.push([pile, PileAbi__factory.createInterface().encodeFunctionData('loanRates', [loanIndex])])
  })
  const loanDetailsResponses = await multicallContract.aggregate(loanDetailsCalls)

  for (const loan of existingLoans) {
    const nftLocked = loanDetailsResponses[loanDetailsCalls[0]]
    if (!nftLocked) {
      loan.isActive = false
      loan.status = LoanStatus.CLOSED
      loan.save()
    }
    const prevDebt = loan.outstandingDebt
    const debt = loanDetailsResponses[loanDetailsCalls[1]]
    loan.outstandingDebt = debt.toBigInt()
    const rateGroup = loanDetailsResponses[loanDetailsCalls[2]]
    const rates = await pileContract.rates(rateGroup)
    loan.interestRatePerSec = rates.ratePerSecond.toBigInt()

    if (prevDebt > loan.outstandingDebt) {
      loan.repaidAmountByPeriod = prevDebt - loan.outstandingDebt
    }
    logger.info(`Updating loan ${loan.id} for pool ${poolId}`)
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
