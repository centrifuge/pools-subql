import { InvestorTransaction, InvestorTransactionType } from '../../types'

export class InvestorTransactionService {
  investorTransaction: InvestorTransaction

  constructor(investorTransaction: InvestorTransaction) {
    this.investorTransaction = investorTransaction
  }

  static init = async (
    poolId: string,
    trancheId: string,
    epochId: number,
    hash: string,
    type: InvestorTransactionType,
    amount: bigint,
    timestamp: Date
  ) => {
    const tx = new InvestorTransaction(hash)
    // tx.accountId = account.id
    tx.poolId = poolId.toString()
    tx.epochId = `${poolId}-${epochId.toString()}`
    tx.trancheId = `${poolId}-${trancheId}`
    tx.timestamp = timestamp
    tx.type = type

    // Invest orders are submitted in the currency amount, while redeem orders are submitted in the token amount
    tx.currencyAmount = type === InvestorTransactionType.INVEST_ORDER_UPDATE ? amount : BigInt(0)
    tx.tokenAmount = type === InvestorTransactionType.REDEEM_ORDER_UPDATE ? amount : BigInt(0)

    // Create outstanding order so we can check which were fulfilled in the epoch execute handler
    // eslint-disable-next-line max-len
    // let outstandingOrder = await loadOrCreateOutstandingOrder(poolId.toString(), trancheId.toString(), address.toString())
    // outstandingOrder.invest = BigInt(
    //   type === InvestorTransactionType.INVEST_ORDER_UPDATE ? BigInt(amount.toString()) : outstandingOrder.invest
    // )
    // outstandingOrder.redeem = BigInt(
    //   type === InvestorTransactionType.REDEEM_ORDER_UPDATE ? BigInt(amount.toString()) : outstandingOrder.redeem
    // )
    // outstandingOrder.epochId = pool.currentEpoch.toString()
    // await outstandingOrder.save(

    return new InvestorTransactionService(tx)
  }

  save = async () => {
    await this.investorTransaction.save()
    return this
  }

  static getById = async (hash: string) => {
    const tx = await InvestorTransaction.get(hash)
    return new InvestorTransactionService(tx)
  }
}
