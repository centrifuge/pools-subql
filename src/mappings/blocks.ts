import { SubstrateBlock } from '@subql/types'
import { BLOCK_TIME_SECONDS, SECONDS_PER_DAY } from '../config'
import { Pool, PoolState, DailyPoolState } from '../types'

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockTimeSec = block.timestamp.getTime() / 1000

  // This is imperfect if block time isn't consistent. However, the alternative is querying db
  // to check the last saved daily state, which significantly slows down every handleBlock call.
  // For now, we assume this is sufficient, but we need to double check in production if some days
  // are skipped.
  //
  // TODO: we could probably address this by querying the db within n x BLOCK_TIME_SECONDS.
  if (blockTimeSec % SECONDS_PER_DAY <= BLOCK_TIME_SECONDS) {
    const pools = await Pool.getByType('POOL')
    logger.info(`It\'s a new day: ${block.timestamp}: there are ${pools.length} pools.`)

    pools.forEach(async (pool: Pool) => {
      logger.info(`Pool ${pool.id}: ${JSON.stringify(pool)}`)
      let dailyPoolState = new DailyPoolState(`${pool.id}-${blockTimeSec.toString()}`)
      dailyPoolState.timestamp = block.timestamp
      dailyPoolState.poolStateId = pool.currentStateId
      await dailyPoolState.save()
    })
  }
}
