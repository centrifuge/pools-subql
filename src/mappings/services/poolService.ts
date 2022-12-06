import { Option, u128, Vec } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { paginatedGetter } from '../../helpers/paginatedGetter'
import {
  ExtendedRpc,
  NavDetails,
  PoolDetails,
  PoolMetadata,
  PricedLoanDetails,
  TrancheDetails,
} from '../../helpers/types'
import { Pool } from '../../types'

export class PoolService extends Pool {
  static init(
    poolId: string,
    currencyId: string,
    maxReserve: bigint,
    maxNavAge: number,
    minEpochTime: number,
    timestamp: Date,
    blockNumber: number
  ) {
    const pool = new this(poolId)

    pool.currencyId = currencyId
    pool.maxReserve = maxReserve
    pool.maxNavAge = maxNavAge
    pool.minEpochTime = minEpochTime

    pool.netAssetValue = BigInt(0)
    pool.totalReserve = BigInt(0)
    pool.availableReserve = BigInt(0)
    pool.totalDebt = BigInt(0)
    pool.value = BigInt(0)

    pool.totalBorrowed_ = BigInt(0)
    pool.totalRepaid_ = BigInt(0)
    pool.totalInvested_ = BigInt(0)
    pool.totalRedeemed_ = BigInt(0)
    pool.totalNumberOfLoans_ = BigInt(0)
    pool.totalNumberOfActiveLoans = BigInt(0)
    pool.totalWrittenOff_ = BigInt(0)
    pool.totalDebtOverdue = BigInt(0)

    pool.totalEverBorrowed = BigInt(0)
    pool.totalEverNumberOfLoans = BigInt(0)

    //Create the pool
    const currentEpoch = 1

    pool.type = 'ALL'
    pool.createdAt = timestamp
    pool.createdAtBlockNumber = blockNumber
    pool.currentEpoch = currentEpoch

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
    this.maxNavAge = poolData.parameters.maxNavAge.toNumber()
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
    logger.info(`Updating state for pool: ${this.id} with data: ${JSON.stringify(poolResponse.toHuman())}`)
    if (poolResponse.isSome) {
      const poolData = poolResponse.unwrap()
      this.totalReserve = poolData.reserve.total.toBigInt()
      this.availableReserve = poolData.reserve.available.toBigInt()
      this.maxReserve = poolData.reserve.max.toBigInt()
    }
    return this
  }

  public async updateNav() {
    const navResponse = await api.query.loans.poolNAV<Option<NavDetails>>(this.id)
    if (navResponse.isSome) {
      const navData = navResponse.unwrap()
      this.netAssetValue = navData.latest.toBigInt()
    }
    return this
  }

  public updateTotalNumberOfActiveLoans(activeLoans: bigint) {
    this.totalNumberOfActiveLoans = activeLoans
  }

  public increaseTotalBorrowings(borrowedAmount: bigint) {
    this.totalBorrowed_ += borrowedAmount
    this.totalEverBorrowed += borrowedAmount
    this.totalNumberOfLoans_ += BigInt(1)
    this.totalEverNumberOfLoans += BigInt(1)
  }

  public increaseTotalInvested(currencyAmount: bigint) {
    this.totalInvested_ += currencyAmount
  }

  public increaseTotalRedeemed(currencyAmount: bigint) {
    this.totalRedeemed_ += currencyAmount
  }

  public closeEpoch(epochId: number) {
    this.lastEpochClosed = epochId
    this.currentEpoch = epochId + 1
  }

  public executeEpoch(epochId: number) {
    this.lastEpochExecuted = epochId
  }

  public computePoolValue() {
    const nav = bnToBn(this.netAssetValue)
    const totalReserve = bnToBn(this.totalReserve)
    this.value = nToBigInt(nav.add(totalReserve))
  }

  public resetTotalDebtOverdue() {
    this.totalDebtOverdue = BigInt(0)
  }

  public increaseTotalDebtOverdue(amount: bigint) {
    this.totalDebtOverdue += amount
  }

  public increaseTotalWrittenOff(amount: bigint) {
    this.totalWrittenOff_ += amount
  }

  public async getTranches() {
    const poolResponse = await api.query.poolSystem.pool<Option<PoolDetails>>(this.id)
    logger.info(`Fetching tranches for pool: ${this.id}`)

    if (poolResponse.isNone) throw new Error('Unable to fetch pool data!')

    const poolData = poolResponse.unwrap()
    const { ids, tranches } = poolData.tranches

    return tranches.reduce<PoolTranches>((obj, data, index) => ({ ...obj, [ids[index].toHex()]: { index, data } }), {})
  }

  public async getTrancheTokenPrices() {
    logger.info(`Qerying RPC tranche token prices for pool ${this.id}`)
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

  public async getActiveLoanData() {
    logger.info(`Querying active loan data for pool: ${this.id}`)
    const loanDetails = await api.query.loans.activeLoans<Vec<PricedLoanDetails>>(this.id)
    const activeLoanData = loanDetails.reduce<ActiveLoanData>(
      (last, current) => ({
        ...last,
        [current.loanId.toString()]: {
          normalizedDebt: current.normalizedDebt.toBigInt(),
          interestRate: current.interestRatePerSec.toBigInt(),
        },
      }),
      {}
    )
    return activeLoanData
  }
}

interface ActiveLoanData {
  [loanId: string]: { normalizedDebt: bigint; interestRate: bigint }
}

interface PoolTranches {
  [trancheId: string]: { index: number; data: TrancheDetails }
}
