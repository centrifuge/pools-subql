import { SubstrateBlock } from '@subql/types'
import { PoolService } from '../mappings/services/poolService'
import { BlockInfo, statesSnapshotter } from './stateSnapshot'
import { PoolSnapshot } from '../types'
import { getPeriodStart } from './timekeeperService'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getByFields = store.getByFields as jest.Mock
const set = store.set as jest.Mock
const block = {
  block: { header: { number: { toNumber: () => 11246 } } },
  timestamp: new Date(),
} as unknown as SubstrateBlock

const poolId = '123456789',
  timestamp = new Date(),
  blockNumber = 11234,
  periodId = getPeriodStart(timestamp).toISOString()

describe('Given a populated pool,', () => {
  const pool = PoolService.seed(poolId)
  pool.init('AUSD', BigInt(6000), 23, 12, timestamp, blockNumber)

  test('when a snapshot is taken, then the id is set correctly', async () => {
    set.mockReset()
    getByFields.mockReset()
    getByFields.mockReturnValue([pool])
    const blockInfo: BlockInfo = { timestamp, number: blockNumber }
    await statesSnapshotter('periodId', periodId, [pool], PoolSnapshot, blockInfo)
    expect(store.set).toHaveBeenCalledTimes(2)
    expect(store.set).toHaveBeenNthCalledWith(1, 'Pool', poolId, expect.anything())
    expect(store.set).toHaveBeenNthCalledWith(2, 'PoolSnapshot', `${poolId}-${blockNumber}`, expect.anything())
  })

  test('when a snapshot is taken, then the timestamp and blocknumber are added', async () => {
    set.mockReset()
    getByFields.mockReset()
    getByFields.mockReturnValue([pool])
    const blockInfo: BlockInfo = { timestamp, number: blockNumber }
    await statesSnapshotter('periodId', periodId, [pool], PoolSnapshot, blockInfo)
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'PoolSnapshot',
      `${poolId}-${blockNumber}`,
      expect.objectContaining({ timestamp: block.timestamp, blockNumber: blockNumber })
    )
  })

  test('when a foreigh key is set, then the correct foreign key value is set on the snapshot', async () => {
    set.mockReset()
    getByFields.mockReset()
    getByFields.mockReturnValue([pool])
    const blockInfo: BlockInfo = { timestamp, number: blockNumber }
    await statesSnapshotter('periodId', periodId, [pool], PoolSnapshot, blockInfo, 'poolId')
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'PoolSnapshot',
      `${poolId}-${blockNumber}`,
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

    const blockInfo: BlockInfo = { timestamp, number: 11246 }
    await statesSnapshotter('periodId', periodId, [pool], PoolSnapshot, blockInfo)

    expect(store.set).toHaveBeenNthCalledWith(1, 'Pool', poolId, expect.objectContaining(zeroedProps))
    expect(store.set).toHaveBeenNthCalledWith(
      2,
      'PoolSnapshot',
      `${poolId}-${blockNumber}`,
      expect.objectContaining(zeroedProps)
    )
  })
})
