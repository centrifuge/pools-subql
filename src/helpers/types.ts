import { Enum, Null, Struct, u128, u32, u64, U8aFixed, Option, Vec, Bytes } from '@polkadot/types'
import { AccountId32, Perquintill } from '@polkadot/types/interfaces'
import { ITuple } from '@polkadot/types/types'

export interface PoolDetails extends Struct {
  reserve: { total: u128; available: u128; max: u128 }
  currency: TokensCurrencyId
  parameters: { minEpochTime: u64; maxNavAge: u64 }
  tranches: TrancheData
  epoch: { current: u32; lastClosed: u64; lastExecuted: u32 }
  metadata: Option<Bytes>
}

export interface TrancheData extends Struct {
  tranches: TrancheDetails[]
  ids: Vec<U8aFixed>
  salt: ITuple<[u64, u64]>
}

export interface TrancheDetails extends Struct {
  trancheType: TrancheTypeEnum
  seniority: u32
  currency: TokensCurrencyId
  outstandingInvestOrders: u128
  outstandingRedeemOrders: u128
  debt: u128
  reserve: u128
  ratio: Perquintill
  lastUpdatedInterest: u64
}

export interface TrancheTypeEnum extends Enum {
  isResidual: boolean
  isNonResidual: boolean
  asNonResidual: { interestRatePerSec: u128; minRiskBuffer: Perquintill }
  asResidual: Null
}

export interface NavDetails extends Struct {
  latest: u128
  lastUpdated: u64
}

export interface EpochExecutionInfo extends Struct {
  epoch: u32
  nav: u128
  reserve: u128
  maxReserve: u128
  tranches: { tranches: EpochExecutionTranche[] }
  bestSubmission: Option<EpochSolution>
  challengePeriodEnd: Option<u32>
}

export interface EpochExecutionTranche extends Struct {
  supply: u128
  price: u128
  invest: u128
  redeem: u128
  minRiskBuffer: Perquintill
  seniority: u32
}

export interface EpochSolution extends Enum {
  isHealthy: boolean
  isUnhealthy: boolean
  asHealthy: { solution: TrancheSolution[]; score: u128 }
  asUnhealthy: {
    state: Enum[]
    solution: TrancheSolution[]
    riskBufferImprovementScores: Option<Vec<u128>>
    reserveImprovementScore: Option<u128>
  }
}

export interface TokensCurrencyId extends Enum {
  isNative: boolean
  asNative: null
  isTranche: boolean
  asTranche: ITuple<[u64, U8aFixed]> //poolId, trancheId
  isKSM: boolean
  asKSM: null
  isAUSD: boolean
  asAUSD: null
  isForeignAsset: boolean
  asForeignAsset: u32
}

export interface EpochDetails extends Struct {
  investFulfillment: Perquintill
  redeemFulfillment: Perquintill
  tokenPrice: u128
}

export interface TrancheSolution extends Struct {
  investFulfillment: Perquintill
  redeemFulfillment: Perquintill
}

export interface OutstandingCollections extends Struct {
  payoutCurrencyAmount: u128
  payoutTokenAmount: u128
  remainingInvestCurrency: u128
  remainingRedeemToken: u128
}

export interface AssetMetadata extends Struct {
  decimals: u32
  name: Bytes
  symbol: Bytes
  existentialDeposit: u128
}

export type LoanAsset = ITuple<[u64, u128]>

export type PoolEvent = ITuple<[u64]>

// poolId, loanId, collateral
export type LoanCreatedClosedEvent = ITuple<[u64, u128, LoanAsset]>
// poolId, loanId, amount
export type LoanBorrowedEvent = ITuple<[u64, u128, u128]>

export type EpochEvent = ITuple<[u64, u32]>
export type EpochSolutionEvent = ITuple<[u64, u32, EpochSolution]>

export type OrderEvent = ITuple<[u64, U8aFixed, AccountId32, u128, u128]>

// poolId, trancheId, endEpochId, account, outstandingCollections
export type OrdersCollectedEvent = ITuple<[u64, U8aFixed, u32, AccountId32, OutstandingCollections]>

// currencyId: 'CommonTypesTokensCurrencyId'from,to,amount
export type TokensTransferEvent = ITuple<[TokensCurrencyId, AccountId32, AccountId32, u128]>
