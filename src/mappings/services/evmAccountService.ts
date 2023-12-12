import { EvmAccount } from '../../types/models/EvmAccount'

export class EvmAccountService extends EvmAccount {
  static init(address: string) {
    const evmAddress = address.substring(0,42)
    const chainId = parseInt(address.slice(-12, -8), 16)
    logger.info(`Initialising new evmAccount: ${evmAddress} chainId: ${chainId}`)
    return new this(evmAddress, address, chainId)
  }

  static async getOrInit(address: string): Promise<EvmAccountService> {
    let account = await this.get(address) as EvmAccountService
    if (account === undefined) {
      account = this.init(address)
      await account.save()
    }
    return account as EvmAccountService
  }

  static convertToSubstrate(evmAddress: string, chainId: number) {
    // Bytes EVM\0 as suffix
    const suffix = '45564d00'
    const chainHex = chainId.toString(16).padStart(4, '0')
    return `0x${evmAddress.substring(2).toLowerCase()}000000000000${chainHex}${suffix}`
  }
}
