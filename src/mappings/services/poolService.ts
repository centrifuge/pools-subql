import { Option, u64, u128, Vec } from '@polkadot/types'
import { ITuple } from '@polkadot/types/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { paginatedGetter } from '../../helpers/paginatedGetter'
import { ExtendedRpc, LoanInfoActive, NavDetails, PoolDetails, PoolMetadata, TrancheDetails } from '../../helpers/types'
import { Pool } from '../../types'

export class PoolService extends Pool {
  static seed(poolId: string) {
    logger.info(`Seeding pool ${poolId}`)
    return new this(`${poolId}`, 'ALL', false)
  }

  static async getOrSeed(poolId: string) {
    let pool = await this.getById(poolId)
    if(!pool) {
      pool = this.seed(poolId)
      await pool.save()
    }
    return pool
  }

  public init(
    currencyId: string,
    maxReserve: bigint,
    maxPortfolioValuationAge: number,
    minEpochTime: number,
    timestamp: Date,
    blockNumber: number
  ) {
    logger.info(`Initialising pool ${this.id}`)
    this.isActive = true
    this.createdAt = timestamp
    this.createdAtBlockNumber = blockNumber

    this.minEpochTime = minEpochTime
    this.maxPortfolioValuationAge = maxPortfolioValuationAge

    this.currentEpoch = 1

    this.portfolioValuation = BigInt(0)
    this.totalReserve = BigInt(0)
    this.availableReserve = BigInt(0)
    this.maxReserve = maxReserve

    this.sumDebt = BigInt(0)
    this.value = BigInt(0)

    this.sumNumberOfActiveLoans = BigInt(0)
    this.sumDebtOverdue = BigInt(0)
    this.sumDebtWrittenOffByPeriod = BigInt(0)

    this.sumBorrowedAmountByPeriod = BigInt(0)
    this.sumRepaidAmountByPeriod = BigInt(0)
    this.sumInvestedAmountByPeriod = BigInt(0)
    this.sumRedeemedAmountByPeriod = BigInt(0)
    this.sumNumberOfLoansByPeriod = BigInt(0)

    this.sumBorrowedAmount = BigInt(0)
    this.sumRepaidAmount = BigInt(0)
    this.sumNumberOfLoans = BigInt(0)

    this.currencyId = currencyId

    return this
  }

  public async initData() {
    logger.info(`Initialising data for pool: ${this.id}`)
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

  static async getActivePools() {
    const pools = (await paginatedGetter('Pool', 'isActive', true)) as PoolService[]
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
