import { SubstrateBlock } from '@subql/types'
import { errorHandler } from './errorHandler'
import { getPeriodStart } from './timeKeeping'

interface Constructor<C> {
  new (id: string): C
}

interface TypeGetter<C> {
  getByType(type: string): Promise<C[]> | undefined
}

interface GenericState {
  id: string
  type: string
  save(): Promise<void>
}

interface GenericSnapshot {
  id: string
  timestamp: Date
  blockNumber: number
  periodStart: Date
  save(): Promise<void>
}

export const stateSnapshotter = errorHandler(_stateSnapshotter)
/**
 * Creates a snapshot of a generic stateModel to a snapshotModel.
 * A snapshotModel has the same fields as the originating stateModel, however a timestamp and a blockNumber are added.
 * Fields ending with an _ underscore are reset to 0 at the end of a period. All such resettable fields must be of type BigInt.
 * @param stateModel the data model to be snapshotted
 * @param snapshotModel the data model where the snapshot is saved. (must have additional timestamp and blockNumber fields)
 * @param block the correspondint substrateBlock to provide additional state values to the snapshot
 * @param fkReferenceName (optional) name of the foreignKey to save a reference to the originating entity.
 * @returns A promise resolving when all state manipulations in the DB is completed
 */
async function _stateSnapshotter<
  T extends Constructor<GenericState> & TypeGetter<GenericState>,
  U extends Constructor<GenericSnapshot>
>(
  stateModel: T,
  snapshotModel: U,
  block: SubstrateBlock,
  fkReferenceName: string = undefined
): Promise<Promise<void>[]> {
  let entitySaves = []
  if (!stateModel.hasOwnProperty('getByType')) throw new Error('stateModel has no method .hasOwnProperty()')
  const stateEntities = await stateModel.getByType('ALL')
  for (const stateEntity of stateEntities) {
    const blockNumber = block.block.header.number.toNumber()
    const { id, type, ...copyStateEntity } = stateEntity
    const snapshotEntity = new snapshotModel(`${id}-${blockNumber.toString()}`)
    Object.assign(snapshotEntity, copyStateEntity)
    snapshotEntity.timestamp = block.timestamp
    snapshotEntity.blockNumber = blockNumber
    snapshotEntity.periodStart = getPeriodStart(block.timestamp)

    if (fkReferenceName) snapshotEntity[fkReferenceName] = stateEntity.id

    const propNamesToReset = Object.getOwnPropertyNames(stateEntity).filter((propName) => propName.endsWith('_'))
    for (const propName of propNamesToReset) {
      logger.info(`Resetting entity: ${propName}`)
      stateEntity[propName] = BigInt(0)
    }

    entitySaves.push(stateEntity.save())
    entitySaves.push(snapshotEntity.save())
  }
  return Promise.all(entitySaves)
}
