import { ApiPromise } from '@polkadot/api'
import type { Provider } from '@ethersproject/providers'
import { ApiDecoration } from '@polkadot/api/types'
import '@subql/types-core/dist/global'
export type ApiAt = ApiDecoration<'promise'> & {
  rpc: ApiPromise['rpc']
}
declare global {
  const api: ApiAt | Provider
  const unsafeApi: ApiPromise | undefined
  function getNodeEvmChainId(): Promise<string | undefined>
}
export {}
