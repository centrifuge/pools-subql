import type { Config } from 'jest'

const config: Config = {
  verbose: false,
  workerThreads: true,
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFiles: ['./jest/smoke.js'],
  moduleFileExtensions: ['ts', 'tsx', 'js'],
  testMatch: [ '**/smoke-tests/**/*.test.ts' ],
  transform: {
    // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        tsconfig: './tsconfig.json',
      },
    ],
  },
}

export default config
