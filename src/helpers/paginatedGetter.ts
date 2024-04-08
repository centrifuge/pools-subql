import type { Entity, FieldsExpression } from '@subql/types-core'

export async function paginatedGetter<T extends Entity>(
  entity: T['_name'],
  filter: FieldsExpression<T>[]
): Promise<T[]> {
  const results: T[] = []
  const batch = 100
  let amount = 0
  let entities: T[]
  do {
    entities = (await store.getByFields(entity, filter, {
      offset: amount,
      limit: batch,
    }))
    amount = results.push(...entities)
  } while (entities.length === batch)
  return results
}
