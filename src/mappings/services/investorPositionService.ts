import { InvestorPosition } from '../../types/models/InvestorPosition'
import { WAD } from '../../config'
import { nToBigInt, bnToBn, BN } from '@polkadot/util'
import assert from 'assert'

export class InvestorPositionService extends InvestorPosition {
  static init(accountId: string, trancheId: string, hash: string, timestamp: Date, quantity: bigint, price: bigint) {
    const [poolId] = trancheId.split('-')
    assert(quantity, 'Missing quantity')
    assert(price, 'Missing price')
    assert(hash, 'Missing hash')
    const id = `${accountId}-${trancheId}-${hash}`
    logger.info(
      `Initialising new InvestorPosition with Id ${id} ` +
        `holdingQuantity: ${quantity.toString(10)} price: ${price.toString(10)}`
    )
    return new this(id, accountId, poolId, trancheId, timestamp, quantity, price)
  }

  static buy(accountId: string, trancheId: string, hash: string, timestamp: Date, quantity: bigint, price: bigint) {
    if (quantity > BigInt(0)) {
      return this.init(accountId, trancheId, hash, timestamp, quantity, price).save()
    } else {
      logger.warn(`Skipping tranche position ${trancheId}-${hash} as quantity is 0`)
      return Promise.resolve()
    }
  }

  static async sellFifo(accountId: string, trancheId: string, sellingQuantity: bigint, sellingPrice: bigint) {
    assert(sellingPrice, 'Missing price')
    assert(sellingQuantity, 'Missing quantity')
    logger.info(
      `Selling positions for ${trancheId} ` +
        `sellingQuantity: ${sellingQuantity.toString(10)} sellingPrice: ${sellingPrice.toString(10)}`
    )
    if (sellingQuantity <= BigInt(0)) return BigInt(0)
    const positions = await this.getByFields(
      [
        ['accountId', '=', accountId],
        ['trancheId', '=', trancheId],
      ],
      { limit: 100 }
    )
    positions.sort((a, b) => b.timestamp.valueOf() - a.timestamp.valueOf())

    const sellPositions: [InvestorPosition: InvestorPosition, sellQuantity: bigint][] = []
    let remainingQuantity = sellingQuantity
    while (remainingQuantity > BigInt(0)) {
      const currentPosition = positions.pop()
      if (!currentPosition) throw new Error(`No positions to sell for tranche ${trancheId}`)
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

    const profitFromSale = nToBigInt(bnToBn(sellingPrice).mul(bnToBn(sellingQuantity)).div(WAD))
    const costOfBuy = nToBigInt(
      sellPositions.reduce<BN>(
        (totalCost, line) => totalCost.add(bnToBn(line[0].purchasePrice).mul(bnToBn(line[1]).div(WAD))),
        new BN(0)
      )
    )

    const dbUpdates = sellPositions.map((line) =>
      line[0].holdingQuantity > BigInt(0) ? line[0].save() : this.remove(line[0].id)
    )

    await Promise.all(dbUpdates)
    return profitFromSale - costOfBuy
  }

  static async computeUnrealizedProfitAtPrice(accountId: string, trancheId: string, sellingPrice: bigint) {
    if (!sellingPrice || sellingPrice <= BigInt(0)) return BigInt(0)
    logger.info(`Computing unrealizedProfit at price ${sellingPrice} for tranche ${trancheId}`)
    const sellingPositions = await this.getByFields(
      [
        ['accountId', '=', accountId],
        ['trancheId', '=', trancheId],
      ],
      { limit: 100 }
    )
    const sellingQuantity = sellingPositions.reduce<bigint>(
      (result, position) => result + position.holdingQuantity,
      BigInt(0)
    )
    const profitFromSale = nToBigInt(bnToBn(sellingPrice).mul(bnToBn(sellingQuantity)).div(WAD))
    const costOfBuy = nToBigInt(
      sellingPositions.reduce<BN>(
        (totalCost, line) => totalCost.add(bnToBn(line.purchasePrice).mul(bnToBn(line.holdingQuantity).div(WAD))),
        new BN(0)
      )
    )
    return profitFromSale - costOfBuy
  }
}
