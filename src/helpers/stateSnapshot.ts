import { SubstrateBlock } from '@subql/types'

interface Constructor<C> {
  new (id: string): C
}

interface TypeGetter<C> {
  getByType(type: string): Promise<C[]> | undefined
}

interface GenericState {
  id: string
  type: string
}

interface GenericSnapshot {
  id: string
  timestamp: Date
  blockNumber: number
  save(): Promise<void>
}

export async function stateSnapshotter<
  T extends Constructor<GenericState> & TypeGetter<GenericState>,
  U extends Constructor<GenericSnapshot>
>(
  stateModel: T,
  snapshotModel: U,
  block: SubstrateBlock,
  fkReferenceName: string = undefined
): Promise<Promise<void>[]> {
  let newEntitySaves = []
  if (!stateModel.hasOwnProperty('getByType')) throw new Error('stateModel has no method .hasOwnProperty()')
  const stateEntities = await stateModel.getByType('ALL')
  stateEntities.forEach((stateEntity) => {
    const blockNumber = block.block.header.number.toNumber()
    const { id, type, ...copyStateEntity } = stateEntity
    const snapshotEntity = new snapshotModel(`${id}-${blockNumber.toString()}`)
    Object.assign(snapshotEntity, copyStateEntity)
    snapshotEntity.timestamp = block.timestamp
    snapshotEntity.blockHeight = blockHeight
    if (fkReferenceName) snapshotEntity[fkReferenceName] = stateEntity.id
    newEntitySaves.push(snapshotEntity.save())
  })
  return Promise.all(newEntitySaves)
}
