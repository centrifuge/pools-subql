import { IPFS_NODE } from '../config'

export const cid = new RegExp(
  '(Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,})$'
)

export async function readIpfs<T extends Record<string, unknown>>(ipfsId: string): Promise<T> {
  const uri = `${IPFS_NODE}/ipfs/${ipfsId}`
  logger.info(`Fetching ${uri}`)
  const response = await fetch(uri, { method: 'GET' })
  return await response.json()
}
