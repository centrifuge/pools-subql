import { CurrencyService } from './currencyService'

const entityName = 'Currency'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
api.query['ormlAssetRegistry'] = { metadata: jest.fn(() => ({ isSome: false })) } as any

const stdDecimals = 18

test('ACA is initialised with 18 decimals', async () => {
  const chainId = '2030'
  const ticker = 'ACA'
  await CurrencyService.getOrInit(chainId, ticker)

  expect(store.set).toHaveBeenCalledWith(entityName, `${chainId}-${ticker}`, {
    id: `${chainId}-${ticker}`,
    decimals: stdDecimals,
    chainId,
  })
})
