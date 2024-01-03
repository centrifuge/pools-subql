import { Option } from '@polkadot/types'
import { AssetMetadata } from '@polkadot/types/interfaces'
import { Currency } from '../../types/models/Currency'
import { WAD_DIGITS } from '../../config'
import type { TokensCurrencyId } from '../../helpers/types'

export class CurrencyService extends Currency {
  static init(chainId: string, currencyId: string, decimals: number) {
    const id = `${chainId}-${currencyId}`
    logger.info(`Initialising new currency ${id} with ${decimals} decimals`)
    const currency = new this(id, chainId, decimals)
    return currency
  }

  static async getOrInit(chainId: string, currencyType: string, ...currencyValue: string[]) {
    const currencyId = currencyValue.length > 0 ? `${currencyType}-${currencyValue.join('-')}` : currencyType
    const id = `${chainId}-${currencyId}`
    let currency: CurrencyService = await this.get(id)
    if (!currency) {
      const enumPayload = formatEnumPayload(currencyType, ...currencyValue)
      const assetMetadata = (await api.query.ormlAssetRegistry.metadata(enumPayload)) as Option<AssetMetadata>
      const decimals = assetMetadata.isSome ? assetMetadata.unwrap().decimals.toNumber() : WAD_DIGITS
      currency = this.init(chainId, currencyId, decimals)
      await currency.save()
    }
    return currency as CurrencyService
  }

  static async getOrInitEvm(chainId: string, currencyType: string, ...currencyValue: string[]) {
    const currencyId = currencyValue.length > 0 ? `${currencyType}-${currencyValue.join('-')}` : currencyType
    const id = `${chainId}-${currencyId}`
    let currency: CurrencyService = await this.get(id)
    if (!currency) {
      currency = this.init(chainId, currencyId, WAD_DIGITS)
      await currency.save()
    }
    return currency as CurrencyService
  }
}

export const currencyFormatters: CurrencyFormatters = {
  AUSD: () => [],
  ForeignAsset: (value) => [value.toString(10)],
  Native: () => [],
  Staking: () => ['BlockRewards'],
  Tranche: (value) => [value[0].toString(10), value[1].toHex()],
}

export function formatEnumPayload(currencyType: string, ...currencyValue: string[]) {
  let enumRequest: Record<string, null | string | string[]>
  switch (currencyValue.length) {
    case 0:
      enumRequest = { [currencyType]: null }
      break

    case 1:
      enumRequest = { [currencyType]: currencyValue[0] }
      break

    default:
      enumRequest = { [currencyType]: currencyValue }
      break
  }
  return enumRequest
}

type CurrencyFormatters = {
  [K in keyof TokensCurrencyId as K extends `as${infer R}` ? R : never]: (value: TokensCurrencyId[K]) => string[]
}
