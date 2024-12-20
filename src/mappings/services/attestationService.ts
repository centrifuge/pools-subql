import { Attestation } from '../../types/models/Attestation'

export class AttestationService extends Attestation {
  static async init(poolId: string, data: string, timestamp: Date) {
    logger.info(`Initialising new attestation for pool ${poolId}: ${data}`)
    return new this(poolId, timestamp, data)
  }
}
