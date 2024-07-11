const lastMidnight = new Date().setHours(0, 0, 0, 0)

const chainIds = {
  CFG: '0xb3db41421702df9a7fcac62b53ffeac85f7853cc4e689e0b93aeb3db18c09d82',
  ETH: '1',
}

const chains = Object.keys(chainIds)

describe('SubQl Nodes', () => {
  test.each(chains)('%s node is fully synced', async (chain) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await subql<any>(`
      {
        timekeeper(id: "${chainIds[chain]}") {
          lastPeriodStart
        }
      }
    `)
    const lastPeriodStart = Date.parse(response.data.timekeeper.lastPeriodStart)
    expect(lastPeriodStart).toBe(lastMidnight)
  })
})
