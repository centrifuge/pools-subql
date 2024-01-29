import { Blockchain } from '../../types/models/Blockchain'
//import { u64 } from '@polkadot/types'
export class BlockchainService extends Blockchain {
  static init(chainId: string) {
    logger.info(`Initialising new blockchain with evm Id ${chainId}`)
    return new this(chainId)
  }

  static async getOrInit(_chainId?: string) {
    const chainId = _chainId ?? await getNodeChainId()//(await this.getThisChainId())
    let blockchain = await this.get(chainId)
    if (!blockchain) {
      blockchain = this.init(chainId)
      await blockchain.save()
    }
    return blockchain as BlockchainService
  }

  // static async getThisChainId() {
  //   return ((await api.query.evmChainId.chainId()) as u64).toString(10)
  // }
}
