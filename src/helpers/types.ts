import { Enum, Struct, Tuple, u128, u32, u64, U8aFixed } from '@polkadot/types'
import { AccountId32, Perquintill } from '@polkadot/types/interfaces'
import { ITuple } from '@polkadot/types/types'

export interface PoolDetails extends Struct {
  reserve: { total: u128; available: u128; max: u128 }
  currency: Enum
  parameters: { minEpochTime: u64; maxNavAge: u64 }
  tranches: { tranches: [TrancheDetails] }
}

export interface TrancheDetails extends Struct {
  trancheType: TrancheTypeEnum
  seniority: u32
}

export interface TrancheTypeEnum extends Enum {
  isResidual: boolean
  isNonResidual: boolean
  asNonResidual: { interestRatePerSec: u128; minRiskBuffer: Perquintill }
}

export interface NavDetails extends Struct {
  latest: u128
  lastUpdated: u64
}

export interface LoanEvent extends ITuple<[u64, u128, u128]> {}
export interface EpochEvent extends ITuple<[u64, u32]> {}
export interface OrderEvent extends ITuple<[u64, U8aFixed, AccountId32, u128, u128]> {}
