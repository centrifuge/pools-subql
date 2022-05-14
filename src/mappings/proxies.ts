import { SubstrateEvent } from '@subql/types'

export async function handleProxyAdded(event: SubstrateEvent): Promise<void> {
  logger.info(`Proxy added: ${event.toString()}`)

  // const proxy = new Proxy(`${event.delegator.toString()}-${epochId.toString()}`)
  // await proxy.save()
}

// TODO: handleProxyRemoved
// TODO: handleProxyAnonymousCreated
