import { SubstrateBlock } from '@subql/types'
import { errorHandler } from './errorHandler'
import { paginatedGetter } from './paginatedGetter'
import { getPeriodStart } from './timekeeperService'
/**
 * Creates a snapshot of a generic stateModel to a snapshotModel.
 * A snapshotModel has the same fields as the originating stateModel, however a timestamp and a blockNumber are added.
 * Fields ending with an _R underscore are reset to 0 at the end of a period. All such resettable fields must be of type
 * BigInt.
 * @param stateModel - the data model to be snapshotted
 * @param snapshotModel - the data model where the snapshot is saved. (must have additional timestamp and
 * blockNumber fields)
 * @param block - the correspondint substrateBlock to provide additional state values to the snapshot
 * @param fkReferenceName - (optional) name of the foreignKey to save a reference to the originating entity.
 * @returns A promise resolving when all state manipulations in the DB is completed
 */
export const stateSnapshotter = errorHandler(_stateSnapshotter)
async function _stateSnapshotter(
  stateModel: string,
  snapshotModel: string,
  block: SubstrateBlock,
  fkReferenceName: string = undefined,
  filterKey = 'type',
  filterValue: string | boolean = 'ALL'
): Promise<void> {
  const entitySaves: Promise<void>[] = []
  logger.info(`Performing snapshots of ${stateModel}`)
  const stateEntities = await paginatedGetter(stateModel, filterKey, filterValue)
  for (const stateEntity of stateEntities) {
    const blockNumber = block.block.header.number.toNumber()
    const { id, ...copyStateEntity } = stateEntity
    logger.info(`Snapshotting ${stateModel}: ${id}`)
    const snapshotEntity = { ...copyStateEntity, id: `${id}-${blockNumber.toString()}` }
    snapshotEntity['timestamp'] = block.timestamp
    snapshotEntity['blockNumber'] = blockNumber
    snapshotEntity['periodStart'] = getPeriodStart(block.timestamp)

    if (fkReferenceName) snapshotEntity[fkReferenceName] = stateEntity.id

    const propNames = Object.getOwnPropertyNames(stateEntity)
    const propNamesToReset = propNames.filter((propName) => propName.endsWith('_R'))
    for (const propName of propNamesToReset) {
      stateEntity[propName] = BigInt(0)
    }
    entitySaves.push(store.set(stateModel, stateEntity.id, stateEntity))
    entitySaves.push(store.set(snapshotModel, snapshotEntity.id, snapshotEntity))
  }
  await Promise.all(entitySaves)
}
