import { errorLogger } from '../../helpers/errorHandler'
import { ExtendedCall } from '../../helpers/types'
import { TrancheService } from './trancheService'

api.query['ormlTokens'] = {
  totalIssuance: jest.fn(() => ({ toBigInt: () => BigInt('9999000000000000000000') })),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

// eslint-disable-next-line @typescript-eslint/no-explicit-any
api['runtimeVersion'] = { specVersion: { toNumber: ()=> 1029 } } as any

api.call['poolsApi'] = {
  trancheTokenPrices: jest.fn(() => ({
    isSome: true,
    isNone: false,
    unwrap: () => [{ toBigInt: () => BigInt('2000000000000000000') }, { toBigInt: () => BigInt('0') }],
  })),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any

const poolId = '4355663',
  trancheIds = ['0x855f5572a85a957c48ef266a3f240ea0', '0x855f5572a85a957c48ef266a3f240ea1']

const trancheDataResidual = {
  trancheType: { isResidual: true },
  seniority: { toNumber: () => 0 },
  debt: { toBigInt: () => BigInt(0) },
}
const trancheDataNonResidual = {
  trancheType: {
    isResidual: false,
    asNonResidual: {
      interestRatePerSec: { toBigInt: () => BigInt('34000000000000') },
      minRiskBuffer: { toBigInt: () => BigInt('22000000000000') },
    },
  },
  seniority: { toNumber: () => 1 },
  debt: { toBigInt: () => BigInt(0) },
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const trancheData = [trancheDataResidual, trancheDataNonResidual] as any

const tranches = trancheIds.map((trancheId, i) => {
  const tranche = TrancheService.seed(poolId, trancheId)
  return tranche.init(i, trancheData[i])
})

describe('Given a new tranche, when initialised', () => {
  test('then type is set to "ALL"', () => {
    expect(tranches[0].type).toBe('ALL')
    expect(tranches[1].type).toBe('ALL')
  })

  test('then reset accumulators are set to 0', () => {
    const resetAccumulators = Object.getOwnPropertyNames(tranches[0]).filter((prop) => prop.endsWith('ByPeriod'))
    for (const resetAccumulator of resetAccumulators) {
      expect(tranches[0][resetAccumulator]).toBe(BigInt(0))
      expect(tranches[1][resetAccumulator]).toBe(BigInt(0))
    }
  })

  test('when the supply data is fetched, then the correct values are fetched and set', async () => {
    await tranches[0].updateSupply()
    expect(api.query.ormlTokens.totalIssuance).toHaveBeenCalledWith({ Tranche: [poolId, trancheIds[0]] })
    expect(tranches[0]).toMatchObject({ tokenSupply: BigInt('9999000000000000000000') })
  })

  test('then it can be saved to the database', async () => {
    await tranches[0].save()
    expect(store.set).toHaveBeenCalledWith('Tranche', `${poolId}-${trancheIds[0]}`, expect.anything())
  })
})

describe('Given an existing tranche,', () => {
  test('when the runtime price is updated, then the value is fetched and set correctly', async () => {
    await tranches[0].updatePriceFromRuntime(4058351).catch(errorLogger)
    expect((api.call as ExtendedCall).poolsApi.trancheTokenPrices).toHaveBeenCalled()
    expect(tranches[0].tokenPrice).toBe(BigInt('2000000000000000000'))
  })

  test('when a 0 runtime price is delivered, then the value is skipped and logged', async () => {
    await tranches[1].updatePriceFromRuntime(4058352).catch(errorLogger)
    expect((api.call as ExtendedCall).poolsApi.trancheTokenPrices).toHaveBeenCalled()
    expect(logger.error).toHaveBeenCalled()
    expect(tranches[1].tokenPrice).toBe(BigInt('1000000000000000000'))
  })
})
