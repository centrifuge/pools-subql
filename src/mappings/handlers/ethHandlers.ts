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
import { BigNumber } from 'ethers'

const timekeeper = TimekeeperService.init()
// type PoolContract = {
//   address: string
//   startBlock?: number
// }

// type TinlakePool = {
//   id: string
//   navFeed: PoolContract[]
//   reserve: PoolContract[]
//   shelf: PoolContract[]
//   pile: PoolContract[]
//   startBlock: number
// }

type PoolMulticall = {
  id: string
  type: string
  call: Multicall3.CallStruct
  result: string
}

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
      const poolUpdateCalls: PoolMulticall[] = []
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
            poolUpdateCalls.push({
              id: tinlakePool.id,
              type: 'currentNAV',
              call: {
                target: latestNavFeed.address,
                callData: NavfeedAbi__factory.createInterface().encodeFunctionData('currentNAV'),
              },
              result: '',
            })
          }
          if (latestReserve) {
            poolUpdateCalls.push({
              id: tinlakePool.id,
              type: 'totalBalance',
              call: {
                target: latestReserve.address,
                callData: ReserveAbi__factory.createInterface().encodeFunctionData('totalBalance'),
              },
              result: '',
            })
          }
        }
      }
      if (poolUpdateCalls.length > 0) {
        const callResults = await processCalls(poolUpdateCalls)
        for (const callResult of callResults) {
          const tinlakePool = tinlakePools.find((p) => p.id === callResult.id)
          const latestNavFeed = getLatestContract(tinlakePool.navFeed, blockNumber)
          const latestReserve = getLatestContract(tinlakePool.reserve, blockNumber)
          const pool = await PoolService.getOrSeed(tinlakePool.id)

          // Update pool
          if (latestNavFeed) {
            const currentNAV = NavfeedAbi__factory.createInterface().decodeFunctionResult(
              'currentNAV',
              callResult.result
            )[0]
            pool.portfolioValuation = currentNAV.toBigInt()
            await pool.save()
            logger.info(`Updating pool ${tinlakePool.id} with portfolioValuation: ${pool.portfolioValuation}`)
          }
          if (latestReserve) {
            const totalBalance = ReserveAbi__factory.createInterface().decodeFunctionResult(
              'totalBalance',
              callResult.result
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

type NewLoanData = {
  id: string
  nftId: string
  maturityDate?: unknown
}

async function updateLoans(poolId: string, blockDate: Date, shelf: string, pile: string, navFeed: string) {
  logger.info(`Updating loans for pool ${poolId}`)
  let existingLoans = await LoanService.getByPoolId(poolId)
  const newLoans = await getNewLoans(existingLoans, shelf)
  logger.info(`Found ${newLoans.length} new loans for pool ${poolId}`)

  logger.info('getting nftIds')
  const nftIdCalls: PoolMulticall[] = []
  for (const loanIndex of newLoans) {
    nftIdCalls.push({
      id: loanIndex,
      call: {
        target: navFeed,
        callData: NavfeedAbi__factory.createInterface().encodeFunctionData('nftID', [loanIndex]),
      },
      type: 'nftId',
      result: '',
    })
  }
  logger.info(`nftIdCalls.length: ${nftIdCalls.length}`)
  if (nftIdCalls.length > 0) {
    const newLoanData: NewLoanData[] = []
    const nftIdResponses = await processCalls(nftIdCalls)
    for (const response of nftIdResponses) {
      if (response.result) {
        const data: NewLoanData = {
          id: response.id,
          nftId: NavfeedAbi__factory.createInterface().decodeFunctionResult('nftID', response.result)[0],
        }
        newLoanData.push(data)
        logger.info('pushed data')
      }
    }
    logger.info(`newLoanData.length: ${newLoanData.length}`)
    logger.info(`newLoanData[0]: ${newLoanData[0]}`)

    // Ignore Blocktower pools, since their loans have no maturity dates
    const isBlocktower = [
      '0x4597f91cc06687bdb74147c80c097a79358ed29b',
      '0xb5c08534d1e73582fbd79e7c45694cad6a5c5ab2',
      '0x90040f96ab8f291b6d43a8972806e977631affde',
      '0x55d86d51ac3bcab7ab7d2124931fba106c8b60c7',
    ].includes(poolId)
    logger.info(`isBlocktower: ${isBlocktower}`)

    if (!isBlocktower) {
      const maturityDateCalls: PoolMulticall[] = []
      for (const { id, nftId } of newLoanData) {
        maturityDateCalls.push({
          id,
          type: 'maturityDate',
          call: {
            target: navFeed,
            callData: NavfeedAbi__factory.createInterface().encodeFunctionData('maturityDate', [nftId]),
          },
          result: '',
        })
      }
      logger.info(`maturityDateCalls.length: ${maturityDateCalls.length}`)
      const maturityDateResponses = await processCalls(maturityDateCalls)
      logger.info(`maturityDateResponses.length: ${maturityDateResponses.length}`)
      maturityDateResponses.map((response) => {
        newLoanData.find((loan) => loan.id === response.id).maturityDate =
          NavfeedAbi__factory.createInterface().decodeFunctionResult('maturityDate', response.result)[0]
      })
      // logger.info(`maturityDates.length: ${maturityDates.length}`)
    }

    // create new loans
    for (const { id, maturityDate } of newLoanData) {
      // logger.info(`maturityDate length: ${maturityDates.length}`)
      // logger.info(`newLoans length: ${newLoans.length}`)
      // logger.info(`maturityDate type of: ${typeof maturityDates[i]}`)
      // logger.info(`mat keys: ${Object.keys(maturityDates[i])}`)
      // logger.info(`mat values: ${Object.values(maturityDates[i])}`)
      const loan = new Loan(`${poolId}-${id}`, blockDate, poolId, true, LoanStatus.CREATED)
      if (!isBlocktower) {
        loan.actualMaturityDate = new Date((maturityDate as BigNumber).toNumber() * 1000)
      }
      loan.save()
    }
    logger.info(`Creating ${newLoans.length} new loans for pool ${poolId}`)
  }

  // update all loans
  existingLoans = (await LoanService.getByPoolId(poolId)).filter((loan) => loan.status !== LoanStatus.CLOSED)
  logger.info(`Updating ${existingLoans.length} existing loans for pool ${poolId}`)
  const loanDetailsCalls = []
  existingLoans.forEach((loan) => {
    const loanIndex = loan.id.split('-')[1]
    loanDetailsCalls.push({
      id: loanIndex,
      type: 'nftLocked',
      call: {
        target: shelf,
        callData: ShelfAbi__factory.createInterface().encodeFunctionData('nftLocked', [loanIndex]),
      },
      result: '',
    })
    loanDetailsCalls.push({
      pool: tinlakePools.find((p) => p.id === poolId),
      type: 'debt',
      call: {
        target: pile,
        callData: PileAbi__factory.createInterface().encodeFunctionData('debt', [loanIndex]),
      },
      result: '',
    })
    loanDetailsCalls.push({
      pool: tinlakePools.find((p) => p.id === poolId),
      type: 'loanRates',
      call: {
        target: pile,
        callData: PileAbi__factory.createInterface().encodeFunctionData('loanRates', [loanIndex]),
      },
      result: '',
    })
  })
  if (loanDetailsCalls.length > 0) {
    const loanDetailsResponses = await processCalls(loanDetailsCalls)
    const loanDetails = []
    for (let i = 0; i < loanDetailsResponses.length; i += 3) {
      loanDetails.push({
        nftLocked: ShelfAbi__factory.createInterface().decodeFunctionResult(
          'nftLocked',
          loanDetailsResponses[i].result
        )[0],
        debt: PileAbi__factory.createInterface().decodeFunctionResult('debt', loanDetailsResponses[i + 1].result)[0],
        loanRates: PileAbi__factory.createInterface().decodeFunctionResult(
          'loanRates',
          loanDetailsResponses[i + 2].result
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
        loan.status = LoanStatus.ACTIVE
        loan.repaidAmountByPeriod = prevDebt - loan.outstandingDebt
      }
      logger.info(`Updating loan ${loan.id} for pool ${poolId}`)
      loan.save()
    }
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

async function processCalls(callsArray: PoolMulticall[], chunkSize = 30): Promise<PoolMulticall[]> {
  const callChunks = chunkArray(callsArray, chunkSize)
  // let callResults = []
  logger.info(`Processing ${callsArray.length} calls in ${callChunks.length} chunks`)
  for (let i = 0; i < callChunks.length; i++) {
    const chunk = callChunks[i]
    const multicall = MulticallAbi__factory.connect(multicallAddress, api as unknown as Provider)
    logger.info(`Fetching ${chunk.length * i} to ${chunk.length * (i + 1)} of ${callsArray.length}`)
    let results = []
    try {
      const calls = chunk.map((call) => call.call)
      results = await multicall.callStatic.aggregate(calls)
      logger.info(`Fetched ${results.length} results`)
      logger.info(`results[1]: ${results[1]}`)
      logger.info(`results[1].legth: ${results[1].length}`)
      logger.info(`results[1][0]: ${results[1][0]}`)
      logger.info(`results[1][0].length: ${results[1][0].length}`)
      results[1].map((result, i) => (callsArray[i].result = result))
      // callResults = [...callResults, ...results.map((result) => result[1])]
      // logger.info(`Fetched ${callResults.length} of ${calls.length} calls`)
    } catch (e) {
      logger.info(`Error fetching chunk ${i}: ${e}`)
    }
  }

  return callsArray
}
