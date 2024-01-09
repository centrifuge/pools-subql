import { Account } from '../../types/models/Account'
import { BlockchainService } from './blockchainService'

const EVM_SUFFIX = '45564d00'

export class AccountService extends Account {
  static async init(address: string, blockchainService = BlockchainService) {
    logger.info(`Initialising new account: ${address}`)
    if (this.isEvm(address)) {
      const chainId = this.readEvmChainId(address)
      const account = new this(address, chainId)
      account.evmAddress = address.substring(0, 42)
      return account
    } else {
      return new this(address, await blockchainService.getThisChainId())
    }
  }

  static async getOrInit(address: string, blockchainService = BlockchainService): Promise<AccountService> {
    let account = (await this.get(address)) as AccountService
    if (account === undefined) {
      account = await this.init(address)
      await blockchainService.getOrInit(account.chainId)
      await account.save()
    }
    return account
  }

  static evmToSubstrate(evmAddress: string, chainId: string) {
    const chainHex = parseInt(chainId,10).toString(16).padStart(4, '0')
    return `0x${evmAddress.substring(2).toLowerCase()}000000000000${chainHex}${EVM_SUFFIX}`
  }

  static readEvmChainId(address: string) {
    return parseInt(address.slice(-12, -8), 16).toString(10)
  }

  static isEvm(address: string) {
    return address.length === 66 && address.endsWith(EVM_SUFFIX)
  }

  public isEvm() {
    return AccountService.isEvm(this.id)
  }
}
