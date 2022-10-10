import { Option, u128, u64, Vec } from '@polkadot/types'
import { bnToBn, nToBigInt } from '@polkadot/util'
import { errorHandler } from '../../helpers/errorHandler'
import { ExtendedRpc, NavDetails, PoolDetails, PricedLoanDetails, TrancheDetails } from '../../helpers/types'
import { Pool, PoolState } from '../../types'

export class PoolService {
  readonly pool: Pool
  readonly poolState: PoolState

  constructor(pool: Pool, poolState: PoolState) {
    this.pool = pool
    this.poolState = poolState
  }

  static init = (poolId: string, timestamp: Date, blockNumber: number) => {
    const poolState = new PoolState(poolId)

    poolState.type = 'ALL'
    poolState.netAssetValue = BigInt(0)
    poolState.totalReserve = BigInt(0)
    poolState.availableReserve = BigInt(0)
    poolState.maxReserve = BigInt(0)
    poolState.totalDebt = BigInt(0)
    poolState.value = BigInt(0)

    poolState.totalBorrowed_ = BigInt(0)
    poolState.totalRepaid_ = BigInt(0)
    poolState.totalInvested_ = BigInt(0)
    poolState.totalRedeemed_ = BigInt(0)
    poolState.totalNumberOfLoans_ = BigInt(0)

    poolState.totalEverBorrowed = BigInt(0)
    poolState.totalEverNumberOfLoans = BigInt(0)

    //Create the pool
    const currentEpoch = 1
    const pool = new Pool(poolId)
    pool.stateId = poolId
    pool.type = 'ALL'
    pool.createdAt = timestamp
    pool.createdAtBlockNumber = blockNumber
    pool.currentEpoch = currentEpoch

    return new PoolService(pool, poolState)
  }

  private _initData = async (currencyCallback: (ticker: string) => Promise<string>) => {
    const poolReq = await api.query.pools.pool<Option<PoolDetails>>(this.pool.id)
    if (poolReq.isNone) throw new Error('No pool data available to create the pool')
    const poolData = poolReq.unwrap()

    this.pool.currencyId = await currencyCallback(poolData.currency.toString())
    this.pool.metadata = poolData.metadata.isSome ? poolData.metadata.unwrap().toUtf8() : 'NA'

    this.pool.minEpochTime = poolData.parameters.minEpochTime.toNumber()
    this.pool.maxNavAge = poolData.parameters.maxNavAge.toNumber()
    return this
  }
  public initData = errorHandler(this._initData)

  static getById = async (poolId: string) => {
    const pool = await Pool.get(poolId)
    const poolState = await PoolState.get(poolId)
    if (pool === undefined || poolState === undefined) return undefined
    return new PoolService(pool, poolState)
  }

  static getAll = async () => {
    const pools = await Pool.getByType('ALL')
    const result: PoolService[] = []
    for (const pool of pools) {
      const element = new PoolService(pool, await PoolState.get(pool.id))
      result.push(element)
    }
    return result
  }

  save = async () => {
    await this.poolState.save()
    await this.pool.save()
    return this
  }

  private _updateState = async () => {
    const poolResponse = await api.query.pools.pool<Option<PoolDetails>>(this.pool.id)
    logger.info(`Updating state for pool: ${this.pool.id} with data: ${JSON.stringify(poolResponse.toHuman())}`)
    if (poolResponse.isSome) {
      const poolData = poolResponse.unwrap()
      this.poolState.totalReserve = poolData.reserve.total.toBigInt()
      this.poolState.availableReserve = poolData.reserve.available.toBigInt()
      this.poolState.maxReserve = poolData.reserve.max.toBigInt()
    }
    return this
  }
  public updateState = errorHandler(this._updateState)

  private _updateNav = async () => {
    const navResponse = await api.query.loans.poolNAV<Option<NavDetails>>(this.pool.id)
    if (navResponse.isSome) {
      const navData = navResponse.unwrap()
      this.poolState.netAssetValue = navData.latest.toBigInt()
    }
    return this
  }
  public updateNav = errorHandler(this._updateNav)

  public increaseTotalBorrowings = (borrowedAmount: bigint) => {
    this.poolState.totalBorrowed_ = this.poolState.totalBorrowed_ + borrowedAmount
    this.poolState.totalEverBorrowed = this.poolState.totalEverBorrowed + borrowedAmount
    this.poolState.totalNumberOfLoans_ = this.poolState.totalNumberOfLoans_ + BigInt(1)
    this.poolState.totalEverNumberOfLoans = this.poolState.totalEverNumberOfLoans + BigInt(1)
  }

  public increaseTotalInvested = (currencyAmount: bigint) => {
    this.poolState.totalInvested_ += currencyAmount
  }

  public increaseTotalRedeemed = (currencyAmount: bigint) => {
    this.poolState.totalRedeemed_ += currencyAmount
  }

  public closeEpoch = (epochId: number) => {
    this.pool.lastEpochClosed = epochId
    this.pool.currentEpoch = epochId + 1
  }

  public executeEpoch = (epochId: number) => {
    this.pool.lastEpochExecuted = epochId
  }

  public computePoolValue = () => {
    const nav = bnToBn(this.poolState.netAssetValue)
    const totalReserve = bnToBn(this.poolState.totalReserve)
    this.poolState.value = nToBigInt(nav.add(totalReserve))
  }

  private _getTranches = async () => {
    const poolResponse = await api.query.pools.pool<Option<PoolDetails>>(this.pool.id)
    logger.info(`Fetching tranches for pool: ${this.pool.id}`)

    if (poolResponse.isNone) throw new Error('Unable to fetch pool data!')

    const poolData = poolResponse.unwrap()
    const { ids, tranches } = poolData.tranches

    return tranches.reduce<PoolTranches>((obj, data, index) => ({ ...obj, [ids[index].toHex()]: { index, data } }), {})
  }
  public getTranches = errorHandler(this._getTranches)

  private _getTrancheTokenPrices = async () => {
    logger.info(`Qerying RPC tranche token prices for pool ${this.pool.id}`)
    const poolId = new u64(api.registry, this.pool.id)
    let tokenPrices: Vec<u128>
    try {
      tokenPrices = await (api.rpc as ExtendedRpc).pools.trancheTokenPrices(poolId)
    } catch (err) {
      logger.error(`Unable to fetch tranche token prices for pool: ${this.pool.id}: ${err}`)
      tokenPrices = undefined
    }
    return tokenPrices
  }
  public getTrancheTokenPrices = errorHandler(this._getTrancheTokenPrices)

  private _getActiveLoanData = async () => {
    logger.info(`Querying active loan data for pool: ${this.pool.id}`)
    const loanDetails = await api.query.loans.activeLoans<Vec<PricedLoanDetails>>(this.pool.id)
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
  public getActiveLoanData = errorHandler(this._getActiveLoanData)
}

interface ActiveLoanData {
  [loanId: string]: { normalizedDebt: bigint; interestRate: bigint }
}

interface PoolTranches {
  [trancheId: string]: { index: number; data: TrancheDetails }
}
