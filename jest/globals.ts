/* eslint-disable @typescript-eslint/no-explicit-any */

import { jest } from '@jest/globals'

const globalHere: any = global

globalHere.store = {
  get: jest.fn(),
  getByField: jest.fn(),
  getOneByField: jest.fn(),
  set: jest.fn((...args) => args[2]),
  bulkCreate: jest.fn(),
  bulkUpdate: jest.fn(),
  remove: jest.fn(),
}

globalHere.logger = {
  fatal: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
}

globalHere.api = { query: {}, rpc: {} }
