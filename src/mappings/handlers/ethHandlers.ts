import { createTrancheTrackerDatasource } from '../../types'
import { errorHandler } from '../../helpers/errorHandler'
import { DeployTrancheLog } from '../../types/abi-interfaces/PoolManagerAbi'
import { TransferLog } from '../../types/abi-interfaces/Erc20Abi'

export const handleEvmDeployTranche = errorHandler(_handleEvmDeployTranche)
async function _handleEvmDeployTranche(event: DeployTrancheLog): Promise<void> {
  const [ poolId, trancheId, tokenAddress ] = event.args
  logger.info(`Adding DynamicSource for pool ${poolId.toString()}-${trancheId.toString()} token: ${tokenAddress}`)
  await createTrancheTrackerDatasource(({ address: tokenAddress }))
}

export const handleEvmTransfer = errorHandler(_handleEvmTransfer)
async function _handleEvmTransfer(event: TransferLog): Promise<void> {
  const [ from, to, amount ] = event.args
  logger.info(`Transfer ${from}-${to} of ${amount.toString()}`)
}
