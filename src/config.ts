import { bnToBn } from '@polkadot/util'

export const SNAPSHOT_INTERVAL_SECONDS = 3600 * 24
export const WAD_DIGITS = 18
export const WAD = bnToBn(10).pow(bnToBn(WAD_DIGITS))
export const RAY_DIGITS = 27
export const RAY = bnToBn(10).pow(bnToBn(RAY_DIGITS))
export const CPREC = (digits: number) => bnToBn(10).pow(bnToBn(digits))
