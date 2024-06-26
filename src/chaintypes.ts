import type { DefinitionsCallEntry, OverrideBundleDefinition } from '@polkadot/types/types'

const latestTypes = {
  ActiveLoanInfoV2: {
    activeLoan: 'PalletLoansEntitiesLoansActiveLoan',
    presentValue: 'Balance',
    outstandingPrincipal: 'Balance',
    outstandingInterest: 'Balance',
    currentPrice: 'Option<Balance>',
  },
  ActiveLoanInfoV1: {
    activeLoan: 'PalletLoansEntitiesLoansActiveLoan',
    presentValue: 'Balance',
    outstandingPrincipal: 'Balance',
    outstandingInterest: 'Balance',
  },
  InvestmentPortfolio: {
    poolCurrencyId: 'CfgTypesTokensCurrencyId',
    pendingInvestCurrency: 'Balance',
    claimableTrancheTokens: 'Balance',
    freeTrancheTokens: 'Balance',
    reservedTrancheTokens: 'Balance',
    pendingRedeemTrancheTokens: 'Balance',
    claimableCurrency: 'Balance',
  },
  PoolNav: {
    navAum: 'Balance',
    navFees: 'Balance',
    reserve: 'Balance',
    total: 'Balance',
  },
  PoolFeesList: 'Vec<PoolFeesOfBucket>',
  PoolFeesOfBucket: {
    bucket: 'CfgTraitsFeePoolFeeBucket',
    fees: 'Vec<CfgTypesPoolsPoolFee>',
  },
  CashflowPayment: {
    when: 'u64',
    principal: 'Balance',
    interest: 'Balance',
  },
}

const loansRuntimeApiMethodsV1: DefinitionsCallEntry['methods'] = {
  portfolio: {
    description: 'Get active pool loan',
    params: [
      {
        name: 'pool_id',
        type: 'u64',
      },
    ],
    type: 'Vec<(u64, ActiveLoanInfoV1)>',
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
}

const loansRuntimeApiMethodsV2: DefinitionsCallEntry['methods'] = {
  ...loansRuntimeApiMethodsV1,
  portfolio: { ...loansRuntimeApiMethodsV1.portfolio, type: 'Vec<(u64, ActiveLoanInfoV2)>' },
}

const loansRuntimeApiMethodsV3: DefinitionsCallEntry['methods'] = {
  ...loansRuntimeApiMethodsV2,
  expected_cashflows: {
    description: 'Retrieve expected cashflows',
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
    type: 'Result<Vec<CashflowPayment<Balance>>, SpRuntimeDispatchError>',
  },
}

const definitions: OverrideBundleDefinition = {
  types: [
    {
      minmax: [undefined, undefined],
      types: latestTypes,
    },
  ],
  runtime: {
    LoansApi: [
      { methods: loansRuntimeApiMethodsV3, version: 3 },
      { methods: loansRuntimeApiMethodsV2, version: 2 },
      { methods: loansRuntimeApiMethodsV1, version: 1 },
    ],
    PoolsApi: [
      {
        methods: {
          tranche_token_prices: {
            description: 'Retrieve prices for all tranches',
            params: [
              {
                name: 'pool_id',
                type: 'u64',
              },
            ],
            type: 'Option<Vec<u128>>',
          },
          tranche_token_price: {
            description: 'Retrieve prices for one tranche',
            params: [
              {
                name: 'pool_id',
                type: 'u64',
              },
              {
                name: 'tranche_id',
                type: '[u8;16]',
              },
            ],
            type: 'Option<u128>',
          },
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

export default {
  typesBundle: {
    spec: {
      'centrifuge-devel': definitions,
      altair: definitions,
      centrifuge: definitions,
    },
  },
}
