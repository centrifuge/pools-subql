import type { OverrideBundleDefinition } from '@polkadot/types/types'

/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  rpc: {
    pools: {
      trancheTokenPrices: {
        description: 'Retrieve prices for all tranches',
        params: [
          {
            name: 'poolId',
            type: 'u64',
            isOptional: false,
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: false,
          },
        ],
        type: 'Vec<u128>',
      },
      trancheTokenPrice: {
        description: 'Retrieve prices for a tranche',
        params: [
          {
            name: 'poolId',
            type: 'u64',
            isOptional: false,
          },
          {
            name: 'trancheId',
            type: '[u8;16]',
            isOptional: false,
          },
          {
            name: 'at',
            type: 'BlockHash',
            isHistoric: true,
            isOptional: false,
          },
        ],
        type: 'u128',
      },
    },
  },
}

export default {
  typesBundle: { spec: { 'centrifuge-devel': definitions, altair: definitions, centrifuge: definitions } },
}
