import { AssetPosition } from '../../types/models/AssetPosition'
import { RAY } from '../../config'
import { nToBigInt, bnToBn } from '@polkadot/util'

export class AssetPositionService extends AssetPosition {
  static init(assetId: string, hash: string, timestamp: Date, quantity: bigint, price: bigint) {
    logger.info(`Initialising new assetPosition with Id ${chainId}`)
    const id = `${assetId}-${hash}`
    return new this(id, assetId, timestamp, quantity, price)
  }

  static buy(assetId: string, hash: string, timestamp: Date, quantity: bigint, price: bigint) {
    return this.init(assetId, hash, timestamp, quantity, price).save()
  }

  static async sell(assetId: string, sellingQuantity: bigint, sellingPrice: bigint) {
    const positions = await this.getByAssetId(assetId)
    positions.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())

    const sellPositions: [assetPosition: AssetPosition, sellQuantity: bigint][] = []
    let remainingQuantity = sellingQuantity
    while (remainingQuantity > BigInt(0)) {
      const currentPosition = positions.pop()
      if (!currentPosition) throw new Error(`No positions to sell for asset ${assetId}`)
      if (remainingQuantity > currentPosition.holdingQuantity) {
        const soldQuantity = currentPosition.holdingQuantity
        currentPosition['holdingQuantity'] = BigInt(0)
        sellPositions.push([currentPosition, soldQuantity])
        remainingQuantity -= soldQuantity
      } else {
        const soldQuantity = remainingQuantity
        currentPosition['holdingQuantity'] -= soldQuantity
        sellPositions.push([currentPosition, soldQuantity])
        remainingQuantity -= soldQuantity
      }
    }

    const profitFromSale = nToBigInt(bnToBn(sellingPrice).mul(bnToBn(sellingQuantity)).div(RAY))
    const costOfBuy = sellPositions.reduce<bigint>(
      (totalCost, line) => totalCost + nToBigInt(bnToBn(line[0].purchasePrice).mul(bnToBn(line[1]).div(RAY))),
      BigInt(0)
    )

    const dbUpdates = sellPositions.map((line) =>
      line[0].holdingQuantity > BigInt(0) ? line[0].save() : this.remove(line[0].id)
    )

    await Promise.all(dbUpdates)
    return profitFromSale - costOfBuy
  }
}
