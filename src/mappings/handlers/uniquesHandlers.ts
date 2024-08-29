import { SubstrateEvent } from '@subql/types'
import { errorHandler } from '../../helpers/errorHandler'
import { UniquesMetadataSetEvent } from '../../helpers/types'
import { AssetService } from '../services/assetService'

export const handleAssetMetadataSet = errorHandler(_handleAssetMetadataSet)
async function _handleAssetMetadataSet(event: SubstrateEvent<UniquesMetadataSetEvent>) {
  const [_collectionId, _itemId, _metadata] = event.event.data

  const collectionId = _collectionId.toString(10)
  const itemId = _itemId.toString(10)
  const metadata = _metadata.toUtf8()

  logger.info(
    `uniques.MetadataSet event fired for ${collectionId}:${itemId}` +
      `at block ${event.block.block.header.number.toNumber()}`
  )

  const asset = await AssetService.getByNftId(collectionId, itemId)
  if (!asset) return logger.warn('Corresponding asset not found. Maybe not yet initialised? Skipping...')

  logger.info(`Found corresponding asset ${asset.id}`)

  await asset.setMetadata(metadata)
  await asset.updateIpfsAssetName()
  await asset.save()
}
