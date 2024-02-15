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
import { Multicall3 } from '../../types/contracts/MulticallAbi'

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
      for (const tinlakePool of tinlakePools) {
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
        }
      }
      if (poolUpdateCalls.length > 0) {
        const callResults = await processCalls(poolUpdateCalls)

        for (let i = 0; i < tinlakePools.length; i++) {
          const tinlakePool = tinlakePools[i]
          const latestNavFeed = getLatestContract(tinlakePool.navFeed, blockNumber)
          const latestReserve = getLatestContract(tinlakePool.reserve, blockNumber)
          const pool = await PoolService.getOrSeed(tinlakePool.id)

          // Update pool
          if (latestNavFeed) {
            const currentNAV = NavfeedAbi__factory.createInterface().decodeFunctionResult(
              'currentNAV',
              callResults[i][0]
            )[0]
            pool.portfolioValuation = currentNAV.toBigInt()
            await pool.save()
            logger.info(`Updating pool ${tinlakePool.id} with portfolioValuation: ${pool.portfolioValuation}`)
          }
          if (latestReserve) {
            const totalBalance = ReserveAbi__factory.createInterface().decodeFunctionResult(
              'totalBalance',
              callResults[i][1]
            )[0]
            pool.totalReserve = totalBalance.toBigInt()
            logger.info(`Updating pool ${tinlakePool.id} with totalReserve: ${pool.totalReserve}`)
          }

          // Update loans
          if (latestNavFeed) {
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
  logger.info(`Updating loans for pool ${poolId}`)
  let existingLoans = await LoanService.getByPoolId(poolId)
  const newLoans = await getNewLoans(existingLoans, shelf)

  const nftIdCalls = []
  for (const loanIndex of newLoans) {
    nftIdCalls.push([navFeed, NavfeedAbi__factory.createInterface().encodeFunctionData('nftID', [loanIndex])])
  }
  const nftIdResponses = await processCalls(nftIdCalls)
  const nftIds = nftIdResponses[0].map(
    (response) => NavfeedAbi__factory.createInterface().decodeFunctionResult('nftID', response)[0]
  )

  const maturityDateCalls = []
  for (const nftId of nftIds) {
    maturityDateCalls.push([navFeed, NavfeedAbi__factory.createInterface().encodeFunctionData('maturityDate', [nftId])])
  }
  const maturityDateResponses = await processCalls(maturityDateCalls)
  const maturityDates = maturityDateResponses[0].map(
    (response) => NavfeedAbi__factory.createInterface().decodeFunctionResult('maturityDate', response)[0]
  )

  // create new loans
  for (let i = 0; i < newLoans.length; i++) {
    const loanIndex = newLoans[i]
    const loan = new Loan(`${poolId}-${loanIndex}`, blockDate, poolId, true, LoanStatus.CREATED)
    loan.actualMaturityDate = new Date(Number(maturityDates[i]) * 1000)
    loan.save()
  }
  logger.info(`Creating ${newLoans.length} new loans for pool ${poolId}`)

  // update all loans
  existingLoans = (await LoanService.getByPoolId(poolId)).filter((loan) => loan.status !== LoanStatus.CLOSED)
  const loanDetailsCalls = []
  existingLoans.forEach((loan) => {
    const loanIndex = loan.id.split('-')[1]
    loanDetailsCalls.push([shelf, ShelfAbi__factory.createInterface().encodeFunctionData('nftLocked', [loanIndex])])
    loanDetailsCalls.push([pile, PileAbi__factory.createInterface().encodeFunctionData('debt', [loanIndex])])
    loanDetailsCalls.push([pile, PileAbi__factory.createInterface().encodeFunctionData('loanRates', [loanIndex])])
  })
  const loanDetailsResponses = await processCalls(loanDetailsCalls)
  const loanDetails = []
  for (let i = 0; i < loanDetailsResponses[0].length; i += 3) {
    loanDetails.push({
      nftLocked: ShelfAbi__factory.createInterface().decodeFunctionResult('nftLocked', loanDetailsResponses[0][i])[0],
      debt: PileAbi__factory.createInterface().decodeFunctionResult('debt', loanDetailsResponses[0][i + 1])[0],
      loanRates: PileAbi__factory.createInterface().decodeFunctionResult(
        'loanRates',
        loanDetailsResponses[0][i + 2]
      )[0],
    })
  }

  for (let i = 0; i < existingLoans.length; i++) {
    const loan = existingLoans[i]
    const nftLocked = loanDetails[i].nftLocked
    if (!nftLocked) {
      loan.isActive = false
      loan.status = LoanStatus.CLOSED
      loan.save()
    }
    const prevDebt = loan.outstandingDebt
    const debt = loanDetails[i].debt
    loan.outstandingDebt = debt.toBigInt()
    const rateGroup = loanDetails[i].loanRates

    const pileContract = PileAbi__factory.connect(pile, api as unknown as Provider)
    const rates = await pileContract.rates(rateGroup)
    loan.interestRatePerSec = rates.ratePerSecond.toBigInt()

    if (prevDebt > loan.outstandingDebt) {
      loan.repaidAmountByPeriod = prevDebt - loan.outstandingDebt
    }
    logger.info(`Updating loan ${loan.id} for pool ${poolId}`)
    loan.save()
  }
}

async function getNewLoans(existingLoans: Loan[], shelfAddress: string) {
  let loanIndex = existingLoans.length || 1
  const contractLoans = []
  const shelfContract = ShelfAbi__factory.connect(shelfAddress, api as unknown as Provider)
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
      logger.info('No more loans')
      // no more loans
      break
    }
    contractLoans.push(loanIndex)
    loanIndex++
  }
  return contractLoans.filter((loanIndex) => !existingLoans.includes(loanIndex))
}

function getLatestContract(contractArray, blockNumber) {
  return contractArray.reduce(
    (prev, current) =>
      current.startBlock <= blockNumber && current.startBlock > (prev?.startBlock || 0) ? current : prev,
    null
  )
}

function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const result = []
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize))
  }
  return result
}

async function processCalls(calls: Multicall3.CallStruct[], chunkSize = 30): Promise<string[][]> {
  const callChunks = chunkArray(calls, chunkSize)
  let callResults = []
  for (let i = 0; i < callChunks.length; i++) {
    const chunk = callChunks[i]
    const multicall = MulticallAbi__factory.connect(multicallAddress, api as unknown as Provider)
    logger.info(`Fetching ${chunk.length * i} to ${chunk.length * (i + 1)} of ${calls.length}`)
    const results = await multicall.callStatic.tryAggregate(false, chunk)
    callResults = [...callResults, results.map((result) => result[1])]
  }

  return callResults
}
