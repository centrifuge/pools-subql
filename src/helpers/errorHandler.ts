export interface HandlerFunction {
  (...args): Promise<void>
}

export function errorHandler(method: HandlerFunction): HandlerFunction {
  return async function <T>(...obj: T[]): Promise<any> {
    return method(...obj).catch((err) => {
      logger.error(err)
    })
  }
}
