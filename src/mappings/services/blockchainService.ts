import { Blockchain } from '../../types/models/Blockchain'

export const LOCAL_CHAIN_ID = '0'
//import { u64 } from '@polkadot/types'
export class BlockchainService extends Blockchain {
  static init(chainId: string) {
    logger.info(`Initialising new blockchain with Id ${chainId}`)
    return new this(chainId)
  }

  static async getOrInit(_chainId: string) {
    let blockchain = await this.get(_chainId)
    if (!blockchain) {
      blockchain = this.init(_chainId)
      await blockchain.save()
    }
    return blockchain as BlockchainService
  }
}
