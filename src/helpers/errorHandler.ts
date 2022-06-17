/* eslint-disable @typescript-eslint/no-explicit-any */
type InferArgs<T> = T extends (...t: [...infer Arg]) => any ? Arg : never
type InferReturn<T> = T extends (...t: [...infer Arg]) => infer Res ? Res : never

/**
 * Wrapper to provide standard error handling throughout the application
 * @param method Block handler, Event handler or function for witch a generic catcher should be attached
 * @returns Same function with a corresponding ceneric catcher for error handling
 */
export function errorHandler<TFunc extends (...args: any[]) => any>(
  method: TFunc
): (...args: InferArgs<TFunc>) => InferReturn<TFunc> {
  return function <E extends Error>(...args: InferArgs<TFunc>) {
    return method(...args).catch((err: E) => {
      logger.error(err)
    })
  }
}
