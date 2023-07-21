//find out types: const a = createType(api.registry, '[u8;32]', 18)
import { AugmentedRpc, PromiseRpcResult } from '@polkadot/api/types'
import { Enum, Null, Struct, u128, u32, u64, U8aFixed, Option, Vec, Bytes } from '@polkadot/types'
import { AccountId32, Perquintill } from '@polkadot/types/interfaces'
import { ITuple, Observable } from '@polkadot/types/types'

export interface PoolDetails extends Struct {
  reserve: { total: u128; available: u128; max: u128 }
  currency: TokensCurrencyId
  parameters: { minEpochTime: u64; maxNavAge: u64 }
  tranches: TrancheData
  epoch: { current: u32; lastClosed: u64; lastExecuted: u32 }
  metadata: Option<Bytes>
}

export interface PoolEssence extends Struct {
  currency: TokensCurrencyId
  maxReserve: u128
  maxNavAge: u64
  minEpochTime: u64
  tranches: TrancheEssence[]
}

export interface PoolMetadata extends Struct {
  metadata: Bytes
}

export interface TrancheData extends Struct {
  tranches: TrancheDetails[]
  ids: U8aFixed[]
  salt: ITuple<[u64, u64]>
}

export interface TrancheEssence extends Struct {
  currency: TrancheCurrency
  ty: TrancheTypeEnum
  metadata: TrancheMetadata
}

export interface TrancheCurrency extends Struct {
  poolId: u64
  trancheId: U8aFixed
}

export interface TrancheMetadata extends Struct {
  tokenName: Bytes
  tokenSymbol: Bytes
}

export interface TrancheDetails extends Struct {
  trancheType: TrancheTypeEnum
  seniority: u32
  currency: TrancheCurrency
  debt: u128
  reserve: u128
  loss: u128
  ratio: Perquintill
  lastUpdatedInterest: u64
  index?: number
}

export interface TrancheTypeEnum extends Enum {
  isResidual: boolean
  isNonResidual: boolean
  asNonResidual: { interestRatePerSec: u128; minRiskBuffer: Perquintill }
  asResidual: Null
}

export interface NavDetails extends Struct {
  value: u128
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
  currency: TrancheCurrency
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

export interface TrancheSolution extends Struct {
  investFulfillment: Perquintill
  redeemFulfillment: Perquintill
}

export interface InvestCollection extends Struct {
  payoutInvestmentInvest: u128
  remainingInvestmentInvest: u128
}

export interface RedeemCollection extends Struct {
  payoutInvestmentRedeem: u128
  remainingInvestmentRedeem: u128
}

export interface OrdersFulfillment extends Struct {
  ofAmount: Perquintill
  price: u128
}

export interface AssetMetadata extends Struct {
  decimals: u32
  name: Bytes
  symbol: Bytes
  existentialDeposit: u128
}

export interface LoanInfoCreated extends Struct {
  schedule: LoanRepaymentSchedule
  collateral: ITuple<[u64, u128]>
  pricing: LoanPricing
  restrictions: {
    borrows: Enum
    repayments: Enum
  }
}

export interface LoanInfoActive extends Struct {
  schedule: LoanRepaymentSchedule
  collateral: ITuple<[u64, u128]>
  restrictions: {
    borrows: Enum
    repayments: Enum
  }
  borrower: AccountId32
  writeOffPercentage: u128
  originationDate: u64
  pricing: LoanActivePricing
  totalBorrowed: u128
  totalRepaid: u128
  totalRepaidUnchecked: u128
}

export interface LoanActivePricing extends Enum {
  isInternal: boolean
  isExternal: boolean
  asInternal: LoanInternalActivePricing
  asExternal: LoanExternalActivePricing
}

export interface LoanInternalActivePricing extends Struct {
  info: {
    collateralValue: u128
    valuationMethod: LoanValuationMethod
    interestRate: u128
    maxBorrowAmount: LoanInternalPricingMaxBorrowAmount
  }
  normalizedDebt: u128
  writeOffPenalty: u128
}

export interface LoanExternalActivePricing extends Struct {
  info: {
    priceId: CfgOracleKey
    maxBorrowAmount: LoanExternalPricingMaxBorrowAmount
  }
  outstandingQuantity: u128
}

export interface CfgOracleKey extends Enum {
  isIsin: boolean
  asIsin: U8aFixed
}

export interface LoanExternalPricingMaxBorrowAmount extends Enum {
  isNoLimit: boolean
  isQuantity: boolean
  asNoLimit: Null
  asQuantity: u128
}

export interface LoanInternalPricingMaxBorrowAmount extends Enum {
  isUpToTotalBorrowed: boolean
  isUpToOutstandingDebt: boolean
  asUpToTotalBorrowed: {
    advanceRate: u128
  }
  asUpToOutstandingDebt: {
    advanceRate: u128
  }
}

export interface LoanPricing extends Enum {
  isInternal: boolean
  isExternal: boolean
  asInternal: {
    collateralValue: u128
    valuationMethod: LoanValuationMethod
    interestRate: u128
    maxBorrowAmount: LoanInternalPricingMaxBorrowAmount
  }
  asExternal: {
    priceId: CfgOracleKey
    maxBorrowAmount: LoanExternalPricingMaxBorrowAmount
  }
}

export interface LoanValuationMethod extends Enum {
  isDiscountedCashFlow: boolean
  isOutstandingDebt: boolean
  asDiscountedCashFlow: LoanValuationDiscountedCashFlow
  asOutstandingDebt: Null
}

export interface LoanRepaymentSchedule extends Struct {
  maturity: { isFixed: boolean; asFixed: u64 } & Enum
  interestPayments: Enum
  payDownSchedule: Enum
}

export interface LoanValuationDiscountedCashFlow extends Struct {
  probabilityOfDefault: u128
  lossGivenDefault: u128
  discountRate: u128
}

export interface LoanRestrictions extends Struct {
  maxBorrowAmount: Enum
  borrows: Enum
  repayments: Enum
}

export interface LoanWriteOffStatus extends Struct {
  percentage: u128
  penalty: u128
}

export interface InterestAccrualRateDetails extends Struct {
  interestRatePerSec: u128
  accumulatedRate: u128
  referenceCount: u32
}

export interface AccountData extends Struct {
  free: u128
  reserved: u128
  frozen: u128
}

export interface NftItemMetadata extends Struct {
  deposit: u128
  data: Bytes
  isFrozen: boolean
}

// collectionId, itemId
export type LoanAsset = ITuple<[u64, u128]>

// admin, depositor, poolId, essence
export type PoolCreatedEvent = ITuple<[AccountId32, AccountId32, u64, PoolEssence]>

// poolId, old, new
export type PoolUpdatedEvent = ITuple<[AccountId32, PoolEssence, PoolEssence]>

// poolId, loanId, loanInfo
export type LoanCreatedEvent = ITuple<[u64, u64, LoanInfoCreated]>
// poolId, loanId, collateralInfo
export type LoanClosedEvent = ITuple<[u64, u64, LoanAsset]>
// poolId, loanId, amount
export type LoanBorrowedRepaidEvent = ITuple<[u64, u64, u128]>
//poolId, loanId, writeOffStatus
export type LoanWrittenOffEvent = ITuple<[u64, u64, LoanWriteOffStatus]>

// poolId, epochId
export type EpochClosedExecutedEvent = ITuple<[u64, u32]>

// poolId, epochId, solution
export type EpochSolutionEvent = ITuple<[u64, u32, EpochSolution]>

// investmentId, who, processedOrders, collection, outcome(FullyCollected OR PartiallyCollected )
export type InvestOrdersCollectedEvent = ITuple<[TrancheCurrency, AccountId32, Vec<u64>, InvestCollection, Enum]>

// investmentId, who, processedOrders, collection, outcome(FullyCollected OR PartiallyCollected )
export type RedeemOrdersCollectedEvent = ITuple<[TrancheCurrency, AccountId32, Vec<u64>, RedeemCollection, Enum]>

// investmentId, submittedAt, who, amount
export type OrderUpdatedEvent = ITuple<[TrancheCurrency, u64, AccountId32, u128]>

// investmentId, orderId, fulfillment
export type OrdersClearedEvent = ITuple<[TrancheCurrency, u64, OrdersFulfillment]>

// currencyId: 'CommonTypesTokensCurrencyId'from,to,amount
export type TokensTransferEvent = ITuple<[TokensCurrencyId, AccountId32, AccountId32, u128]>

// currencyId, who, amount
export type TokensEndowedDepositedWithdrawnEvent = ITuple<[TokensCurrencyId, AccountId32, u128]>

export type ExtendedRpc = typeof api.rpc & {
  pools: {
    trancheTokenPrice: PromiseRpcResult<
      AugmentedRpc<(poolId: number | string, trancheId: number[]) => Observable<u128>>
    >
    trancheTokenPrices: PromiseRpcResult<AugmentedRpc<(poolId: number | string) => Observable<Vec<u128>>>>
  }
}
