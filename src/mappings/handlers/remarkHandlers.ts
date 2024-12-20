import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { RemarkEvent } from '../../helpers/types'

export const handleRemark = errorHandler(_handleRemark)
async function _handleRemark(event: SubstrateEvent<RemarkEvent>) {
  const [_remarks] = event.event.data

  for (let i = 0; i <= _remarks.length; i++) {
    const remark = _remarks[i]

    if (remark.isNamed) {
      logger.info(`Remark fired for ${remark.asNamed}` + `at block ${event.block.block.header.number.toNumber()}`)

      const isAttestation = remark.asNamed.split(':')[0]
      const poolId = remark.asNamed.split(':')[1]
      const attestation = remark.asNamed.split(':')[2]

      if (isAttestation) {
        logger.info(
          `Attestation fired for ${poolId}: ${attestation}` + `at block ${event.block.block.header.number.toNumber()}`
        )
      }
    }
  }
}
