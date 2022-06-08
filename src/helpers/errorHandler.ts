type InferArgs<T> = T extends (...t: [...infer Arg]) => any ? Arg : never
type InferReturn<T> = T extends (...t: [...infer Arg]) => infer Res ? Res : never

export function errorHandler<TFunc extends (...args: any[]) => any>(
  method: TFunc
): (...args: InferArgs<TFunc>) => InferReturn<TFunc> {
  return function <E extends Error>(...args: InferArgs<TFunc>) {
    return method(...args).catch((err: E) => {
      logger.error(err)
    })
  }
}
