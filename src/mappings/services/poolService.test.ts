import { PoolService } from './poolService'

api.query['poolSystem'] = {
  pool: jest.fn(() => ({
    isSome: true,
    isNone: false,
    toHuman: jest.fn(),
    unwrap: () => ({
      currency: 'AUSD',
      reserve: {
        total: { toBigInt: () => BigInt(91000000000000) },
        available: { toBigInt: () => BigInt(92000000000000) },
        max: { toBigInt: () => BigInt(192000000000000) },
      },
      parameters: {
        minEpochTime: { toNumber: () => 500 },
        maxNavAge: { toNumber: () => 500 },
      },
    }),
  })),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

api.query['poolRegistry'] = {
  poolMetadata: jest.fn(() => ({
    isSome: true,
    isNone: false,
    unwrap: () => ({ metadata: { toUtf8: () => 'AAA' } }),
  })),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

api.query['loans'] = {
  poolNAV: jest.fn(() => ({
    isSome: true,
    unwrap: jest.fn(() => ({
      latest: {
        toBigInt: () => BigInt(100000000000000),
      },
    })),
  })),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

const poolId = '4355663',
  now = new Date(),
  block = 235443

const pool = PoolService.init(poolId, 'AUSD', BigInt(100000000), 12, 12, now, block)

describe('Given a new pool, when initialised', () => {
  test('then type is set to "ALL"', () => {
    expect(pool.type).toBe('ALL')
  })

  test('then "created at" property is set correctly', () => {
    expect(pool.createdAt).toBe(now)
  })

  test('then "created at block" property is set correctly', () => {
    expect(pool.createdAtBlockNumber).toBe(block)
  })

  test('then reset accumulators are set to 0', () => {
    const resetAccumulators = Object.getOwnPropertyNames(pool).filter((prop) => prop.endsWith('_R'))
    for (const resetAccumulator of resetAccumulators) {
      expect(pool[resetAccumulator]).toBe(BigInt(0))
    }
  })

  test('when the pool data is initialised, then the correct values are fetched and set', async () => {
    await pool.initData()
    expect(api.query.poolSystem.pool).toBeCalledWith(poolId)
    expect(pool).toMatchObject({
      currencyId: 'AUSD',
      metadata: 'AAA',
      minEpochTime: 500,
      maxPortfolioValuationAge: 500,
    })
  })

  test('then it can be saved to the database', async () => {
    await pool.save()
    expect(store.set).toHaveBeenCalledWith('Pool', poolId, expect.anything())
  })
})

describe('Given an existing pool,', () => {
  test('when the nav is updated, then the value is fetched and set correctly', async () => {
    await pool.updatePortfolioValuation()
    expect(api.query.loans.poolNAV).toBeCalled()
    expect(pool.portfolioValuation).toBe(BigInt(100000000000000))
  })

  test('when the pool state is updated, then the values are fetched and set correctly', async () => {
    await pool.updateState()
    expect(api.query.poolSystem.pool).toBeCalledWith(poolId)
    expect(pool).toMatchObject({
      totalReserve: BigInt(91000000000000),
      availableReserve: BigInt(92000000000000),
      maxReserve: BigInt(192000000000000),
    })
  })

  test('when total borrowings are registered, then values are incremented correctly', async () => {
    await pool.increaseBorrowings(BigInt('34999000000000000'))
    expect(pool).toMatchObject({
      sumBorrowedAmount_R: BigInt('34999000000000000'),
      sumBorrowedAmount: BigInt('34999000000000000'),
      sumNumberOfLoans_R: BigInt(1),
      sumNumberOfLoans: BigInt(1),
    })
  })

  test('when an epoch is closed, then the corresponding current epoch and last counters are increased', async () => {
    await pool.closeEpoch(1)
    expect(pool).toMatchObject({
      currentEpoch: 2,
      lastEpochClosed: 1,
    })
  })
})
