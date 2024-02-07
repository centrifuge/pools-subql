global['store'] = {
  get: jest.fn(),
  getByField: jest.fn(),
  getOneByField: jest.fn(),
  set: jest.fn((...args) => args[2]),
  bulkCreate: jest.fn(),
  bulkUpdate: jest.fn(),
  remove: jest.fn(),
}

global['logger'] = {
  fatal: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  trace: jest.fn(),
}

global['api'] = { query: {}, rpc: {} }

global['chainId'] = '0xb3db41421702df9a7fcac62b53ffeac85f7853cc4e689e0b93aeb3db18c09d82'
