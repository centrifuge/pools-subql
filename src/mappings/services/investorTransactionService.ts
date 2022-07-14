import { bnToBn, nToBigInt } from '@polkadot/util'
import { InvestorTransaction, InvestorTransactionType } from '../../types'

export class InvestorTransactionService {
  investorTransaction: InvestorTransaction

  constructor(investorTransaction: InvestorTransaction) {
    this.investorTransaction = investorTransaction
  }

  static init = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    type: InvestorTransactionType,
    amount: bigint,
    timestamp: Date
  ) => {
    const tx = new InvestorTransaction(`${hash}-${type.toString().charAt(0)}`)
    tx.hash = hash
    tx.accountId = address
    tx.poolId = poolId.toString()
    tx.epochNumber = epochNumber
    tx.trancheId = `${poolId}-${trancheId}`
    tx.timestamp = timestamp
    tx.type = type

    // Invest orders are submitted in the currency amount, while redeem orders are submitted in the token amount
    tx.currencyAmount = type === InvestorTransactionType.INVEST_EXECUTION ? amount : BigInt(0)
    tx.tokenAmount = type === InvestorTransactionType.REDEEM_EXECUTION ? amount : BigInt(0)

    return new InvestorTransactionService(tx)
  }

  static initInvestOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    fulfillmentRate: bigint,
    timestamp: Date
  ) => {
    return this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.INVEST_EXECUTION,
      nToBigInt(
        bnToBn(amount)
          .mul(bnToBn(fulfillmentRate))
          .div(bnToBn(10).pow(bnToBn(18)))
      ),
      timestamp
    )
  }

  static initRedeemOrder = (
    poolId: string,
    trancheId: string,
    epochNumber: number,
    address: string,
    hash: string,
    amount: bigint,
    fulfillmentRate: bigint,
    timestamp: Date
  ) => {
    return this.init(
      poolId,
      trancheId,
      epochNumber,
      address,
      hash,
      InvestorTransactionType.REDEEM_EXECUTION,
      nToBigInt(
        bnToBn(amount)
          .mul(bnToBn(fulfillmentRate))
          .div(bnToBn(10).pow(bnToBn(18)))
      ),
      timestamp
    )
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
