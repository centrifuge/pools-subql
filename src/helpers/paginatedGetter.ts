import { errorHandler } from './errorHandler'
import type { Entity } from '@subql/types-core'

type StoreArgs = Parameters<typeof store.getByField>

async function _paginatedGetter(entity: StoreArgs[0], field: StoreArgs[1], value: StoreArgs[2]): Promise<Entity[]> {
  let results: Entity[] = []
  const batch = 100
  let amount = 0
  let entities: Entity[]
  do {
    entities = (await store.getByField(entity, field, value, {
      offset: amount,
      limit: batch,
    })) as Entity[]
    results = results.concat(entities)
    amount += entities.length
  } while (entities.length > 0)
  return results
}
export const paginatedGetter = errorHandler(_paginatedGetter)
