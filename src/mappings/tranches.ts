import { Option, u128 } from '@polkadot/types'
import { errorHandler } from '../helpers/errorHandler'
import { EpochDetails, TrancheDetails } from '../helpers/types'
import { Tranche, TrancheState } from '../types'

export const createTranche = errorHandler(_createTranche)
async function _createTranche(
  trancheId: string,
  poolId: string,
  trancheData: TrancheDetails
): Promise<[Tranche, TrancheState]> {
  const trancheState = new TrancheState(`${poolId}-${trancheId}`)
  trancheState.type = 'ALL'
  await trancheState.save()

  const tranche = new Tranche(`${poolId}-${trancheId}`)
  tranche.type = 'ALL'
  tranche.poolId = poolId
  tranche.trancheId = trancheId
  tranche.isResidual = trancheData.trancheType.isResidual
  tranche.seniority = trancheData.seniority.toNumber()

  if (!tranche.isResidual) {
    tranche.interestRatePerSec = trancheData.trancheType.asNonResidual.interestRatePerSec.toBigInt()
    tranche.minRiskBuffer = trancheData.trancheType.asNonResidual.minRiskBuffer.toBigInt()
  }

  tranche.stateId = trancheState.id

  await tranche.save()
  return [tranche, trancheState]
}

export const updateTranchePrice = errorHandler(_updateTranchePrice)
async function _updateTranchePrice(poolId: string, trancheId: string, epochId: number): Promise<TrancheState> {
  logger.info(`Updating price for tranche ${trancheId} of pool ${poolId} on epoch ${epochId}`)
  const trancheState = await TrancheState.get(`${poolId}-${trancheId}`)
  const epochResponse = await api.query.pools.epoch<Option<EpochDetails>>(trancheId, epochId)
  logger.info(`EpochResponse: ${JSON.stringify(epochResponse)}`)
  if (epochResponse.isSome) {
    const epochDetails = epochResponse.unwrap()
    trancheState.price = epochDetails.tokenPrice.toBigInt()
    await trancheState.save()
    return trancheState
  }
}

export const updateTrancheSupply = errorHandler(_updateTrancheSupply)
async function _updateTrancheSupply(poolId: string, trancheId: string): Promise<TrancheState> {
  logger.info(`Updating Supply for tranche ${trancheId} of pool ${poolId}`)
  const trancheState = await TrancheState.get(`${poolId}-${trancheId}`)
  const request = { Tranche: [poolId, trancheId] }
  const supplyResponse = await api.query.ormlTokens.totalIssuance<u128>(request)
  logger.info(`SupplyResponse: ${JSON.stringify(supplyResponse)}`)

  trancheState.supply = supplyResponse.toBigInt()
  await trancheState.save()
  return trancheState
}
