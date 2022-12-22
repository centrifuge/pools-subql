import { Account } from '../../types/models/Account'

export class AccountService extends Account {
  static init(address: string) {
    logger.info(`Initialising new account: ${address}`)
    return new this(address)
  }

  static async getOrInit(address: string): Promise<AccountService> {
    let account = await this.get(address)
    if (account === undefined) {
      account = this.init(address)
      await account.save()
    }
    return account as AccountService
  }
}
