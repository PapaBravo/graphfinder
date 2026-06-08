/* tslint:disable */
/* eslint-disable */
/**
 * Call once at module start to install a panic hook that routes Rust
 * panics to `console.error`. No-op if compiled without the default feature.
 */
export function init(): void;
/**
 * Inspect snapshot header metadata from raw bytes without loading the
 * snapshot into a database. Decodes only the envelope/manifest — no
 * decryption or body decompression — so this works on encrypted snapshots
 * too. Returns a plain object:
 * `{ formatVersion, walLsn, nodeCount, relationshipCount, compression,
 *    encrypted, keyId }`.
 */
export function snapshotInfo(bytes: Uint8Array): any;
/**
 * In-memory Lora graph database handle.
 */
export class WasmDatabase {
  free(): void;
  nodeCount(): number;
  /**
   * Run a query and serialize the result rows as the chosen format.
   * `format` is one of `"jsonl"`, `"json"`, or `"csv"`. Returns the
   * encoded bytes as a `Uint8Array` plus a row count.
   *
   * Returns `{ bytes: Uint8Array, stats: { rows: number } }`.
   */
  exportRows(query: string, params: any, format: string): any;
  /**
   * Live `GraphStats` snapshot for the Stats side panel.
   *
   * `GraphStats` carries `BTreeMap<(String, String), usize>` fields
   * (distinct-value counts, per-index scope sets) that don't round-trip
   * through plain JSON keys. We flatten them to arrays of
   * `{ label, property, count? }` records so the JS side gets a
   * stable shape it can render without further reshaping.
   */
  graphStats(): any;
  /**
   * Decode rows from `bytes` and apply them through the supplied
   * [`RowMapping`]. `mapping` is JSON-serialised; see the `RowMapping`
   * shape in `lora-io`. Returns `{ rows, batches }`.
   */
  importRows(bytes: Uint8Array, format: string, mapping: any, batch_size?: number | null): any;
  /**
   * Open a streaming row-export cursor. Each `next()` call pulls a
   * chunk of rows, encodes them, and returns the encoded bytes as
   * a `Uint8Array`. Returns `null` once the cursor is fully drained
   * (and closes the cursor as a side effect).
   */
  openExport(query: string, params: any, format: string): WasmRowExport;
  /**
   * Open a streaming row-import cursor. The caller feeds chunks of
   * bytes via [`WasmRowImport::feed`]; the cursor accumulates them
   * into completed records, batches them, and runs each batch as
   * one `UNWIND $rows AS r ...` Cypher statement. JSON-array format
   * is rejected — use JSONL for streaming JSON imports.
   *
   * `mappingOrTemplate` is either a JSON object matching `RowMapping`
   * (auto-mapping path) or a string containing a Cypher template
   * that binds `$rows` (escape hatch). The distinction is made by
   * JS type — strings go straight to the template path.
   */
  openImport(format: string, mapping_or_template: any, batch_size?: number | null, dry_run?: boolean | null, permissive?: boolean | null): WasmRowImport;
  /**
   * Open a true native row stream. Rows are pulled from the Rust executor
   * one `next()` call at a time.
   */
  openStream(query: string, params: any): WasmQueryStream;
  /**
   * Execute an array of `{ query, params? }` statements inside one native
   * transaction. Returns an array of query results in statement order.
   */
  transaction(statements: any, mode?: string | null): any;
  /**
   * Replace the graph state with a database snapshot decoded from `bytes`.
   * Legacy store snapshot bytes are accepted for compatibility.
   *
   * Returns a plain object matching the shape of `SnapshotMeta`:
   * `{ formatVersion, nodeCount, relationshipCount, walLsn }`.
   */
  loadSnapshot(bytes: Uint8Array, options: any): any;
  /**
   * Approximate retained-heap breakdown for the Stats side panel.
   * Cheap to compute; not on a hot path. See
   * [`lora_store::MemoryReport`] for the methodology.
   */
  memoryReport(): any;
  /**
   * Serialize the graph into database snapshot bytes. The caller is
   * responsible for writing them to IndexedDB, localStorage, a server, or
   * another host-provided store — WASM has no direct filesystem access.
   * The returned bytes can later be passed to `loadSnapshot` on any
   * `WasmDatabase` instance.
   *
   * Returns the serialized bytes as a `Uint8Array`.
   */
  saveSnapshot(options: any): Uint8Array;
  /**
   * Execute a Lora query and return the result as a binary buffer.
   *
   * Wire format is the shared `lora_binding_buffer` layout. The TS
   * wrapper decodes it once into the same `{ columns, rows }` shape
   * `execute()` returns, but in a tight V8 loop instead of going
   * through `serde_wasm_bindgen` value-by-value. Materially faster
   * on bulk reads.
   */
  executeBuffer(query: string, params: any): Uint8Array;
  relationshipCount(): number;
  /**
   * Decode rows from `bytes` and execute `template` once per batch
   * with `$rows` bound to the batch payload. Escape hatch for the
   * auto-mapping path: anything Cypher accepts can be used here.
   */
  importRowsWithCypher(bytes: Uint8Array, format: string, template: string, batch_size?: number | null): any;
  constructor();
  clear(): void;
  /**
   * Execute a Lora query. `params` may be `undefined`, `null`, or a
   * plain object keyed by parameter name.
   *
   * Returns `{ columns: string[], rows: Array<Record<string, LoraValue>> }`
   * as a plain JS object (structured-clonable).
   */
  execute(query: string, params: any): any;
  /**
   * Compile a query and return its plan without executing it.
   *
   * Mutating queries (CREATE / MERGE / SET / DELETE / REMOVE) leave
   * the graph untouched — this method never runs the executor.
   */
  explain(query: string, params: any): any;
  /**
   * Execute a query and return the plan plus runtime metrics.
   *
   * **PROFILE executes the query for real.** Mutating queries are
   * persisted exactly as in `execute()`. Use `explain()` to inspect
   * a mutating plan without running it.
   */
  profile(query: string, params: any): any;
}
export class WasmQueryStream {
  private constructor();
  free(): void;
  next(): any;
  close(): void;
  columns(): any;
}
/**
 * Streaming row export cursor.
 *
 * Holds a native [`InnerQueryStream`] plus a format-specific
 * [`RowEncoder`] writing into a shared `Vec<u8>` buffer. Each
 * [`Self::next`] call pulls a fixed number of rows from the cursor,
 * encodes them, and returns whatever bytes the encoder wrote since
 * the previous call. Once the cursor is exhausted, [`Self::next`]
 * emits the encoder's trailer chunk and then returns `null`.
 *
 * The buffer is reused across chunks (`mem::take` swaps it out
 * rather than reallocating), keeping per-chunk allocation cost
 * independent of the total export size.
 */
export class WasmRowExport {
  private constructor();
  free(): void;
  /**
   * Pull and encode the next chunk of rows. Returns the encoded
   * bytes (possibly empty if the encoder buffered without
   * flushing — JSONL/CSV/JSON encoders always flush per row, so
   * this is rare), or `null` when the export is fully drained.
   * After `null` is returned, the cursor is closed automatically.
   */
  next(): any;
  close(): void;
  columns(): any;
}
/**
 * Streaming row-import cursor.
 *
 * Holds a [`StreamingRowDecoder`] (JSONL or CSV) plus a Cypher
 * template. Each [`Self::feed`] call appends bytes to the decoder
 * and flushes any completed records into a batch buffer; full
 * batches execute as one parameterised statement and clear the
 * buffer. [`Self::finish`] drains the decoder's residual and
 * flushes the final partial batch. The encoder buffer + one batch
 * of `LoraValue::Map` records is the only steady-state memory
 * footprint — peak resident set is independent of total import size.
 */
export class WasmRowImport {
  private constructor();
  free(): void;
  /**
   * Append a chunk of bytes and process any records that became
   * complete. Returns progress: total bytes ingested, completed
   * rows so far, and batches committed so far.
   */
  feed(chunk: Uint8Array): any;
  close(): void;
  /**
   * Signal that no more bytes will be fed, drain any residual
   * records, and flush the final partial batch. Returns the
   * final stats and closes the cursor.
   */
  finish(): any;
}

export type InitInput = RequestInfo | URL | Response | BufferSource | WebAssembly.Module;

export interface InitOutput {
  readonly memory: WebAssembly.Memory;
  readonly __wbg_wasmdatabase_free: (a: number, b: number) => void;
  readonly __wbg_wasmquerystream_free: (a: number, b: number) => void;
  readonly __wbg_wasmrowexport_free: (a: number, b: number) => void;
  readonly __wbg_wasmrowimport_free: (a: number, b: number) => void;
  readonly snapshotInfo: (a: number, b: number) => [number, number, number];
  readonly wasmdatabase_clear: (a: number) => [number, number];
  readonly wasmdatabase_execute: (a: number, b: number, c: number, d: any) => [number, number, number];
  readonly wasmdatabase_executeBuffer: (a: number, b: number, c: number, d: any) => [number, number, number, number];
  readonly wasmdatabase_explain: (a: number, b: number, c: number, d: any) => [number, number, number];
  readonly wasmdatabase_exportRows: (a: number, b: number, c: number, d: any, e: number, f: number) => [number, number, number];
  readonly wasmdatabase_graphStats: (a: number) => [number, number, number];
  readonly wasmdatabase_importRows: (a: number, b: number, c: number, d: number, e: number, f: any, g: number) => [number, number, number];
  readonly wasmdatabase_importRowsWithCypher: (a: number, b: number, c: number, d: number, e: number, f: number, g: number, h: number) => [number, number, number];
  readonly wasmdatabase_loadSnapshot: (a: number, b: number, c: number, d: any) => [number, number, number];
  readonly wasmdatabase_memoryReport: (a: number) => [number, number, number];
  readonly wasmdatabase_new: () => number;
  readonly wasmdatabase_nodeCount: (a: number) => number;
  readonly wasmdatabase_openExport: (a: number, b: number, c: number, d: any, e: number, f: number) => [number, number, number];
  readonly wasmdatabase_openImport: (a: number, b: number, c: number, d: any, e: number, f: number, g: number) => [number, number, number];
  readonly wasmdatabase_openStream: (a: number, b: number, c: number, d: any) => [number, number, number];
  readonly wasmdatabase_profile: (a: number, b: number, c: number, d: any) => [number, number, number];
  readonly wasmdatabase_relationshipCount: (a: number) => number;
  readonly wasmdatabase_saveSnapshot: (a: number, b: any) => [number, number, number, number];
  readonly wasmdatabase_transaction: (a: number, b: any, c: number, d: number) => [number, number, number];
  readonly wasmquerystream_close: (a: number) => void;
  readonly wasmquerystream_columns: (a: number) => [number, number, number];
  readonly wasmquerystream_next: (a: number) => [number, number, number];
  readonly wasmrowexport_close: (a: number) => void;
  readonly wasmrowexport_columns: (a: number) => [number, number, number];
  readonly wasmrowexport_next: (a: number) => [number, number, number];
  readonly wasmrowimport_close: (a: number) => void;
  readonly wasmrowimport_feed: (a: number, b: number, c: number) => [number, number, number];
  readonly wasmrowimport_finish: (a: number) => [number, number, number];
  readonly init: () => void;
  readonly __wbindgen_malloc: (a: number, b: number) => number;
  readonly __wbindgen_realloc: (a: number, b: number, c: number, d: number) => number;
  readonly __wbindgen_exn_store: (a: number) => void;
  readonly __externref_table_alloc: () => number;
  readonly __wbindgen_export_4: WebAssembly.Table;
  readonly __wbindgen_free: (a: number, b: number, c: number) => void;
  readonly __externref_table_dealloc: (a: number) => void;
  readonly __wbindgen_start: () => void;
}

export type SyncInitInput = BufferSource | WebAssembly.Module;
/**
* Instantiates the given `module`, which can either be bytes or
* a precompiled `WebAssembly.Module`.
*
* @param {{ module: SyncInitInput }} module - Passing `SyncInitInput` directly is deprecated.
*
* @returns {InitOutput}
*/
export function initSync(module: { module: SyncInitInput } | SyncInitInput): InitOutput;

/**
* If `module_or_path` is {RequestInfo} or {URL}, makes a request and
* for everything else, calls `WebAssembly.instantiate` directly.
*
* @param {{ module_or_path: InitInput | Promise<InitInput> }} module_or_path - Passing `InitInput` directly is deprecated.
*
* @returns {Promise<InitOutput>}
*/
export default function __wbg_init (module_or_path?: { module_or_path: InitInput | Promise<InitInput> } | InitInput | Promise<InitInput>): Promise<InitOutput>;
