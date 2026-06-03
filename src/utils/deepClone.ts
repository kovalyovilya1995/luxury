/**
 * Returns a deep copy of a passed value (whatever it is)
 *
 * @param value value to copy
 * @returns deeply copied value
 *
 * @example
 * const original = { foo: { bar: 'original value' }}
 * const clone = deepClone(original)
 * >> clone // { foo: { bar: 'original value' }}
 *
 * original.foo.bar = 'updated value'
 * >> original // { foo: { bar: 'updated value' }}
 * >> clone // { foo: { bar: 'original value' }}
 */

function deepClone<T>(value: T): T
function deepClone(value: any): any {
  if (value === null || typeof value !== 'object') return value

  if (value instanceof Date) {
    return new Date(value.getTime())
  }

  if (Array.isArray(value)) {
    return value.map(deepClone)
  }

  const copy: Record<any, any> = {}
  for (const key in value) {
    copy[key] = deepClone(value[key])
  }
  return copy
}

export { deepClone }
