export class LoraError extends Error {
  constructor(code, message) {
    super(message)
    this.code = code
  }
}

export function isNode(value) {
  return value != null && typeof value === 'object' && value.kind === 'node'
}

export function isRelationship(value) {
  return value != null && typeof value === 'object' && value.kind === 'relationship'
}
