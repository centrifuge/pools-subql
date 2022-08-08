import { bnToBn } from '@polkadot/util'

export const SNAPSHOT_INTERVAL_SECONDS = 3600 * 24
export const WAD = bnToBn(10).pow(bnToBn(18))
export const RAY = bnToBn(10).pow(bnToBn(27))
