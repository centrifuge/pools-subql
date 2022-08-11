import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { RestrictedTokensEvent } from '../../helpers/types'
import { InvestorTransactionService } from '../services/investorTransactionService'
import { PoolService } from '../services/poolService'

export const handleTokenTransfer = errorHandler(_handleTokenTransfer)
async function _handleTokenTransfer(event: SubstrateEvent): Promise<void> {
  const [currency, from, to, amount] = event.event.data as unknown as RestrictedTokensEvent

  if (currency.isTranche) {
    const [poolId, trancheId] = currency.asTranche

    const fromId = String.fromCharCode(...from.toU8a())
    const toId = String.fromCharCode(...to.toU8a())

    logger.info(
      `Token transfer tor tranche: ${poolId.toString()}-${trancheId.toString()}.
      from: ${fromId} to: ${toId} amount: ${amount.toString()}
      at block ${event.block.block.header.number.toString()}`
    )

    const address = fromId.startsWith('pool') ? to : from

    // Get corresponding pool
    const pool = await PoolService.getById(poolId.toString())

    const orderData: [string, string, number, string, string, bigint, Date] = [
      poolId.toString(),
      trancheId.toString(),
      pool.pool.currentEpoch,
      address.toString(),
      event.extrinsic.extrinsic.hash.toString(),
      amount.toBigInt(),
      event.block.timestamp,
    ]

    // if fromId starts with pool TRANSFER_OUT
    if (fromId.startsWith('pool')) {
      const tx = InvestorTransactionService.transferOut(...orderData)
      await tx.save()
    } else {
      // else tTRANSFER_IN
      const tx = InvestorTransactionService.transferIn(...orderData)
      await tx.save()
    }
  }
}
