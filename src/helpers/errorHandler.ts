export function errorHandler<E extends Error, F extends Function>(method: F) {
  return async function (...obj) {
    return method(...obj).catch((err: E) => {
      logger.error(err)
    })
  }
}
