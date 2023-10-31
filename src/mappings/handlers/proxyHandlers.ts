import { SubstrateEvent } from '@subql/types'
import { Proxy, PureProxy } from '../../types'
import { AccountService } from '../services/accountService'

export async function handleProxyAdded(event: SubstrateEvent): Promise<void> {
  logger.info(`Proxy added: ${event.toString()}`)

  const [delegator, delegatee, proxyType] = event.event.data //delay is the fourth element

  const proxy = new Proxy(
    `${delegator.toString()}-${delegatee.toString()}-${proxyType.toString()}}`,
    delegator.toString(),
    delegatee.toString()
  )
  proxy.proxyType = proxyType.toString()
  // TODO: store delay
  await proxy.save()
}

export async function handleProxyPureCreated(event: SubstrateEvent): Promise<void> {
  logger.info(`Pure proxy created: ${event.toString()}`)

  const [address, createdByAddress, proxyType] = event.event.data

  const account = await AccountService.getOrInit(address.toString())
  const createdBy = await AccountService.getOrInit(createdByAddress.toString())

  const pureProxy = new PureProxy(`${account.toString()}`, account.id, createdBy.id)
  pureProxy.proxyType = proxyType.toString()
  await pureProxy.save()

  const proxy = new Proxy(`${account.id}-${createdBy.id}-${proxyType.toString()}}`, account.id, createdBy.id)
  proxy.proxyType = proxyType.toString()
  await proxy.save()
}

export async function handleProxyRemoved(event: SubstrateEvent): Promise<void> {
  logger.info(`Proxy removed: ${event.toString()}`)

  const [delegator, delegatee, proxyType] = event.event.data
  await Proxy.remove(`${delegator.toString()}-${delegatee.toString()}-${proxyType.toString()}}`)
}
