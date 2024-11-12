import { ApiAt } from '../../@types/gobal'
import { AccountService } from './accountService'

const cfgApi = api as ApiAt

global.getNodeEvmChainId = () => Promise.resolve('2030')
// eslint-disable-next-line @typescript-eslint/no-explicit-any
cfgApi.query['evmChainId'] = { chainId: jest.fn(() => ({ toString: () => '2030' })) } as any

test('Account is created in database', async () => {
  const id = 'ABCDE'
  const account = await AccountService.init(id)
  await account.save()

  expect(logger.info).toHaveBeenCalled()
  expect(store.set).toHaveBeenCalledWith('Account', id, { id, chainId: '0' })
})
