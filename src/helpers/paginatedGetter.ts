import { errorHandler } from './errorHandler'
import type { Entity } from '@subql/types-core'

type StoreArgs = Parameters<typeof store.getByField>

async function _paginatedGetter(
  entity: StoreArgs[0],
  field: StoreArgs[1],
  value: StoreArgs[2]
): Promise<Entity[]> {
  let results: Entity[] = []
  const batch = 100
  let amount = 0
  do {
    const entities: Entity[] = (await store.getByField(entity, field, value, {
      offset: amount,
      limit: batch,
    })) as Entity[]
    results = results.concat(entities)
    amount += results.length
  } while (results.length === batch)
  return results
}
export const paginatedGetter = errorHandler(_paginatedGetter)
