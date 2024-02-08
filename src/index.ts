import '@polkadot/api-augment'
import { atob } from 'abab'
import type { u64 } from '@polkadot/types'
import type { Provider } from '@ethersproject/providers'

const cfgChainIdProm = 'query' in api ? (api.query.evmChainId.chainId() as Promise<u64>) : null
const ethNetworkProm =
  typeof (api as unknown as Provider).getNetwork === 'function' ? (api as unknown as Provider).getNetwork() : null

global.atob = atob
global.getNodeChainId = async function () {
  if (cfgChainIdProm) return (await cfgChainIdProm).toString(10)
  if (ethNetworkProm) return (await ethNetworkProm).chainId.toString(10)
}

export * from './mappings/handlers/blockHandlers'
export * from './mappings/handlers/poolsHandlers'
export * from './mappings/handlers/investmentsHandlers'
export * from './mappings/handlers/loansHandlers'
export * from './mappings/handlers/proxyHandlers'
export * from './mappings/handlers/ormlTokensHandlers'
export * from './mappings/handlers/logHandlers'
export * from './mappings/handlers/evmHandlers'
export * from './mappings/handlers/ethHandlers'
