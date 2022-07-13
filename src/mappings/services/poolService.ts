import { Option } from '@polkadot/types'
import { errorHandler } from '../../helpers/errorHandler'
import { NavDetails, PoolDetails, TrancheData } from '../../helpers/types'
import { Pool, PoolState } from '../../types'

export class PoolService {
  pool: Pool
  poolState: PoolState
  tranches: TrancheData | null

  constructor(pool: Pool, poolState: PoolState, tranches: TrancheData = null) {
    this.pool = pool
    this.poolState = poolState
    this.tranches = tranches
  }

  static init = async (poolId: string, timestamp: Date, blockNumber: number) => {
    const poolReq = await api.query.pools.pool<Option<PoolDetails>>(poolId)
    if (poolReq.isNone) throw new Error('No pool data available to create teh pool')
    const poolData = poolReq.unwrap()

    const poolState = new PoolState(poolId)

    poolState.type = 'ALL'
    poolState.netAssetValue = BigInt(0)
    poolState.totalReserve = BigInt(0)
    poolState.availableReserve = BigInt(0)
    poolState.maxReserve = BigInt(0)
    poolState.totalDebt = BigInt(0)

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

    pool.currency = poolData.currency.toString()
    pool.metadata = poolData.metadata.isSome ? poolData.metadata.unwrap().toUtf8() : 'NA'

    pool.minEpochTime = poolData.parameters.minEpochTime.toNumber()
    pool.maxNavAge = poolData.parameters.maxNavAge.toNumber()
    pool.currentEpoch = currentEpoch

    return new PoolService(pool, poolState, poolData.tranches)
  }

  static getById = async (poolId: string) => {
    const pool = await Pool.get(poolId)
    const poolState = await PoolState.get(poolId)
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

  public closeEpoch = (epochId: number) => {
    this.pool.lastEpochClosed = epochId
    this.pool.currentEpoch = epochId + 1
  }

  public executeEpoch = (epochId: number) => {
    this.pool.lastEpochExecuted = epochId
  }
}
