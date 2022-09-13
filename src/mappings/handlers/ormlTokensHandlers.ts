import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { TokensTransferEvent } from '../../helpers/types'
import { CurrencyService } from '../services/currencyService'
import { InvestorTransactionService } from '../services/investorTransactionService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'

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
    const tranche = await TrancheService.getById(poolId.toString(), trancheId.toHex())

    // Update tranche price
    await tranche.updatePriceFromRpc()
    await tranche.save()

    const orderData = {
      poolId: poolId.toString(),
      trancheId: trancheId.toString(),
      epochNumber: pool.pool.currentEpoch,
      hash: event.extrinsic.extrinsic.hash.toString(),
      timestamp: event.block.timestamp,
      digits: (await CurrencyService.getById(pool.pool.currencyId)).currency.decimals,
      price: tranche.trancheState.price,
      amount: amount.toBigInt(),
    }

    // CREATE 2 TRANSFERS FOR FROM AND TO ADDRESS
    // with from create TRANSFER_OUT
    const txOut = InvestorTransactionService.transferOut({ ...orderData, address: from.toString() })
    await txOut.save()

    // with to create TRANSFER_IN
    const txIn = InvestorTransactionService.transferIn({ ...orderData, address: to.toString() })
    await txIn.save()
  }
}
