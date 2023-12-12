import { Entity } from '@subql/types-core'
import { Account } from '../../types/models/Account'

export class AccountService extends Account {
  static init(address: string) {
    logger.info(`Initialising new account: ${address}`)
    return new this(address)
  }

  static async getOrInit<T extends Entity>(
    address: string,
    evmAccountService?: AccountEntity<T>
  ): Promise<AccountService> {
    let account = (await this.get(address)) as AccountService
    if (account === undefined) {
      account = this.init(address)
      await account.save()
      if (evmAccountService && account.isEvm()) await evmAccountService.getOrInit(address)
    }
    return account
  }

  public isEvm() {
    const suffix = '45564d00'
    return this.id.length === 66 && this.id.endsWith(suffix)
  }
}

interface AccountEntity<T extends Entity> {
  getOrInit(address: string): Promise<T>
}
