import { SubstrateBlock } from "@subql/types"
import { SNAPSHOT_INTERVAL_SECONDS } from "../config"

export class MemTimekeeper {
  constructor(lastPeriodStart: Date) {
    this._currentPeriodStart = lastPeriodStart
  }
  private _currentPeriodStart: Date = null
  public getCurrentPeriod = ():Date => (this._currentPeriodStart)
  public processBlock = (block: SubstrateBlock): boolean => {
    const blockPeriodStart = getPeriodStart(block.timestamp)
    const isNewPeriod = blockPeriodStart.valueOf() > this._currentPeriodStart.valueOf()
    if (isNewPeriod) this._currentPeriodStart = blockPeriodStart
    return isNewPeriod
  }
}

export function getPeriodStart(timestamp: Date): Date {
  const timestampSec = timestamp.valueOf() / 1000
  const periodStartTimestampSec = timestampSec - timestampSec % SNAPSHOT_INTERVAL_SECONDS
  return new Date(periodStartTimestampSec * 1000)
  
}