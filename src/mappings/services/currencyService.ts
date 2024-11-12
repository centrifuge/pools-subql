import { Option } from '@polkadot/types'
import { AssetMetadata } from '@polkadot/types/interfaces'
import { Currency } from '../../types/models/Currency'
import { WAD_DIGITS } from '../../config'
import type { TokensCurrencyId } from '../../helpers/types'
import { ApiAt } from '../../@types/gobal'

const cfgApi = api as ApiAt

export class CurrencyService extends Currency {
  static init(chainId: string, currencyId: string, decimals: number, symbol?: string, name?: string) {
    const id = `${chainId}-${currencyId}`
    logger.info(`Initialising new currency ${id} with ${decimals} decimals`)
    const currency = new this(id, chainId, decimals)
    currency.symbol = symbol
    currency.name = name
    return currency
  }

  static async getOrInit(chainId: string, currencyType: string, ...currencyValue: string[]) {
    const currencyId = currencyValue.length > 0 ? `${currencyType}-${currencyValue.join('-')}` : currencyType
    const id = `${chainId}-${currencyId}`
    let currency: CurrencyService = (await this.get(id)) as CurrencyService
    if (!currency) {
      const enumPayload = formatEnumPayload(currencyType, ...currencyValue)
      const assetMetadata = (await cfgApi.query.ormlAssetRegistry.metadata(enumPayload)) as Option<AssetMetadata>
      const decimals = assetMetadata.isSome ? assetMetadata.unwrap().decimals.toNumber() : WAD_DIGITS
      const symbol = assetMetadata.isSome ? assetMetadata.unwrap().symbol.toUtf8() : undefined
      const name = assetMetadata.isSome ? assetMetadata.unwrap().name.toUtf8() : undefined
      currency = this.init(chainId, currencyId, decimals, symbol, name)
      await currency.save()
    }
    return currency as CurrencyService
  }

  static async getOrInitEvm(chainId: string, currencyType: string, symbol?: string, name?: string) {
    const currencyId = currencyType
    const id = `${chainId}-${currencyId}`
    let currency: CurrencyService = (await this.get(id)) as CurrencyService
    if (!currency) {
      currency = this.init(chainId, currencyId, WAD_DIGITS, symbol, name)
      await currency.save()
    }
    return currency as CurrencyService
  }

  public initTrancheDetails(
    poolId: string,
    trancheId: string,
    evmTokenAddress?: string,
    evmEscrowAddress?: string,
    evmUserEscrowAddress?: string
  ) {
    this.poolId = poolId
    this.trancheId = `${poolId}-${trancheId}`
    this.tokenAddress = evmTokenAddress
    this.escrowAddress = evmEscrowAddress
    this.userEscrowAddress = evmUserEscrowAddress
  }
}

export const currencyFormatters: CurrencyFormatters = {
  Ausd: () => [],
  ForeignAsset: (value: TokensCurrencyId['asForeignAsset']) => [value.toString(10)],
  Native: () => [''],
  Staking: () => ['BlockRewards'],
  Tranche: (value: TokensCurrencyId['asTranche']) => {
    return Array.isArray(value)
      ? [value[0].toString(10), value[1].toHex()]
      : [value.poolId.toString(10), value.trancheId.toHex()]
  },
  LocalAsset: (value: TokensCurrencyId['asLocalAsset']) => [value.toString(10)],
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
