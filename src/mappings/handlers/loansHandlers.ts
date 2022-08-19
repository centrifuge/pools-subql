import { SubstrateEvent } from '@subql/types'
import { LoanBorrowedEvent } from '../../helpers/types'
import { errorHandler } from '../../helpers/errorHandler'
import { PoolService } from '../services/poolService'

export const handleBorrowings = errorHandler(_handleBorrowings)
async function _handleBorrowings(event: SubstrateEvent<LoanBorrowedEvent>): Promise<void> {
  const [poolId, , amount] = event.event.data
  logger.info(`Pool: ${poolId.toString()} borrowed ${amount.toString()}`)
  const poolService = await PoolService.getById(poolId.toString())
  await poolService.increaseTotalBorrowings(amount.toBigInt())
  await poolService.save()
}
