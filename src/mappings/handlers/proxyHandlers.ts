import { SubstrateEvent } from '@subql/types'
import { Proxy, PureProxy } from '../../types'

export async function handleProxyAdded(event: SubstrateEvent): Promise<void> {
  logger.info(`Proxy added: ${event.toString()}`)

  const [delegator, delegatee, proxyType, delay] = event.event.data

  const proxy = new Proxy(`${delegator.toString()}-${delegatee.toString()}-${proxyType.toString()}}`)
  proxy.delegator = delegator.toString()
  proxy.delegatee = delegatee.toString()
  proxy.proxyType = proxyType.toString()
  // TODO: store delay
  await proxy.save()
}

export async function handleProxyPureCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Pure proxy created: ${event.toString()}`)

  const [account, createdBy, proxyType] = event.event.data

  const pureProxy = new PureProxy(`${account.toString()}`)
  pureProxy.accountId = account.toString()
  pureProxy.createdBy = createdBy.toString()
  pureProxy.proxyType = proxyType.toString()
  await pureProxy.save()

  const proxy = new Proxy(`${account.toString()}-${createdBy.toString()}-${proxyType.toString()}}`)
  proxy.delegator = account.toString()
  proxy.delegatee = createdBy.toString()
  proxy.proxyType = proxyType.toString()
  await proxy.save()
}

export async function handleProxyRemoved(event: SubstrateEvent): Promise<void> {
  logger.info(`Proxy removed: ${event.toString()}`)

  const [delegator, delegatee, proxyType] = event.event.data
  await Proxy.remove(`${delegator.toString()}-${delegatee.toString()}-${proxyType.toString()}}`)
}
