import initWasm, { WasmDatabase } from '../pkg-web/lora_wasm.js'

let initPromise

function ensureInitialized() {
  initPromise ??= initWasm()
  return initPromise
}

function toUint8Array(bytes) {
  if (bytes instanceof Uint8Array) {
    return bytes
  }

  if (bytes instanceof ArrayBuffer) {
    return new Uint8Array(bytes)
  }

  return bytes
}

export function createWorkerDatabase() {
  const dbPromise = ensureInitialized().then(() => new WasmDatabase())

  return {
    async execute(query, params) {
      return (await dbPromise).execute(query, params)
    },
    async loadSnapshot(bytes, options = {}) {
      return (await dbPromise).loadSnapshot(toUint8Array(bytes), options)
    },
    async saveSnapshot(options = {}) {
      return (await dbPromise).saveSnapshot(options)
    },
    async nodeCount() {
      return (await dbPromise).nodeCount()
    },
    async relationshipCount() {
      return (await dbPromise).relationshipCount()
    },
    async dispose() {
      ;(await dbPromise).free()
    },
  }
}
