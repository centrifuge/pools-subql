import { errorHandler } from './errorHandler'

type StoreArgs = Parameters<typeof store.getByField>
type StoreReturn = ReturnType<typeof store.getByField>

interface Entity {
  id: string
}

async function _paginatedGetter(entity: StoreArgs[0], field: StoreArgs[1], value: StoreArgs[2]): StoreReturn {
  let results: Entity[] = []
  const batch = 100
  let amount = 0
  do {
    const entities = await store.getByField(entity, field, value, { offset: amount, limit: batch })
    results = results.concat(entities)
    amount += results.length
  } while (results.length === batch)
  return results
}
export const paginatedGetter = errorHandler(_paginatedGetter)
