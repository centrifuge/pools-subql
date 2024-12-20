import { AssetCashflow } from '../../types/models/AssetCashflow'

export class AssetCashflowService extends AssetCashflow {
  static init(assetId: string, timestamp: Date, principal: bigint, interest: bigint) {
    const id = `${assetId}-${timestamp.valueOf()}`
    logger.info(`Initialising new AssetCashflow with Id ${id}`)
    return new this(id, assetId, timestamp, principal, interest)
  }

  static async recordAssetCashflows(_assetId: string) {
    const specVersion = api.runtimeVersion.specVersion.toNumber()
    if (specVersion < 1103) return
    const [poolId, assetId] = _assetId.split('-')
    logger.info(`Recording AssetCashflows for Asset ${_assetId}`)
    logger.info(`Calling runtime API loansapi.expectedCashflows(${poolId}, ${assetId})`)
    const response = await api.call.loansApi.expectedCashflows(poolId, assetId)
    logger.info(JSON.stringify(response))
    if(!response.isOk) return
    await this.clearAssetCashflows(_assetId)
    const saves = response.asOk.map((cf) => {
      const { when, principal, interest } = cf
      const timestamp = new Date(when.toNumber() * 1000)
      const cashflow = this.init(_assetId, timestamp, principal.toBigInt(), interest.toBigInt())
      return cashflow.save()
    })
    return Promise.all(saves)
  }

  static async clearAssetCashflows(assetId: string) {
    logger.info(`Clearing AssetCashflows for asset: ${assetId}`)
    const cashflows = await this.getByAssetId(assetId, { limit: 100 })
    const deletes = cashflows.map((cf) => this.remove(cf.id))
    return Promise.all(deletes)
  }
}
