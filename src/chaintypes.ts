import type { OverrideBundleDefinition } from '@polkadot/types/types'

/* eslint-disable sort-keys */

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [undefined, undefined],
      types: {
        ActiveLoanInfo: {
          activeLoan: 'PalletLoansEntitiesLoansActiveLoan',
          presentValue: 'Balance',
          outstandingPrincipal: 'Balance',
          outstandingInterest: 'Balance',
        },
        PoolNav: {
          navAum: 'Balance',
          navFees: 'Balance',
          reserve: 'Balance',
          total: 'Balance',
        },
        PoolFeesOfBucket: {
          bucket: 'CfgTraitsFeePoolFeeBucket',
          fees: ' Vec<CfgTypesPoolsPoolFee>',
        },
        PoolFeesList: 'Vec<PoolFeesOfBucket>',
      },
    },
  ],
  runtime: {
    LoansApi: [
      {
        methods: {
          portfolio: {
            description: 'Get active pool loan',
            params: [
              {
                name: 'pool_id',
                type: 'u64',
              },
            ],
            type: 'Vec<(u64, ActiveLoanInfo)>',
          },
          portfolio_loan: {
            description: 'Get active pool loan',
            params: [
              {
                name: 'pool_id',
                type: 'u64',
              },
              {
                name: 'loan_id',
                type: 'u64',
              },
            ],
            type: 'Option<PalletLoansEntitiesLoansActiveLoan>',
          },
        },
        version: 2,
      },
    ],
    PoolsApi: [
      {
        methods: {
          nav: {
            description: 'Get active pool NAV',
            params: [
              {
                name: 'pool_id',
                type: 'u64',
              },
            ],
            type: 'Option<PoolNav>',
          },
        },
        version: 1,
      },
    ],
    PoolFeesApi: [
      {
        methods: {
          list_fees: {
            description: 'Query pool fees status for a pool',
            params: [
              {
                name: 'pool_id',
                type: 'u64',
              },
            ],
            type: 'Option<PoolFeesList>',
          },
        },
        version: 1,
      },
    ],
  },
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

// Fix for LoansApi old runtime v1
const loansApiRuntime = definitions['runtime']['LoansApi']
loansApiRuntime.push({ ...loansApiRuntime[0], version: 1 })

export default {
  typesBundle: { spec: { 'centrifuge-devel': definitions, altair: definitions, centrifuge: definitions } },
}
