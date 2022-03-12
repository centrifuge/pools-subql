import { SubstrateBlock } from "@subql/types";
import { BLOCK_TIME_SECONDS, SECONDS_PER_DAY } from "../config";
import { Pool, PoolState, DailyPoolState } from "../types";

export async function handleBlock(block: SubstrateBlock): Promise<void> {
  const blockTimeSec = block.timestamp.getTime() / 1000;

  if (blockTimeSec % SECONDS_PER_DAY <= BLOCK_TIME_SECONDS) {
    const pools = await Pool.getByType("POOL");
    logger.info(
      `It\'s a new day: ${block.timestamp}: there are ${pools.length} pools.`
    );

    pools.forEach(async (pool: Pool) => {
      logger.info(`Pool ${pool.id}: ${JSON.stringify(pool)}`);
      let dailyPoolState = new DailyPoolState(
        `${pool.id}-${blockTimeSec.toString()}`
      );
      dailyPoolState.timestamp = block.timestamp;
      dailyPoolState.poolStateId = pool.currentStateId;
      await dailyPoolState.save();
    });
  }
}
