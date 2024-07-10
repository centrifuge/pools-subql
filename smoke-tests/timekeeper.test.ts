const lastMidnight = new Date().setHours(0,0,0,0)

describe('SubQl Nodes', () => {
  test('CFG node is fully synced', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await subql<any>(`
      {
        timekeeper(id: "0xb3db41421702df9a7fcac62b53ffeac85f7853cc4e689e0b93aeb3db18c09d82") {
          lastPeriodStart
        }
      }
    `)
    const lastPeriodStart = Date.parse(response.data.timekeeper.lastPeriodStart)
    expect(lastPeriodStart).toBe(lastMidnight)
  })

  test('ETH node is fully synced', async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await subql<any>(`
      {
        timekeeper(id: "1") {
          lastPeriodStart
        }
      }
    `)

    const lastPeriodStart = Date.parse(response.data.timekeeper.lastPeriodStart)
    expect(lastPeriodStart).toBe(lastMidnight)
  })
})
