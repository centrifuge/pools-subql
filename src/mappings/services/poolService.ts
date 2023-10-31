import { Option, u64, u128, Vec } from '@polkadot/types'
import { ITuple } from '@polkadot/types/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { paginatedGetter } from '../../helpers/paginatedGetter'
import { ExtendedRpc, LoanInfoActive, NavDetails, PoolDetails, PoolMetadata, TrancheDetails } from '../../helpers/types'
import { Pool } from '../../types'

export class PoolService extends Pool {
  static init(
    poolId: string,
    currencyId: string,
    maxReserve: bigint,
    maxPortfolioValuationAge: number,
    minEpochTime: number,
    timestamp: Date,
    blockNumber: number
  ) {
    const pool = new this(
      poolId,
      'ALL',
      timestamp,
      blockNumber,
      currencyId,
      '',
      minEpochTime,
      maxPortfolioValuationAge,
      1,
      BigInt(0),
      BigInt(0),
      BigInt(0),
      maxReserve,
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0),
      BigInt(0)
    )

    pool.sumBorrowedAmountByPeriod = BigInt(0)
    pool.sumRepaidAmountByPeriod = BigInt(0)
    pool.sumInvestedAmountByPeriod = BigInt(0)
    pool.sumRedeemedAmountByPeriod = BigInt(0)
    pool.sumNumberOfLoansByPeriod = BigInt(0)

    pool.sumBorrowedAmount = BigInt(0)
    pool.sumRepaidAmount = BigInt(0)
    pool.sumNumberOfLoans = BigInt(0)

    return pool
  }

  public async initData() {
    const [poolReq, metadataReq] = await Promise.all([
      api.query.poolSystem.pool<Option<PoolDetails>>(this.id),
      api.query.poolRegistry.poolMetadata<Option<PoolMetadata>>(this.id),
    ])

    if (poolReq.isNone) throw new Error('No pool data available to create the pool')

    const poolData = poolReq.unwrap()
    this.metadata = metadataReq.isSome ? metadataReq.unwrap().metadata.toUtf8() : 'NA'
    this.minEpochTime = poolData.parameters.minEpochTime.toNumber()
    this.maxPortfolioValuationAge = poolData.parameters.maxNavAge.toNumber()
    return this
  }

  static async getById(poolId: string) {
    const pool = (await this.get(poolId)) as PoolService
    return pool
  }

  static async getAll() {
    const pools = (await paginatedGetter('Pool', 'type', 'ALL')) as PoolService[]
    return pools.map((pool) => this.create(pool) as PoolService)
  }

  public async updateState() {
    const poolResponse = await api.query.poolSystem.pool<Option<PoolDetails>>(this.id)
    logger.info(`Updating state for pool: ${this.id}`)
    if (poolResponse.isSome) {
      const poolData = poolResponse.unwrap()
      this.totalReserve = poolData.reserve.total.toBigInt()
      this.availableReserve = poolData.reserve.available.toBigInt()
      this.maxReserve = poolData.reserve.max.toBigInt()
    }
    return this
  }

  public async updatePortfolioValuation() {
    const navResponse = await api.query.loans.portfolioValuation<NavDetails>(this.id)
    this.portfolioValuation = navResponse.value.toBigInt()
    return this
  }

  public increaseNumberOfLoans() {
    this.sumNumberOfLoansByPeriod += BigInt(1)
    this.sumNumberOfLoans += BigInt(1)
  }

  public updateNumberOfActiveLoans(numberOfActiveLoans: bigint) {
    this.sumNumberOfActiveLoans = numberOfActiveLoans
  }

  public increaseBorrowings(borrowedAmount: bigint) {
    this.sumBorrowedAmountByPeriod += borrowedAmount
    this.sumBorrowedAmount += borrowedAmount
  }

  public increaseRepayments(repaidAmount: bigint) {
    this.sumRepaidAmountByPeriod += repaidAmount
    this.sumRepaidAmount += repaidAmount
  }

  public increaseInvestments(currencyAmount: bigint) {
    this.sumInvestedAmountByPeriod += currencyAmount
  }

  public increaseRedemptions(currencyAmount: bigint) {
    this.sumRedeemedAmountByPeriod += currencyAmount
  }

  public closeEpoch(epochId: number) {
    this.lastEpochClosed = epochId
    this.currentEpoch = epochId + 1
  }

  public executeEpoch(epochId: number) {
    this.lastEpochExecuted = epochId
  }

  public computePoolValue() {
    const nav = bnToBn(this.portfolioValuation)
    const totalReserve = bnToBn(this.totalReserve)
    this.value = nToBigInt(nav.add(totalReserve))
  }

  public resetDebtOverdue() {
    this.sumDebtOverdue = BigInt(0)
  }

  public increaseDebtOverdue(amount: bigint) {
    this.sumDebtOverdue += amount
  }

  public increaseWriteOff(amount: bigint) {
    this.sumDebtWrittenOffByPeriod += amount
  }

  public async getTranches() {
    const poolResponse = await api.query.poolSystem.pool<Option<PoolDetails>>(this.id)
    logger.info(`Fetching tranches for pool: ${this.id}`)

    if (poolResponse.isNone) throw new Error('Unable to fetch pool data!')

    const poolData = poolResponse.unwrap()
    const { ids, tranches } = poolData.tranches

    return tranches.reduce<PoolTranches>((obj, data, index) => ({ ...obj, [ids[index].toHex()]: { index, data } }), {})
  }

  public async getActiveLoanData() {
    logger.info(`Querying active loan data for pool: ${this.id}`)
    const loanDetails = await api.query.loans.activeLoans<Vec<ITuple<[u64, LoanInfoActive]>>>(this.id)
    const activeLoanData = loanDetails.reduce<ActiveLoanData>(
      (last, current) => ({
        ...last,
        [current[0].toString()]: {
          normalizedAcc: current[1].pricing?.isInternal
            ? current[1].pricing?.asInternal.interest.normalizedAcc.toBigInt()
            : null,
          interestRate:
            current[1].pricing?.isInternal && current[1].pricing?.asInternal.interest.interestRate.isFixed
              ? current[1].pricing?.asInternal.interest.interestRate.asFixed.ratePerYear.toBigInt()
              : null,
        },
      }),
      {}
    )
    return activeLoanData
  }

  public async getTrancheTokenPrices() {
    logger.info(`Querying RPC tranche token prices for pool ${this.id}`)
    const poolId = this.id
    let tokenPrices: Vec<u128>
    try {
      tokenPrices = await (api.rpc as ExtendedRpc).pools.trancheTokenPrices(poolId)
    } catch (err) {
      logger.error(`Unable to fetch tranche token prices for pool: ${this.id}: ${err}`)
      tokenPrices = undefined
    }
    return tokenPrices
  }
}

interface ActiveLoanData {
  [loanId: string]: { normalizedAcc: bigint; interestRate: bigint }
}

interface PoolTranches {
  [trancheId: string]: { index: number; data: TrancheDetails }
}
