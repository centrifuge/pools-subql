export function assertPropInitialized<T>(
  obj: T,
  propertyName: keyof T,
  type: 'string' | 'number' | 'bigint' | 'boolean' | 'symbol' | 'undefined' | 'object' | 'function'
) {
  if (typeof obj[propertyName] !== type) throw new Error(`Property ${propertyName.toString()} not initialized!`)
  return obj[propertyName]
}
