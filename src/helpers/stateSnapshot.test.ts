import { SubstrateBlock } from '@subql/types'
import { PoolService } from '../mappings/services/poolService'
import { substrateStateSnapshotter } from './stateSnapshot'
import { Pool, PoolSnapshot } from '../types'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getByFields = store.getByFields as jest.Mock
const set = store.set as jest.Mock
const block = {
  block: { header: { number: { toNumber: () => 11246 } } },
  timestamp: new Date(),
} as unknown as SubstrateBlock

const poolId = '123456789',
  timestamp = new Date(),
  blockNumber = 11234

describe('Given a populated pool,', () => {
  const pool = PoolService.seed(poolId)
  pool.init('AUSD', BigInt(6000), 23, 12, timestamp, blockNumber)

  test('when a snapshot is taken, then the id is set correctly', async () => {
    set.mockReset()
    getByFields.mockReset()
    getByFields.mockReturnValue([pool])
    await substrateStateSnapshotter(Pool, PoolSnapshot, block)
    expect(store.getByFields).toHaveBeenCalledWith('Pool', [['blockchainId', '=', '0']], expect.anything())
    expect(store.set).toHaveBeenNthCalledWith(1, 'Pool', poolId, expect.anything())
    expect(store.set).toHaveBeenNthCalledWith(2, 'PoolSnapshot', `${poolId}-11246`, expect.anything())
  })

  test('when a snapshot is taken, then the timestamp and blocknumber are added', async () => {
    set.mockReset()
    getByFields.mockReset()
    getByFields.mockReturnValue([pool])
    await substrateStateSnapshotter(Pool, PoolSnapshot, block)
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'PoolSnapshot',
      `${poolId}-11246`,
      expect.objectContaining({ timestamp: block.timestamp, blockNumber: 11246 })
    )
  })

  test('when filters are specified, then the correct values are fetched', async () => {
    set.mockReset()
    getByFields.mockReset()
    getByFields.mockReturnValue([pool])
    await substrateStateSnapshotter<Pool, PoolSnapshot>(Pool, PoolSnapshot, block, 'isActive', true)
    expect(store.getByFields).toHaveBeenNthCalledWith(
      1,
      'Pool',
      [
        ['blockchainId', '=', '0'],
        ['isActive', '=', true],
      ],
      expect.anything()
    )
  })

  test('when a foreigh key is set, then the correct foreign key value is set on the snapshot', async () => {
    set.mockReset()
    getByFields.mockReset()
    getByFields.mockReturnValue([pool])
    await substrateStateSnapshotter<Pool, PoolSnapshot>(Pool, PoolSnapshot, block, 'type', 'ALL', 'poolId')
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'PoolSnapshot',
      `${poolId}-11246`,
      expect.objectContaining({ poolId: poolId })
    )
  })
})

describe('Given a pool with non zero accumulators, ', () => {
  const pool = PoolService.seed(poolId)
  pool.init('AUSD', BigInt(6000), 23, 12, timestamp, blockNumber)
  set.mockReset()
  getByFields.mockReset()
  getByFields.mockReturnValue([pool])

  test('when a entity is snapshotted, then the accumulators are reset to 0', async () => {
    const accumulatorProps = Object.getOwnPropertyNames(pool).filter((prop) => prop.endsWith('ByPeriod'))
    const zeroedProps = accumulatorProps.reduce((acc, currentProp) => ({ ...acc, [currentProp]: BigInt(0) }), {})
    const accumulatedProps = accumulatorProps.reduce(
      (acc, currentProp) => ({ ...acc, [currentProp]: BigInt('999999999999999999') }),
      {}
    )

    Object.assign(pool, accumulatedProps)

    await substrateStateSnapshotter(Pool, PoolSnapshot, block)

    expect(store.set).toHaveBeenNthCalledWith(1, 'Pool', poolId, expect.objectContaining(zeroedProps))
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'PoolSnapshot',
      `${poolId}-11246`,
      expect.objectContaining(zeroedProps)
    )
  })
})
