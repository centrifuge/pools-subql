import * as Models from '../src/types/models'

const snapshotModels = Object.keys(Models)
  .filter((modelName) => modelName.endsWith('Snapshot'))
  .map((modelName) => `${modelName.charAt(0).toLowerCase() + modelName.slice(1)}s`)

describe('Entities snapshots', () => {
  test.each(snapshotModels)('%s should have some snapshots', async (snapshotModel) => {
    const queryModelName = `${snapshotModel}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subqlResponse = await subql<any>(`{ ${queryModelName} { totalCount } }`)
    const { totalCount } = subqlResponse.data[queryModelName]
    expect(totalCount).toBeGreaterThan(0)
  })
})
