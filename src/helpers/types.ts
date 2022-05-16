export interface TrancheData {
  interestPerSec: string
  minRiskBuffer: number
  seniority: number
  outstandingInvestOrders: number
  outstandingRedeemOrders: number
  debt: number
  reserve: number
  ratio: number
  lastUpdatedInterest: Date
}

export interface PoolData {
  currency: {}
  tranches: [TrancheData]
  currentEpoch: number
  lastEpochClosed: number
  lastEpochExecuted: number
  maxReserve: number
  availableReserve: number
  totalReserve: number
  metadata: {} | null
  minEpochTime: number
  challengeTime: number
  maxNavAge: number
}

export interface PoolNavData {
  latestNav: number
  lastUpdated: number
}
