import { Option } from '@polkadot/types'
import { AssetMetadata } from '@polkadot/types/interfaces'
import { Currency } from '../../types/models/Currency'

export class CurrencyService {
  readonly currency: Currency

  constructor(currency: Currency) {
    this.currency = currency
  }

  static init = (ticker: string, decimals: number) => {
    logger.info(`Initialising new currency ${ticker} with ${decimals} decimals`)
    const currency = new Currency(ticker)
    currency.decimals = decimals
    return new CurrencyService(currency)
  }

  static getById = async (ticker: string) => {
    const currency = await Currency.get(ticker)
    if (currency === undefined) {
      return undefined
    } else {
      return new CurrencyService(currency)
    }
  }

  static getOrInit = async (ticker: string) => {
    let currency = await this.getById(ticker)
    if (currency === undefined) {
      const assetMetadata = (await api.query.ormlAssetRegistry.metadata(ticker)) as Option<AssetMetadata>
      let decimals: number
      if (assetMetadata.isSome) {
        decimals = assetMetadata.unwrap().decimals.toNumber()
      } else if (ticker.toLowerCase().endsWith('usd')) {
        decimals = 12
      } else {
        decimals = 18
      }
      currency = this.init(ticker, decimals)
      await currency.save()
    }
    return currency
  }

  save = async () => {
    await this.currency.save()
  }
}
