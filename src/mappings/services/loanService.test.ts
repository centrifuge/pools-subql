import { bnToBn, nToBigInt } from '@polkadot/util'
import { RAY, WAD } from '../../config'

import { LoanService } from './loanService'

const poolId = '1111111111'
const loanId = 'ABCD'
const nftClassId = BigInt(1)
const nftItemId = BigInt(2)
const timestamp = new Date()
const accumulatedRate = nToBigInt(RAY.muln(2))
const normalizedDebt = nToBigInt(WAD.muln(100))
const interestRate = nToBigInt(WAD)
const metadata = 'AAAAAA'

const outstandingDebt = nToBigInt(bnToBn(normalizedDebt).mul(bnToBn(accumulatedRate)).div(RAY))

api.query['interestAccrual'] = {
  rates: jest.fn(() => [{ interestRatePerSec: { toBigInt: () => interestRate }, accumulatedRate }]),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

api.query['uniques'] = {
  instanceMetadataOf: jest.fn(() => ({
    isNone: false,
    unwrap: () => ({ data: { toUtf8: () => metadata } }),
  })),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

const loan = LoanService.init(poolId, loanId, nftClassId, nftItemId, timestamp)

describe('Given a new loan, when initialised', () => {
  test('then type is inactive', () => {
    expect(loan.isActive).toBe(false)
    expect(loan.status).toBe('CREATED')
  })

  test('then reset accumulators are set to 0', () => {
    const resetAccumulators = Object.getOwnPropertyNames(loan).filter((prop) => prop.endsWith('ByPeriod'))
    for (const resetAccumulator of resetAccumulators) {
      expect(loan[resetAccumulator]).toBe(BigInt(0))
    }
  })

  test('when the metadata is fetched, then the correct values are set', async () => {
    await loan.updateItemMetadata()
    expect(api.query.uniques.instanceMetadataOf).toBeCalledWith(nftClassId, nftItemId)
    expect(loan.metadata).toBe(metadata)
  })

  test('then it can be saved to the database with the correct id format', async () => {
    await loan.save()
    expect(store.set).toHaveBeenCalledWith('Loan', `${poolId}-${loanId}`, expect.anything())
  })
})

describe('Given an existing loan, ', () => {
  test.skip('when a snapshot is taken, then the outstanding debt is computed corrrectly', async () => {
    await loan.updateOutstandingDebt(normalizedDebt, interestRate)
    expect(loan.outstandingDebt).toBe(outstandingDebt)
  })
})
