import { SubstrateEvent } from '@subql/types'
import { errorHandler, missingPool } from '../../helpers/errorHandler'
import { EpochService } from '../services/epochService'
import { PoolService } from '../services/poolService'
import { TrancheService } from '../services/trancheService'
import { EpochClosedExecutedEvent, PoolCreatedEvent, PoolMetadataSetEvent, PoolUpdatedEvent } from '../../helpers/types'
import { OutstandingOrderService } from '../services/outstandingOrderService'
import { InvestorTransactionService } from '../services/investorTransactionService'
import { CurrencyService, currencyFormatters } from '../services/currencyService'
import { TrancheBalanceService } from '../services/trancheBalanceService'
import { BlockchainService, LOCAL_CHAIN_ID } from '../services/blockchainService'
import { AssetService } from '../services/assetService'

export const handlePoolCreated = errorHandler(_handlePoolCreated)
async function _handlePoolCreated(event: SubstrateEvent<PoolCreatedEvent>): Promise<void> {
  const [, , poolId, essence] = event.event.data
  logger.info(
    `Pool ${poolId.toString()} with currency: ${essence.currency.type} ` +
      `created in block ${event.block.block.header.number}`
  )

  const blockchain = await BlockchainService.getOrInit(LOCAL_CHAIN_ID)
  const currency = await CurrencyService.getOrInit(
    blockchain.id,
    essence.currency.type,
    ...currencyFormatters[essence.currency.type](essence.currency.value)
  )

  // Initialise Pool
  const pool = await PoolService.getOrSeed(poolId.toString(10), false)
  await pool.init(
    currency.id,
    essence.maxReserve.toBigInt(),
    essence.maxNavAge.toNumber(),
    essence.minEpochTime.toNumber(),
    event.block.timestamp,
    event.block.block.header.number.toNumber()
  )
  await pool.initData()
  await pool.initIpfsMetadata().catch((err) => {
    logger.error(`IPFS Request failed ${err}`)
    return Promise.resolve()
  })
  await pool.save()

  // Initialise the tranches
  const trancheData = await pool.getTranches()
  const tranches = await Promise.all(
    essence.tranches.map((trancheEssence) => {
      const trancheId = trancheEssence.currency.trancheId.toHex()
      logger.info(`Creating tranche with id: ${pool.id}-${trancheId}`)
      return TrancheService.getOrSeed(pool.id, trancheId)
    })
  )

  for (const [index, tranche] of tranches.entries()) {
    await tranche.init(index, trancheData[tranche.trancheId].data)
    await tranche.updateSupply()
    await tranche.save()

    const currency = await CurrencyService.getOrInit(blockchain.id, 'Tranche', pool.id, tranche.trancheId)
    await currency.initTrancheDetails(pool.id, tranche.trancheId)
    await currency.save()
  }

  // Initialise Epoch
  const trancheIds = tranches.map((tranche) => tranche.trancheId)
  const epoch = await EpochService.init(pool.id, pool.currentEpoch, trancheIds, event.block.timestamp)
  await epoch.saveWithStates()

  const onChainCashAsset = AssetService.initOnchainCash(pool.id, event.block.timestamp)
  await onChainCashAsset.save()
}

export const handlePoolUpdated = errorHandler(_handlePoolUpdated)
async function _handlePoolUpdated(event: SubstrateEvent<PoolUpdatedEvent>): Promise<void> {
  const [poolId] = event.event.data
  logger.info(`Pool ${poolId.toString()} updated on block ${event.block.block.header.number}`)

  const blockchain = await BlockchainService.getOrInit(LOCAL_CHAIN_ID)
  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool

  await pool.initData()
  await pool.initIpfsMetadata()
  await pool.save()

  // Deactivate active tranches
  const activeTranches = await TrancheService.getActivesByPoolId(poolId.toString())
  for (const activeTranche of activeTranches) {
    await activeTranche.deactivate()
    await activeTranche.save()
  }

  // Reprocess tranches
  const tranches = await pool.getTranches()
  for (const [id, tranche] of Object.entries(tranches)) {
    logger.info(`Syncing tranche with id: ${id}`)
    const trancheService = await TrancheService.getOrSeed(poolId.toString(), id)
    trancheService.init(tranche.index, tranche.data)
    await trancheService.activate()
    await trancheService.updateSupply()
    await trancheService.updateDebt(tranche.data.debt.toBigInt())
    await trancheService.save()

    const currency = await CurrencyService.getOrInit(blockchain.id, 'Tranche', pool.id, trancheService.trancheId)
    await currency.initTrancheDetails(pool.id, trancheService.trancheId)
    await currency.save()
  }
}

export const handleMetadataSet = errorHandler(_handleMetadataSet)
async function _handleMetadataSet(event: SubstrateEvent<PoolMetadataSetEvent>) {
  const [poolId, metadata] = event.event.data
  logger.info(
    `Pool metadata set for pool ${poolId.toString(10)}`
  )
  const pool = await PoolService.getById(poolId.toString())
  if (!pool) throw missingPool
  await pool.updateMetadata(metadata.toUtf8())
  await pool.initIpfsMetadata()
  await pool.save()
}

export const handleEpochClosed = errorHandler(_handleEpochClosed)
async function _handleEpochClosed(event: SubstrateEvent<EpochClosedExecutedEvent>): Promise<void> {
  const [poolId, epochId] = event.event.data
  logger.info(
    `Epoch ${epochId.toNumber()} closed for pool ${poolId.toString()} in block ${event.block.block.header.number}`
  )
  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool

  // Close the current epoch and open a new one
  const tranches = await TrancheService.getActivesByPoolId(poolId.toString())
  const epoch = await EpochService.getById(poolId.toString(), epochId.toNumber())
  await epoch.closeEpoch(event.block.timestamp)
  await epoch.saveWithStates()

  const trancheIds = tranches.map((tranche) => tranche.trancheId)
  const nextEpoch = await EpochService.init(
    poolId.toString(),
    epochId.toNumber() + 1,
    trancheIds,
    event.block.timestamp
  )
  await nextEpoch.saveWithStates()

  await pool.closeEpoch(epochId.toNumber())
  await pool.save()
}

export const handleEpochExecuted = errorHandler(_handleEpochExecuted)
async function _handleEpochExecuted(event: SubstrateEvent<EpochClosedExecutedEvent>): Promise<void> {
  const [poolId, epochId] = event.event.data
  logger.info(
    `Epoch ${epochId.toString()} executed event for pool ${poolId.toString()} ` +
      `at block ${event.block.block.header.number.toString()}`
  )

  const pool = await PoolService.getById(poolId.toString())
  if (pool === undefined) throw missingPool

  const epoch = await EpochService.getById(poolId.toString(), epochId.toNumber())

  await epoch.executeEpoch(event.block.timestamp)
  await epoch.saveWithStates()

  await pool.executeEpoch(epochId.toNumber())
  await pool.increaseInvestments(epoch.sumInvestedAmount)
  await pool.increaseRedemptions(epoch.sumRedeemedAmount)
  await pool.save()

  // Compute and save aggregated order fulfillment
  const tranches = await TrancheService.getByPoolId(poolId.toString())
  const nextEpoch = await EpochService.getById(poolId.toString(), epochId.toNumber() + 1)
  for (const tranche of tranches) {
    const epochState = epoch.getStates().find((epochState) => epochState.trancheId === tranche.trancheId)
    await tranche.updateSupply()
    await tranche.updatePrice(epochState.tokenPrice, event.block.block.header.number.toNumber())
    await tranche.updateFulfilledInvestOrders(epochState.sumFulfilledInvestOrders)
    await tranche.updateFulfilledRedeemOrders(epochState.sumFulfilledRedeemOrders)
    await tranche.save()

    // Carry over aggregated unfulfilled orders to next epoch
    await nextEpoch.updateOutstandingInvestOrders(
      tranche.trancheId,
      epochState.sumOutstandingInvestOrders - epochState.sumFulfilledInvestOrders,
      BigInt(0)
    )
    await nextEpoch.updateOutstandingRedeemOrders(
      tranche.trancheId,
      epochState.sumOutstandingRedeemOrders - epochState.sumFulfilledRedeemOrders,
      BigInt(0),
      epochState.tokenPrice
    )

    // Find single outstanding orders posted for this tranche and fulfill them to investorTransactions
    const oos = await OutstandingOrderService.getAllByTrancheId(poolId.toString(), tranche.trancheId)
    logger.info(`Fulfilling ${oos.length} outstanding orders for tranche ${tranche.trancheId}`)
    for (const oo of oos) {
      logger.info(`Outstanding invest before fulfillment: ${oo.investAmount} redeem:${oo.redeemAmount}`)
      const orderData = {
        poolId: poolId.toString(),
        trancheId: tranche.trancheId,
        epochNumber: epochId.toNumber(),
        address: oo.accountId,
        hash: oo.hash,
        price: epochState.tokenPrice,
        fee: BigInt(0),
        timestamp: event.block.timestamp,
      }

      const trancheBalance = await TrancheBalanceService.getOrInit(
        orderData.address,
        orderData.poolId,
        orderData.trancheId
      )

      if (oo.investAmount > BigInt(0) && epochState.investFulfillmentPercentage > BigInt(0)) {
        const it = InvestorTransactionService.executeInvestOrder({
          ...orderData,
          amount: oo.investAmount,
          fulfillmentPercentage: epochState.investFulfillmentPercentage,
        })
        await it.save()
        await oo.updateUnfulfilledInvest(it.currencyAmount)
        await trancheBalance.investExecute(it.currencyAmount, it.tokenAmount)
      }

      if (oo.redeemAmount > BigInt(0) && epochState.redeemFulfillmentPercentage > BigInt(0)) {
        const it = InvestorTransactionService.executeRedeemOrder({
          ...orderData,
          amount: oo.redeemAmount,
          fulfillmentPercentage: epochState.redeemFulfillmentPercentage,
        })
        await it.save()
        await oo.updateUnfulfilledRedeem(it.tokenAmount)
        await trancheBalance.redeemExecute(it.tokenAmount, it.currencyAmount)
      }

      await trancheBalance.save()

      // Remove outstandingOrder if completely fulfilled
      if (oo.investAmount > BigInt(0) || oo.redeemAmount > BigInt(0)) {
        await oo.save()
      } else {
        await OutstandingOrderService.remove(oo.id)
      }
      logger.info(`Outstanding invest after fulfillment: ${oo.investAmount} redeem:${oo.redeemAmount}`)
    }
  }
  await nextEpoch.saveWithStates()
}
