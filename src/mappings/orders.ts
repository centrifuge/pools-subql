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

  const pool = await Pool.get(poolId.toString())

  // const account = await loadOrCreateAccount(address.toString());

  let tx = new InvestorTransaction(event.hash.toString())
  // tx.accountId = account.id;
  tx.poolId = poolId.toString()
  tx.epochId = pool.currentEpochId
  tx.timestamp = event.block.timestamp
  tx.type = type
  tx.currencyAmount = BigInt(0) // TODO: get from event once those are updated
  await tx.save()
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
