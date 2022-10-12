import { errorHandler } from '../../helpers/errorHandler'
import { AccountData } from '../../helpers/types'
import { CurrencyBalance } from '../../types/models/CurrencyBalance'

export class CurrencyBalanceService {
  readonly currencyBalance: CurrencyBalance

  constructor(currencyBalance: CurrencyBalance) {
    this.currencyBalance = currencyBalance
  }

  static init = (address: string, currency: string) => {
    logger.info(`Initialising new CurrencyBalance: ${address}-${currency}`)
    const currencyBalance = new CurrencyBalance(`${address}-${currency}`)
    currencyBalance.accountId = address
    currencyBalance.currencyId = currency
    currencyBalance.amount = BigInt(0)
    return new CurrencyBalanceService(currencyBalance)
  }

  static getById = async (address: string, currency: string) => {
    const currencyBalance = await CurrencyBalance.get(`${address}-${currency}`)
    if (currencyBalance === undefined) {
      return undefined
    } else {
      return new CurrencyBalanceService(currencyBalance)
    }
  }

  static getOrInit = async (address: string, currency: string) => {
    let currencyBalance = await this.getById(address, currency)
    if (currencyBalance === undefined) {
      currencyBalance = this.init(address, currency)
      await currencyBalance.getBalance()
      await currencyBalance.save()
    }
    return currencyBalance
  }

  private _getBalance = async () => {
    const balanceResponse = await api.query.ormlTokens.accounts<AccountData>(
      this.currencyBalance.accountId,
      this.currencyBalance.currencyId
    )
    this.currencyBalance.amount = balanceResponse.free.toBigInt()
  }
  public getBalance = errorHandler(this._getBalance)

  public save = async () => {
    await this.currencyBalance.save()
  }

  public credit = (amount: bigint) => {
    this.currencyBalance.amount += amount
  }

  public debit = (amount: bigint) => {
    this.currencyBalance.amount -= amount
  }
}
