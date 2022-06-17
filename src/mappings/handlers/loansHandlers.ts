import { SubstrateEvent } from '@subql/types'
import { LoanEvent } from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'

export const handleBorrowings = errorHandler(_handleBorrowings)
async function _handleBorrowings(event: SubstrateEvent): Promise<void> {
  const [poolId, , amount] = event.event.data as unknown as LoanEvent
  logger.info(`Pool: ${poolId.toString()} borrowed ${amount.toString()}`)
  const poolService = await PoolService.getById(poolId.toString())
  await poolService.increaseTotalBorrowings(amount.toBigInt())
  await poolService.save()
}
