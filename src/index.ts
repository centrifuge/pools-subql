import '@polkadot/api-augment'
import fetch from 'node-fetch'
import { atob } from 'abab'
import type { u64 } from '@polkadot/types'
import type { Provider } from '@ethersproject/providers'

const isSubstrateNode = 'query' in api
const isEvmNode = typeof (api as unknown as Provider).getNetwork === 'function'
const ethNetworkProm = isEvmNode ? (api as unknown as Provider).getNetwork() : null

global.fetch = fetch as unknown as typeof global.fetch
global.atob = atob
global.getNodeEvmChainId = async function () {
  if (isSubstrateNode) return ((await api.query.evmChainId.chainId()) as u64).toString(10)
  if (isEvmNode) return (await ethNetworkProm).chainId.toString(10)
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
export * from './mappings/handlers/poolFeesHandlers'
