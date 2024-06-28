import { ExtendedCall } from '../../helpers/types'
import { AssetCashflow } from '../../types/models/AssetCashflow'

export class AssetCashflowService extends AssetCashflow {
  static init(poolId: string, assetId: string, timestamp: Date, principal: bigint, interest: bigint) {
    logger.info(`Initialising new AssetCashflow with Id ${chainId}`)
    return new this(
      `${poolId}-${assetId}-${timestamp}`,
      assetId,
      timestamp,
      principal,
      interest
    )
  }

  static async recordAssetCashflows(poolId: string, assetId: string) {
    const specVersion = api.runtimeVersion.specVersion.toNumber()
    if(specVersion < 1103) return
    const apiCall = api.call as ExtendedCall
    const response = await apiCall.loansApi.expectedCashflows(poolId, assetId)
    const saves = response.map( ( cf ) => {
      const { when, principal, interest } = cf
      const timestamp = new Date(when.toNumber() * 1000)
      const cashflow = this.init(poolId, assetId, timestamp, principal.toBigInt(), interest.toBigInt())
      return cashflow.save()
    })
    return Promise.all(saves)
  }
}
