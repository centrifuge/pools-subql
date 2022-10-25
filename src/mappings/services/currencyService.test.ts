import { CurrencyService } from './currencyService'

const entityName = 'Currency'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
api.query['ormlAssetRegistry'] = { metadata: jest.fn(() => ({ isSome: false })) } as any

const usdDecimals = 12
const stdDecimals = 18

test('AUSD is initialised with 12 decimals', async () => {
  const ticker = 'AUSD'
  await CurrencyService.getOrInit(ticker)

  expect(store.set).toBeCalledWith(entityName, ticker, { id: ticker, decimals: usdDecimals })
})

test('ACA is initialised with 18 decimals', async () => {
  const ticker = 'ACA'
  await CurrencyService.getOrInit(ticker)

  expect(store.set).toBeCalledWith(entityName, ticker, { id: ticker, decimals: stdDecimals })
})
