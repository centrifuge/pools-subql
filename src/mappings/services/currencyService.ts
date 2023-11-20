import { Option } from '@polkadot/types'
import { AssetMetadata } from '@polkadot/types/interfaces'
import { Currency } from '../../types/models/Currency'

export class CurrencyService extends Currency {
  static init(ticker: string, decimals: number) {
    logger.info(`Initialising new currency ${ticker} with ${decimals} decimals`)
    const currency = new this(ticker, decimals)
    return currency
  }

  static async getOrInit(ticker: string, assetId?: string) {
    const id = assetId ? `${ticker}-${assetId}` : ticker
    let currency = await this.get(id)
    if (currency === undefined) {
      const assetMetadata = (await api.query.ormlAssetRegistry.metadata({
        [ticker]: assetId ?? null,
      })) as Option<AssetMetadata>
      let decimals: number
      if (assetMetadata.isSome) {
        decimals = assetMetadata.unwrap().decimals.toNumber()
      } else if (ticker.toLowerCase().endsWith('usd')) {
        decimals = 12
      } else {
        decimals = 18
      }
      currency = this.init(id, decimals)
      await currency.save()
    }
    return currency as CurrencyService
  }
}
