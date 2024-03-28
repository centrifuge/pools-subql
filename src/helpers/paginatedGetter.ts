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
    entities = (await store.getByField(entity, filter[0][0] as string, filter[0][2], {
      // TODO: Revert back to getByFields
      offset: amount,
      limit: batch,
    })) as T[]
    amount = results.push(...entities)
  } while (entities.length === batch)
  return filter.length > 1 ? results.filter( entity => entity[filter[1][0]] === filter[1][2]) : results
}
