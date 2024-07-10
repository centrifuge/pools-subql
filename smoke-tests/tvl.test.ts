const knownTVL = {
  '2024-01-01': '253434909261717851940121572',
  '2024-07-01': '12008948422649000000000000',
}

const sampleDates = Object.keys(knownTVL)

describe('TVL at known intervals', () => {
  test.each(sampleDates)('TVL at %s', async (sampleDate) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await subql<any>(`
      { poolSnapshots(filter: { periodStart: { equalTo: "${sampleDate}" } }) { aggregates { sum { normalizedNAV } } } }
    `)
    const { normalizedNav } = response.data.poolSnapshots.aggregates.sum
    expect(normalizedNav).toBe(knownTVL[sampleDate])
  })
})
