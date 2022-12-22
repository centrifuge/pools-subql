import { bnToBn, nToBigInt } from '@polkadot/util'
import { InvestorTransactionType } from '../../types'
import { RAY, WAD } from '../../config'
import { InvestorTransactionData, InvestorTransactionService } from './investorTransactionService'

const set = store.set as jest.Mock

const orderData = <InvestorTransactionData>{
  poolId: '12345678',
  trancheId: '0x3abbbbbbbbbbbbbbb',
  epochNumber: 5,
  hash: 'wejr23orjwelkfn34oijwe',
  amount: nToBigInt(WAD.muln(100)),
  timestamp: new Date(),
  price: nToBigInt(RAY.muln(10)),
  fee: BigInt(0),
  fulfillmentPercentage: BigInt('500000000000000000'),
}

const executedInvestCurrency = nToBigInt(bnToBn(orderData.amount).mul(bnToBn(orderData.fulfillmentPercentage)).div(WAD))
const executedInvestToken = nToBigInt(bnToBn(executedInvestCurrency).mul(RAY).div(bnToBn(orderData.price)))
const executedRedeemToken = nToBigInt(bnToBn(orderData.amount).mul(bnToBn(orderData.fulfillmentPercentage)).div(WAD))
const executedRedeemCurrency = nToBigInt(bnToBn(executedRedeemToken).mul(bnToBn(orderData.price)).div(RAY))

describe('Given an invest/redeem order update, when the transaction is saved,', () => {
  const itx = InvestorTransactionService.updateInvestOrder(orderData)
  const rtx = InvestorTransactionService.updateRedeemOrder(orderData)

  test('then the type is set correctly', async () => {
    set.mockReset()
    await itx.save()
    await rtx.save()
    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.INVEST_ORDER_UPDATE}`,
      expect.objectContaining({ type: InvestorTransactionType.INVEST_ORDER_UPDATE })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.REDEEM_ORDER_UPDATE}`,
      expect.objectContaining({ type: InvestorTransactionType.REDEEM_ORDER_UPDATE })
    )
  })

  test('then the amounts are set correctly', async () => {
    set.mockReset()
    await itx.save()
    await rtx.save()
    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.INVEST_ORDER_UPDATE}`,
      expect.objectContaining({ currencyAmount: orderData.amount })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.REDEEM_ORDER_UPDATE}`,
      expect.objectContaining({ tokenAmount: orderData.amount })
    )
  })
})

describe('Given an invest/redeem order cancel, when the transaction is saved,', () => {
  const itx = InvestorTransactionService.cancelInvestOrder(orderData)
  const rtx = InvestorTransactionService.cancelRedeemOrder(orderData)

  test('then the type set correctly', async () => {
    set.mockReset()
    await itx.save()
    await rtx.save()
    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.INVEST_ORDER_CANCEL}`,
      expect.objectContaining({ type: InvestorTransactionType.INVEST_ORDER_CANCEL })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.REDEEM_ORDER_CANCEL}`,
      expect.objectContaining({ type: InvestorTransactionType.REDEEM_ORDER_CANCEL })
    )
  })
})

describe('Given an invest/redeem collection order, when the transaction is saved,', () => {
  const itx = InvestorTransactionService.collectInvestOrder(orderData)
  const rtx = InvestorTransactionService.collectRedeemOrder(orderData)

  test('then the type set correctly', async () => {
    set.mockReset()
    await itx.save()
    await rtx.save()
    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.INVEST_COLLECT}`,
      expect.objectContaining({ type: InvestorTransactionType.INVEST_COLLECT })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.REDEEM_COLLECT}`,
      expect.objectContaining({ type: InvestorTransactionType.REDEEM_COLLECT })
    )
  })
})

describe('Given an in/out transfer, when the transaction is saved,', () => {
  const itx = InvestorTransactionService.transferIn(orderData)
  const otx = InvestorTransactionService.transferOut(orderData)

  test('then the type set correctly', async () => {
    set.mockReset()
    await itx.save()
    await otx.save()
    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.TRANSFER_IN}`,
      expect.objectContaining({ type: InvestorTransactionType.TRANSFER_IN })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.TRANSFER_OUT}`,
      expect.objectContaining({ type: InvestorTransactionType.TRANSFER_OUT })
    )
  })

  test('then the amounts are set correctly', async () => {
    set.mockReset()
    await itx.save()
    await otx.save()
    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.TRANSFER_IN}`,
      expect.objectContaining({ tokenAmount: orderData.amount })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.TRANSFER_OUT}`,
      expect.objectContaining({ tokenAmount: orderData.amount })
    )
  })
})

describe('Given an invest/redeem execution, when the transaction is saved,', () => {
  const itx = InvestorTransactionService.executeInvestOrder(orderData)
  const rtx = InvestorTransactionService.executeRedeemOrder(orderData)

  test('then the type is set correctly', async () => {
    set.mockReset()
    await itx.save()
    await rtx.save()
    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.INVEST_EXECUTION}`,
      expect.objectContaining({ type: InvestorTransactionType.INVEST_EXECUTION })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.REDEEM_EXECUTION}`,
      expect.objectContaining({ type: InvestorTransactionType.REDEEM_EXECUTION })
    )
  })

  test('then the amounts are set correctly', async () => {
    set.mockReset()
    await itx.save()
    await rtx.save()

    expect(store.set).toHaveBeenNthCalledWith(
      1,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.INVEST_EXECUTION}`,
      expect.objectContaining({
        currencyAmount: executedInvestCurrency,
        tokenAmount: executedInvestToken,
      })
    )
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'InvestorTransaction',
      `${orderData.hash}-${orderData.epochNumber}-${InvestorTransactionType.REDEEM_EXECUTION}`,
      expect.objectContaining({
        currencyAmount: executedRedeemCurrency,
        tokenAmount: executedRedeemToken,
      })
    )
  })
})
