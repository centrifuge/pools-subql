import { Enum, Null, Struct, Tuple, u128, u32, u64, U8aFixed, Option, U128, Vec, createType } from '@polkadot/types'
import { AccountId32, Perquintill } from '@polkadot/types/interfaces'
import { ITuple } from '@polkadot/types/types'

export interface PoolDetails extends Struct {
  reserve: { total: u128; available: u128; max: u128 }
  currency: Enum
  parameters: { minEpochTime: u64; maxNavAge: u64 }
  tranches: { tranches: TrancheDetails[]; ids: Vec<U8aFixed>; salt: ITuple<[u64, u64]> }
  epoch: { current: u32; lastClosed: u64; lastExecuted: u32 }
}

export interface TrancheDetails extends Struct {
  trancheType: TrancheTypeEnum
  seniority: u32
  currency: Enum
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
  inUngealthy: boolean
  asHealthy: { solution: TrancheSolution[]; score: u128 }
  asUnhealthy: {
    state: Enum[]
    solution: TrancheSolution[]
    riskBufferImprovementScores: Option<Vec<u128>>
    reserveImprovementScore: Option<u128>
  }
}

export interface EpochDetails extends Struct {
  investemntFulfillment: Perquintill
  redeemFulfillment: Perquintill
  tokenPrice: u128
}

export interface TrancheSolution extends Struct {
  investFulfillment: Perquintill
  redeemFulfillment: Perquintill
}

export interface LoanEvent extends ITuple<[u64, u128, u128]> {}
export interface EpochEvent extends ITuple<[u64, u32]> {}
export interface OrderEvent extends ITuple<[u64, U8aFixed, AccountId32, u128, u128]> {}
