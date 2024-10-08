import { EntityClass, paginatedGetter } from './paginatedGetter'
import type { Entity } from '@subql/types-core'
import { EthereumBlock } from '@subql/types-ethereum'
import { SubstrateBlock } from '@subql/types'
/**
 * Creates a snapshot of a generic stateModel to a snapshotModel.
 * A snapshotModel has the same fields as the originating stateModel, however a timestamp and a blockNumber are added.
 * Fields ending with an ByPeriod underscore are reset to 0 at the end of a period.
 * All such resettable fields must be of type
 * BigInt.
 * @param stateModel - the data model to be snapshotted
 * @param snapshotModel - the data model where the snapshot is saved. (must have additional timestamp and
 * blockNumber fields)
 * @param block - the correspondint substrateBlock to provide additional state values to the snapshot
 * @param fkReferenceName - (optional) name of the foreignKey to save a reference to the originating entity.
 * @param resetPeriodStates - (optional) reset properties ending in ByPeriod to 0 after snapshot (defaults to true).
 * @returns A promise resolving when all state manipulations in the DB is completed
 */
async function stateSnapshotter<T extends SnapshottableEntity, U extends SnapshottedEntityProps>(
  relationshipField: ForeignKey,
  relationshipId: string,
  stateModel: EntityClass<T>,
  snapshotModel: EntityClass<U>,
  block: { number: number; timestamp: Date },
  filterKey?: keyof T,
  filterValue?: T[keyof T],
  fkReferenceName?: ForeignKey,
  resetPeriodStates = true,
  blockchainId: T['blockchainId'] = '0'
): Promise<void[]> {
  const entitySaves: Promise<void>[] = []
  logger.info(`Performing snapshots of ${stateModel.prototype._name} for blockchainId ${blockchainId}`)
  const filter: Parameters<typeof paginatedGetter<T>>[1] = [['blockchainId', '=', blockchainId]]
  if (filterKey && filterValue) filter.push([filterKey, '=', filterValue])
  const stateEntities = (await paginatedGetter(stateModel, filter)) as SnapshottableEntity[]
  if (stateEntities.length === 0) logger.info(`No ${stateModel.prototype._name} to snapshot!`)
  for (const stateEntity of stateEntities) {
    const blockNumber = block.number
    const { id, ...copyStateEntity } = stateEntity
    logger.info(`Snapshotting ${stateModel.prototype._name}: ${id}`)
    const snapshotEntity: SnapshottedEntityProps = snapshotModel.create({
      ...copyStateEntity,
      id: `${id}-${blockNumber.toString()}`,
      timestamp: block.timestamp,
      blockNumber: blockNumber,
      [relationshipField]: relationshipId,
    })
    if (fkReferenceName) snapshotEntity[fkReferenceName] = stateEntity.id

    const propNames = Object.getOwnPropertyNames(stateEntity)
    const propNamesToReset = propNames.filter((propName) => propName.endsWith('ByPeriod')) as ResettableKey[]
    if (resetPeriodStates) {
      for (const propName of propNamesToReset) {
        logger.debug(`resetting ${stateEntity._name.toLowerCase()}.${propName} to 0`)
        stateEntity[propName] = BigInt(0)
      }
      entitySaves.push(stateEntity.save())
    }
    entitySaves.push(snapshotEntity.save())
  }
  return Promise.all(entitySaves)
}
export function evmStateSnapshotter<T extends SnapshottableEntity, U extends SnapshottedEntityProps>(
  relationshipField: ForeignKey,
  relationshipId: string,
  stateModel: EntityClass<T>,
  snapshotModel: EntityClass<U>,
  block: EthereumBlock,
  filterKey?: keyof T,
  filterValue?: T[keyof T],
  fkReferenceName?: ForeignKey,
  resetPeriodStates = true
): Promise<void[]> {
  const formattedBlock = { number: block.number, timestamp: new Date(Number(block.timestamp) * 1000) }
  return stateSnapshotter<T, U>(
    relationshipField,
    relationshipId,
    stateModel,
    snapshotModel,
    formattedBlock,
    filterKey,
    filterValue,
    fkReferenceName,
    resetPeriodStates,
    '1'
  )
}

export function substrateStateSnapshotter<T extends SnapshottableEntity, U extends SnapshottedEntityProps>(
  relationshipField: ForeignKey,
  relationshipId: string,
  stateModel: EntityClass<T>,
  snapshotModel: EntityClass<U>,
  block: SubstrateBlock,
  filterKey?: keyof T,
  filterValue?: T[keyof T],
  fkReferenceName?: ForeignKey,
  resetPeriodStates = true
): Promise<void[]> {
  const formattedBlock = { number: block.block.header.number.toNumber(), timestamp: block.timestamp }
  return stateSnapshotter<T, U>(
    relationshipField,
    relationshipId,
    stateModel,
    snapshotModel,
    formattedBlock,
    filterKey,
    filterValue,
    fkReferenceName,
    resetPeriodStates,
    '0'
  )
}

type ResettableKey = `${string}ByPeriod`
type ForeignKey = `${string}Id`

export interface SnapshottableEntity extends Entity {
  blockchainId: string
}

export interface SnapshottedEntityProps extends Entity {
  blockNumber: number
  timestamp: Date
  periodId?: string
  epochId?: string
}
