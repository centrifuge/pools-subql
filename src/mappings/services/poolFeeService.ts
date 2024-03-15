import { PoolFeeStatus, PoolFeeType } from '../../types'
import { PoolFee } from '../../types/models'

export interface PoolFeeData {
  poolId: string
  feeId: string
  blockNumber: number
  timestamp: Date
  epochNumber: number
  hash: string
  amount?: bigint
}

export class PoolFeeService extends PoolFee {
  static init(data: PoolFeeData, type: keyof typeof PoolFeeType, status: keyof typeof PoolFeeStatus) {
    logger.info(`Initialising PoolFee ${data.feeId}`)
    const { poolId, feeId } = data
    const _type = PoolFeeType[type]
    const _status = PoolFeeStatus[status]

    const poolFee = new this(`${poolId}-${feeId}`, feeId, _type, _status, false, poolId)

    poolFee.sumChargedAmount = BigInt(0)
    poolFee.sumAccruedAmount = BigInt(0)
    poolFee.sumPaidAmount = BigInt(0)
    poolFee.pendingAmount = BigInt(0)
    poolFee.sumChargedAmountByPeriod = BigInt(0)
    poolFee.sumAccruedAmountByPeriod = BigInt(0)
    poolFee.sumPaidAmountByPeriod = BigInt(0)

    return poolFee
  }

  static async getOrInit(data: PoolFeeData, type: keyof typeof PoolFeeType, status: keyof typeof PoolFeeStatus) {
    const { poolId, feeId } = data
    let poolFee = (await this.get(`${poolId}-${feeId}`)) as PoolFeeService
    if (!poolFee) {
      poolFee = this.init(data, type, status)
    } else {
      poolFee.status = PoolFeeStatus[status]
    }
    return poolFee
  }

  static getById(poolId: string, feeId: string) {
    return this.get(`${poolId}-${feeId}`) as Promise<PoolFeeService>
  }

  static async propose(data: PoolFeeData, type: keyof typeof PoolFeeType) {
    logger.info(`Proposing PoolFee ${data.feeId}`)
    const poolFee = this.init(data, type, 'PROPOSED')
    return poolFee
  }

  static async add(data: PoolFeeData, type: keyof typeof PoolFeeType) {
    logger.info(`Adding PoolFee ${data.feeId}`)
    const poolFee = await this.getOrInit(data, type, 'ADDED')
    poolFee.isActive = true
    return poolFee
  }

  static async delete(data: PoolFeeData) {
    logger.info(`Removing PoolFee ${data.feeId}`)
    const { poolId, feeId } = data
    const poolFee = await this.get(`${poolId}-${feeId}`)
    if (!poolFee) throw new Error('Unable to remove PoolFee. PoolFee does not exist.')
    poolFee.isActive = false
    return poolFee
  }

  public charge(data: Omit<PoolFeeData, 'amount'> & Required<Pick<PoolFeeData, 'amount'>>) {
    logger.info(`Charging PoolFee ${data.feeId} with amount ${data.amount.toString(10)}`)
    if (!this.isActive) throw new Error('Unable to charge inactive PolFee')
    this.sumChargedAmount += data.amount
    this.sumChargedAmountByPeriod += data.amount
    this.pendingAmount += data.amount
    return this
  }

  public uncharge(data: Omit<PoolFeeData, 'amount'> & Required<Pick<PoolFeeData, 'amount'>>) {
    logger.info(`Uncharging PoolFee ${data.feeId} with amount ${data.amount.toString(10)}`)
    if (!this.isActive) throw new Error('Unable to uncharge inactive PolFee')
    this.sumChargedAmount -= data.amount
    this.sumChargedAmountByPeriod -= data.amount
    this.pendingAmount -= data.amount
    return this
  }

  public pay(data: Omit<PoolFeeData, 'amount'> & Required<Pick<PoolFeeData, 'amount'>>) {
    logger.info(`Paying PoolFee ${data.feeId} with amount ${data.amount.toString(10)}`)
    if (!this.isActive) throw new Error('Unable to payinactive PolFee')
    this.sumPaidAmount += data.amount
    this.sumPaidAmountByPeriod += data.amount
    this.pendingAmount -= data.amount
    return this
  }

  public updateAccruals(pending: bigint, disbursement: bigint) {
    logger.info(
      `Accruing PoolFee ${this.id} with amounts pending: ${pending.toString(10)} ` +
        `disbursement: ${disbursement.toString(10)}`
    )
    this.pendingAmount = pending + disbursement

    const newAccruedAmount = this.pendingAmount
    this.sumAccruedAmountByPeriod = newAccruedAmount - this.sumAccruedAmount
    this.sumAccruedAmount = newAccruedAmount
    return this
  }
}
