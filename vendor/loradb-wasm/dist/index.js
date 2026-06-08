import { createRequire } from 'node:module'

const require = createRequire(import.meta.url)
const { WasmDatabase } = require('../pkg-node/lora_wasm.js')

function toUint8Array(bytes) {
  if (bytes instanceof Uint8Array) {
    return bytes
  }

  if (bytes instanceof ArrayBuffer) {
    return new Uint8Array(bytes)
  }

  return bytes
}

export async function createDatabase() {
  const db = new WasmDatabase()

  return {
    execute(query, params) {
      return db.execute(query, params)
    },
    loadSnapshot(bytes, options = {}) {
      return db.loadSnapshot(toUint8Array(bytes), options)
    },
    saveSnapshot(options = {}) {
      return db.saveSnapshot(options)
    },
    nodeCount() {
      return db.nodeCount()
    },
    relationshipCount() {
      return db.relationshipCount()
    },
    dispose() {
      db.free()
    },
  }
}
