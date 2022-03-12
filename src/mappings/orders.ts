import { SubstrateEvent } from "@subql/types";
// import { Epoch, Pool, PoolState, Tranche } from "../types";

export async function handleInvestOrderUpdated(
  event: SubstrateEvent
): Promise<void> {
  logger.info(`Invest order updated: ${event.toString()}`);
}
