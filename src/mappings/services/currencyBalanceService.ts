import { ApiAt } from '../../@types/gobal'
import { AccountData } from '../../helpers/types'
import { CurrencyBalance } from '../../types/models/CurrencyBalance'
import { formatEnumPayload } from './currencyService'

const cfgApi = api as ApiAt

export class CurrencyBalanceService extends CurrencyBalance {
  static init(address: string, currency: string) {
    logger.info(`Initialising new CurrencyBalance: ${address}-${currency} to 0`)
    const currencyBalance = new this(`${address}-${currency}`, address, currency, BigInt(0))
    return currencyBalance
  }

  static async getById(address: string, currency: string) {
    const id = `${address}-${currency}`
    const currencyBalance = await this.get(id)
    return currencyBalance as CurrencyBalanceService
  }

  static async getOrInit(address: string, currency: string) {
    let currencyBalance = await this.getById(address, currency)
    if (!currencyBalance) {
      currencyBalance = this.init(address, currency)
      await currencyBalance.save()
    }
    return currencyBalance
  }

  public async getBalance() {
    const [_chainId, currencyType, ...currencySpec] = this.currencyId.split('-')
    const enumPayload = formatEnumPayload(currencyType, ...currencySpec)
    const balanceResponse = await cfgApi.query.ormlTokens.accounts<AccountData>(this.accountId, enumPayload)
    this.amount = balanceResponse.free.toBigInt()
    logger.info(`Fetched initial balance of for CurrencyBalance ${this.id} of ${this.amount.toString(10)}`)
  }

  public credit(amount: bigint) {
    logger.info(
      `Crediting CurrencyBalance ${this.id} with balance: ${this.amount.toString(10)} for amount: ${amount.toString(
        10
      )}`
    )
    this.amount += amount
  }

  public debit(amount: bigint) {
    logger.info(
      `Debiting CurrencyBalance ${this.id} with balance: ${this.amount.toString(10)} for amount: ${amount.toString(10)}`
    )
    this.amount -= amount
  }
}
