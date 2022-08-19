import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { TokensTransferEvent } from '../../helpers/types'
import { InvestorTransactionService } from '../services/investorTransactionService'
import { PoolService } from '../services/poolService'

export const handleTokenTransfer = errorHandler(_handleTokenTransfer)
async function _handleTokenTransfer(event: SubstrateEvent<TokensTransferEvent>): Promise<void> {
  const [currency, from, to, amount] = event.event.data

  if (currency.isTranche) {
    const [poolId, trancheId] = currency.asTranche

    const fromId = String.fromCharCode(...from.toU8a())
    const toId = String.fromCharCode(...to.toU8a())

    // FILTER OUT ALL TRANSACTIONS CONTAINING A POOL ADDRESS
    if (fromId.startsWith('pool') || toId.startsWith('pool')) return

    logger.info(
      `Token transfer tor tranche: ${poolId.toString()}-${trancheId.toString()}.
      from: ${from.toString()} to: ${to.toString()} amount: ${amount.toString()}
      at block ${event.block.block.header.number.toString()}`
    )

    // Get corresponding pool
    const pool = await PoolService.getById(poolId.toString())

    // CREATE 2 TRANSFERS FOR FROM AND TO ADDRESS
    // with from create TRANSFER_OUT
    const txOut = InvestorTransactionService.transferOut(
      poolId.toString(),
      trancheId.toString(),
      pool.pool.currentEpoch,
      from.toString(),
      event.extrinsic.extrinsic.hash.toString(),
      amount.toBigInt(),
      event.block.timestamp
    )
    await txOut.save()

    // with to create TRANSFER_IN
    const txIn = InvestorTransactionService.transferIn(
      poolId.toString(),
      trancheId.toString(),
      pool.pool.currentEpoch,
      to.toString(),
      event.extrinsic.extrinsic.hash.toString(),
      amount.toBigInt(),
      event.block.timestamp
    )
    await txIn.save()
  }
}
