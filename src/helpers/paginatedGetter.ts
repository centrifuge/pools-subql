import type { Entity, FieldsExpression, GetOptions } from '@subql/types-core'

export async function paginatedGetter<E extends Entity>(
  entityService: EntityClass<E>,
  filter: FieldsExpression<E>[]
): Promise<E[]> {
  const results: E[] = []
  const batch = 100
  let amount = 0
  let entities: E[]
  do {
    entities = await entityService.getByFields(filter, {
      offset: amount,
      limit: batch,
    })
    amount = results.push(...entities)
  } while (entities.length === batch)
  return results as E[]
}

export interface EntityClass<E extends Entity> {
  new (...args): E
  getByFields(filter: FieldsExpression<E>[], options?: GetOptions<E>): Promise<E[]>
  create(record): E
}
