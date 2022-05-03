import { SubstrateBlock } from '@subql/types'
import { BLOCK_TIME_SECONDS, SECONDS_PER_HOUR, SECONDS_PER_DAY } from '../config'
import { Pool, PoolState, HourlyPoolState, DailyPoolState } from '../types'

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockTimeSec = block.timestamp.getTime() / 1000

  // This is imperfect if block time isn't consistent. However, the alternative is querying db
  // to check the last saved daily state, which significantly slows down every handleBlock call.
  // For now, we assume this is sufficient, but we need to double check in production if some days
  // are skipped.
  //
  // TODO: we could probably address this by querying the db within n x BLOCK_TIME_SECONDS.
  if (blockTimeSec % SECONDS_PER_HOUR <= BLOCK_TIME_SECONDS) {
    // A new hour has started
    const pools = await Pool.getByType('POOL')

    for (let pool of pools) {
      const result = await api.query.pools.pool(pool.id.toString())
      const poolData = result.toJSON() as any

      const navResult = await api.query.loans.poolNAV(pool.id.toString())
      const nav = navResult.toJSON() as any

      let poolState = new PoolState(`${pool.id.toString()}-${blockTimeSec.toString()}`)
      poolState.netAssetValue = BigInt(nav !== null ? nav.latest.toString() : 0)
      poolState.totalReserve = BigInt(poolData.reserve.total.toString())
      poolState.availableReserve = BigInt(poolData.reserve.available.toString())
      poolState.maxReserve = BigInt(poolData.reserve.max.toString())
      await poolState.save()

      let hourlyPoolState = new HourlyPoolState(`${pool.id.toString()}-${blockTimeSec.toString()}`)
      hourlyPoolState.timestamp = block.timestamp
      hourlyPoolState.poolStateId = poolState.id
      await hourlyPoolState.save()

      if (blockTimeSec % SECONDS_PER_DAY <= BLOCK_TIME_SECONDS) {
        // A new day has started as well
        let dailyPoolState = new DailyPoolState(`${pool.id.toString()}-${blockTimeSec.toString()}`)
        dailyPoolState.timestamp = block.timestamp
        dailyPoolState.poolStateId = poolState.id
        await dailyPoolState.save()
      }
    }
  }
}
