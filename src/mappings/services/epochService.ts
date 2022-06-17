import { Epoch } from '../../types'

export class EpochService {
  epoch: Epoch

  constructor(epoch: Epoch) {
    this.epoch = epoch
  }

  static init = async (poolId: string, epochId: number, timestamp: Date) => {
    const epoch = new Epoch(`${poolId}-${epochId.toString()}`)

    epoch.index = epochId
    epoch.poolId = poolId

    epoch.openedAt = timestamp

    return new EpochService(epoch)
  }

  static getById = async (epochId: string) => {
    const epoch = await Epoch.get(epochId)
    return new EpochService(epoch)
  }

  save = () => {
    return this.epoch.save()
  }

  public closeEpoch = (timestamp: Date) => {
    this.epoch.closedAt = timestamp
  }

  public executeEpoch = (timestamp: Date) => {
    this.epoch.executedAt = timestamp
  }
}
