import { Account } from '../../types/models/Account'

export class AccountService {
  readonly account: Account

  constructor(account: Account) {
    this.account = account
  }

  static init = (address: string) => {
    logger.info(`Initialising new account: ${address}`)
    const account = new Account(address)
    return new AccountService(account)
  }

  static getById = async (address: string) => {
    const account = await Account.get(address)
    if (account === undefined) {
      return undefined
    } else {
      return new AccountService(account)
    }
  }

  static getOrInit = async (address: string) => {
    let account = await this.getById(address)
    if (account === undefined) {
      account = this.init(address)
      await account.save()
    }
    return account
  }

  save = async () => {
    await this.account.save()
  }
}
