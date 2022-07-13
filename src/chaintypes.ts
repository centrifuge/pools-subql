import type { OverrideBundleDefinition } from '@polkadot/types/types'

/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      // on all versions
      minmax: [0, undefined],
      types: {
        ParachainAccountIdOf: 'AccountId',
        Proof: {
          leafHash: 'Hash',
          sortedHashes: 'Vec<Hash>',
        },
        ProxyType: {
          _enum: ['Any', 'NonTransfer', 'Governance', '_Staking', 'NonProxy'],
        },
        RelayChainAccountId: 'AccountId',
        RootHashOf: 'Hash',
        PoolDetails: {
          currency: 'TokensCurrencyId',
          tranches: 'TrancheTranches',
          parameters: 'PoolParameters',
          metadata: 'Option<Bytes>',
          epoch: 'EpochState',
          reserve: 'ReserveDetails',
        },
        TokensCurrencyId: {
          _enum: {
            Native: 'Null',
            Usd: 'Null',
            Tranche: '(u64,[u8;16])',
            KSM: 'Null',
            KUSD: 'Null',
          },
        },
        TrancheTranches: {
          tranches: 'Vec<PalletPoolsTranche>',
          ids: 'Vec<[u8;16]>',
          salt: '(u64,u64)',
        },
        PoolParameters: {
          minEpochTime: 'u64',
          maxNavAge: 'u64',
        },
        EpochState: {
          current: 'u32',
          lastClosed: 'u64',
          lastExecuted: 'u32',
        },
        ReserveDetails: {
          max: 'u128',
          total: 'u128',
          available: 'u128',
        },
      },
    },
  ],
  rpc: {
    pools: {
      trancheTokenPrices: {
        description: 'Retrieve prices for all tranches',
        params: [
          {
            name: 'pool_id',
            type: 'u64',
            //            isHistoric: true,
            isOptional: false,
          },
        ],
        type: 'Option<Vec<BalanceRatio>>',
      },
      trancheTokenPrice: {
        description: 'Retrieve prices for a tranche',
        params: [
          {
            name: 'pool_id',
            type: 'u64',
            isOptional: false,
          },
          {
            name: 'tranche',
            type: '(u64,[u8;16])',
            isOptional: false,
          },
        ],
        type: 'Option<BalanceRatio>',
      },
    },
  },
}

export default { typesBundle: { spec: { 'centrifuge-devel': definitions, altair: definitions } } }
