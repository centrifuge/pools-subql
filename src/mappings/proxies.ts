import { SubstrateEvent } from '@subql/types'
import { Proxy, AnonymousProxy } from '../types'

export async function handleProxyAdded(event: SubstrateEvent): Promise<void> {
  logger.info(`Proxy added: ${event.toString()}`)

  const [delegator, delegatee, proxyType, delay] = event.event.data

  const proxy = new Proxy(`${delegator.toString()}-${delegatee.toString()}-${proxyType.toString()}}`)
  proxy.delegator = delegator.toString()
  proxy.delegatee = delegatee.toString()
  proxy.proxyType = proxyType.toString()
  proxy.delay = Number(delay.toString())
  await proxy.save()
}

export async function handleProxyAnonymousCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Anonymous proxy created: ${event.toString()}`)

  const [account, createdBy, proxyType, _index] = event.event.data

  const anonymousProxy = new AnonymousProxy(`${account.toString()}`)
  anonymousProxy.account = account.toString()
  anonymousProxy.createdBy = createdBy.toString()
  anonymousProxy.proxyType = proxyType.toString()
  await anonymousProxy.save()

  const proxy = new Proxy(`${account.toString()}-${createdBy.toString()}-${proxyType.toString()}}`)
  proxy.delegator = account.toString()
  proxy.delegatee = createdBy.toString()
  proxy.proxyType = proxyType.toString()
  await proxy.save()
}

export async function handleProxyRemoved(event: SubstrateEvent): Promise<void> {
  logger.info(`Proxy removed: ${event.toString()}`)

  const [delegator, delegatee, proxyType, delay] = event.event.data
  await Proxy.remove((`${delegator.toString()}-${delegatee.toString()}-${proxyType.toString()}}`)
}
