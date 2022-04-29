import { Timekeeper } from "../types"
import { SNAPSHOT_INTERVAL_SECONDS } from "../config"

export class MemTimekeeper {
  constructor(lastBlockTimestamp: Date) {
    const lastBlockTimestampSec = lastBlockTimestamp.valueOf() / 1000
    this._currentPeriodStart = lastBlockTimestampSec - lastBlockTimestampSec % SNAPSHOT_INTERVAL_SECONDS
  }
  private _currentPeriodStart: number = null

  public getCurrentPeriod = ():number => (this._currentPeriodStart)
  public setCurrentPeriod = (val: number):void => { this._currentPeriodStart = val }
}

export async function timekeeperStarter() {
  let lastBlockTimestamp:Date
  try {
    lastBlockTimestamp = (await Timekeeper.get('timekeeper')).lastBlockTimestamp
  } catch (error) {
    lastBlockTimestamp = new Date(0)
  }
  return new MemTimekeeper(lastBlockTimestamp)
}