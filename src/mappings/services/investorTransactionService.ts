import { InvestorTransaction, InvestorTransactionType } from '../../types'

export class InvestorTransactionService {
  investorTransaction: InvestorTransaction

  constructor(investorTransaction: InvestorTransaction) {
    this.investorTransaction = investorTransaction
  }

  static init = (
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

    return new InvestorTransactionService(tx)
  }

  static initInvestOrder = (
    poolId: string,
    trancheId: string,
    epochId: number,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(poolId, trancheId, epochId, hash, InvestorTransactionType.INVEST_ORDER_UPDATE, amount, timestamp)
  }

  static initRedeemOrder = (
    poolId: string,
    trancheId: string,
    epochId: number,
    hash: string,
    amount: bigint,
    timestamp: Date
  ) => {
    return this.init(poolId, trancheId, epochId, hash, InvestorTransactionType.REDEEM_ORDER_UPDATE, amount, timestamp)
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
