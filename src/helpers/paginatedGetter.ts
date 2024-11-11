import type { Entity, FieldsExpression } from '@subql/types-core'
import { EntityClass, EntityProps } from './stateSnapshot'

export async function paginatedGetter<E extends Entity>(
  entityService: EntityClass<E>,
  filter: FieldsExpression<EntityProps<E>>[]
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
  return results
}
