import { SubstrateEvent } from '@subql/types'
import { Pool, InvestorTransaction, Account, InvestorTransactionType } from '../types'

export async function handleInvestOrderUpdated(event: SubstrateEvent): Promise<void> {
  logger.info(`Invest order updated: ${event.toString()}`)
  handleOrderUpdated(event, InvestorTransactionType.INVEST_ORDER_UPDATE)
}

export async function handleRedeemOrderUpdated(event: SubstrateEvent): Promise<void> {
  logger.info(`Redeem order updated: ${event.toString()}`)
  handleOrderUpdated(event, InvestorTransactionType.REDEEM_ORDER_UPDATE)
}

const handleOrderUpdated = async (event: SubstrateEvent, type: InvestorTransactionType) => {
  const [poolId, address] = event.event.data
  const [_1, _2, amount] = event.extrinsic?.extrinsic.args

  const pool = await Pool.get(poolId.toString())

  // const account = await loadOrCreateAccount(address.toString());

  const trancheId = 0 // TODO: this should come from the event
  const result = await api.query.pools.order({ Tranche: [poolId, trancheId] }, address.toString())
  const order = result.toJSON() as any
  logger.info(`Order: ${JSON.stringify(order)}`)

  let tx = new InvestorTransaction(event.hash.toString())

  // tx.accountId = account.id;
  tx.poolId = poolId.toString()
  tx.epochId = `${poolId.toString()}-${pool.currentEpoch}`
  tx.trancheId = `${poolId.toString()}-${trancheId.toString()}`
  tx.timestamp = event.block.timestamp
  tx.type = type

  // Invest orders are submitted in the currency amount, while redeem orders are submitted in the token amount
  tx.currencyAmount = BigInt(type === InvestorTransactionType.INVEST_ORDER_UPDATE ? BigInt(amount.toString()) : 0)
  tx.tokenAmount = BigInt(type === InvestorTransactionType.REDEEM_ORDER_UPDATE ? BigInt(amount.toString()) : 0)

  await tx.save()

  // TODO: create OutstandingOrder
}

const loadOrCreateAccount = async (address: string) => {
  const account = await Account.get(address)

  if (!account) {
    let account = new Account(address)
    account.publicAddress = address
    await account.save()
    return account
  }

  return account
}
