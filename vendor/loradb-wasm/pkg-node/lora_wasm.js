
let imports = {};
imports['__wbindgen_placeholder__'] = module.exports;
let wasm;
const { TextEncoder, TextDecoder } = require(`util`);

let WASM_VECTOR_LEN = 0;

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

let cachedTextEncoder = new TextEncoder('utf-8');

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function addToExternrefTable0(obj) {
    const idx = wasm.__externref_table_alloc();
    wasm.__wbindgen_export_4.set(idx, obj);
    return idx;
}

function handleError(f, args) {
    try {
        return f.apply(this, args);
    } catch (e) {
        const idx = addToExternrefTable0(e);
        wasm.__wbindgen_exn_store(idx);
    }
}

let cachedTextDecoder = new TextDecoder('utf-8', { ignoreBOM: true, fatal: true });

cachedTextDecoder.decode();

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

function isLikeNone(x) {
    return x === undefined || x === null;
}

function debugString(val) {
    // primitive types
    const type = typeof val;
    if (type == 'number' || type == 'boolean' || val == null) {
        return  `${val}`;
    }
    if (type == 'string') {
        return `"${val}"`;
    }
    if (type == 'symbol') {
        const description = val.description;
        if (description == null) {
            return 'Symbol';
        } else {
            return `Symbol(${description})`;
        }
    }
    if (type == 'function') {
        const name = val.name;
        if (typeof name == 'string' && name.length > 0) {
            return `Function(${name})`;
        } else {
            return 'Function';
        }
    }
    // objects
    if (Array.isArray(val)) {
        const length = val.length;
        let debug = '[';
        if (length > 0) {
            debug += debugString(val[0]);
        }
        for(let i = 1; i < length; i++) {
            debug += ', ' + debugString(val[i]);
        }
        debug += ']';
        return debug;
    }
    // Test for built-in
    const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
    let className;
    if (builtInMatches && builtInMatches.length > 1) {
        className = builtInMatches[1];
    } else {
        // Failed to match the standard '[object ClassName]'
        return toString.call(val);
    }
    if (className == 'Object') {
        // we're a user defined class or Object
        // JSON.stringify avoids problems with cycles, and is generally much
        // easier than looping through ownProperties of `val`.
        try {
            return 'Object(' + JSON.stringify(val) + ')';
        } catch (_) {
            return 'Object';
        }
    }
    // errors
    if (val instanceof Error) {
        return `${val.name}: ${val.message}\n${val.stack}`;
    }
    // TODO we could test for more things here, like `Set`s and `Map`s.
    return className;
}

function takeFromExternrefTable0(idx) {
    const value = wasm.__wbindgen_export_4.get(idx);
    wasm.__externref_table_dealloc(idx);
    return value;
}

function passArray8ToWasm0(arg, malloc) {
    const ptr = malloc(arg.length * 1, 1) >>> 0;
    getUint8ArrayMemory0().set(arg, ptr / 1);
    WASM_VECTOR_LEN = arg.length;
    return ptr;
}

function getArrayU8FromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return getUint8ArrayMemory0().subarray(ptr / 1, ptr / 1 + len);
}
/**
 * Call once at module start to install a panic hook that routes Rust
 * panics to `console.error`. No-op if compiled without the default feature.
 */
module.exports.init = function() {
    wasm.init();
};

/**
 * Inspect snapshot header metadata from raw bytes without loading the
 * snapshot into a database. Decodes only the envelope/manifest — no
 * decryption or body decompression — so this works on encrypted snapshots
 * too. Returns a plain object:
 * `{ formatVersion, walLsn, nodeCount, relationshipCount, compression,
 *    encrypted, keyId }`.
 * @param {Uint8Array} bytes
 * @returns {any}
 */
module.exports.snapshotInfo = function(bytes) {
    const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.snapshotInfo(ptr0, len0);
    if (ret[2]) {
        throw takeFromExternrefTable0(ret[1]);
    }
    return takeFromExternrefTable0(ret[0]);
};

const WasmDatabaseFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmdatabase_free(ptr >>> 0, 1));
/**
 * In-memory Lora graph database handle.
 */
class WasmDatabase {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmDatabaseFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmdatabase_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    nodeCount() {
        const ret = wasm.wasmdatabase_nodeCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Run a query and serialize the result rows as the chosen format.
     * `format` is one of `"jsonl"`, `"json"`, or `"csv"`. Returns the
     * encoded bytes as a `Uint8Array` plus a row count.
     *
     * Returns `{ bytes: Uint8Array, stats: { rows: number } }`.
     * @param {string} query
     * @param {any} params
     * @param {string} format
     * @returns {any}
     */
    exportRows(query, params, format) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(format, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_exportRows(this.__wbg_ptr, ptr0, len0, params, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Live `GraphStats` snapshot for the Stats side panel.
     *
     * `GraphStats` carries `BTreeMap<(String, String), usize>` fields
     * (distinct-value counts, per-index scope sets) that don't round-trip
     * through plain JSON keys. We flatten them to arrays of
     * `{ label, property, count? }` records so the JS side gets a
     * stable shape it can render without further reshaping.
     * @returns {any}
     */
    graphStats() {
        const ret = wasm.wasmdatabase_graphStats(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Decode rows from `bytes` and apply them through the supplied
     * [`RowMapping`]. `mapping` is JSON-serialised; see the `RowMapping`
     * shape in `lora-io`. Returns `{ rows, batches }`.
     * @param {Uint8Array} bytes
     * @param {string} format
     * @param {any} mapping
     * @param {number | null} [batch_size]
     * @returns {any}
     */
    importRows(bytes, format, mapping, batch_size) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(format, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_importRows(this.__wbg_ptr, ptr0, len0, ptr1, len1, mapping, isLikeNone(batch_size) ? 0x100000001 : (batch_size) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Open a streaming row-export cursor. Each `next()` call pulls a
     * chunk of rows, encodes them, and returns the encoded bytes as
     * a `Uint8Array`. Returns `null` once the cursor is fully drained
     * (and closes the cursor as a side effect).
     * @param {string} query
     * @param {any} params
     * @param {string} format
     * @returns {WasmRowExport}
     */
    openExport(query, params, format) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(format, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_openExport(this.__wbg_ptr, ptr0, len0, params, ptr1, len1);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmRowExport.__wrap(ret[0]);
    }
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
     * @param {string} format
     * @param {any} mapping_or_template
     * @param {number | null} [batch_size]
     * @param {boolean | null} [dry_run]
     * @param {boolean | null} [permissive]
     * @returns {WasmRowImport}
     */
    openImport(format, mapping_or_template, batch_size, dry_run, permissive) {
        const ptr0 = passStringToWasm0(format, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_openImport(this.__wbg_ptr, ptr0, len0, mapping_or_template, isLikeNone(batch_size) ? 0x100000001 : (batch_size) >>> 0, isLikeNone(dry_run) ? 0xFFFFFF : dry_run ? 1 : 0, isLikeNone(permissive) ? 0xFFFFFF : permissive ? 1 : 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmRowImport.__wrap(ret[0]);
    }
    /**
     * Open a true native row stream. Rows are pulled from the Rust executor
     * one `next()` call at a time.
     * @param {string} query
     * @param {any} params
     * @returns {WasmQueryStream}
     */
    openStream(query, params) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_openStream(this.__wbg_ptr, ptr0, len0, params);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return WasmQueryStream.__wrap(ret[0]);
    }
    /**
     * Execute an array of `{ query, params? }` statements inside one native
     * transaction. Returns an array of query results in statement order.
     * @param {any} statements
     * @param {string | null} [mode]
     * @returns {any}
     */
    transaction(statements, mode) {
        var ptr0 = isLikeNone(mode) ? 0 : passStringToWasm0(mode, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        var len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_transaction(this.__wbg_ptr, statements, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Replace the graph state with a database snapshot decoded from `bytes`.
     * Legacy store snapshot bytes are accepted for compatibility.
     *
     * Returns a plain object matching the shape of `SnapshotMeta`:
     * `{ formatVersion, nodeCount, relationshipCount, walLsn }`.
     * @param {Uint8Array} bytes
     * @param {any} options
     * @returns {any}
     */
    loadSnapshot(bytes, options) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_loadSnapshot(this.__wbg_ptr, ptr0, len0, options);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Approximate retained-heap breakdown for the Stats side panel.
     * Cheap to compute; not on a hot path. See
     * [`lora_store::MemoryReport`] for the methodology.
     * @returns {any}
     */
    memoryReport() {
        const ret = wasm.wasmdatabase_memoryReport(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Serialize the graph into database snapshot bytes. The caller is
     * responsible for writing them to IndexedDB, localStorage, a server, or
     * another host-provided store — WASM has no direct filesystem access.
     * The returned bytes can later be passed to `loadSnapshot` on any
     * `WasmDatabase` instance.
     *
     * Returns the serialized bytes as a `Uint8Array`.
     * @param {any} options
     * @returns {Uint8Array}
     */
    saveSnapshot(options) {
        const ret = wasm.wasmdatabase_saveSnapshot(this.__wbg_ptr, options);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v1 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v1;
    }
    /**
     * Execute a Lora query and return the result as a binary buffer.
     *
     * Wire format is the shared `lora_binding_buffer` layout. The TS
     * wrapper decodes it once into the same `{ columns, rows }` shape
     * `execute()` returns, but in a tight V8 loop instead of going
     * through `serde_wasm_bindgen` value-by-value. Materially faster
     * on bulk reads.
     * @param {string} query
     * @param {any} params
     * @returns {Uint8Array}
     */
    executeBuffer(query, params) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_executeBuffer(this.__wbg_ptr, ptr0, len0, params);
        if (ret[3]) {
            throw takeFromExternrefTable0(ret[2]);
        }
        var v2 = getArrayU8FromWasm0(ret[0], ret[1]).slice();
        wasm.__wbindgen_free(ret[0], ret[1] * 1, 1);
        return v2;
    }
    /**
     * @returns {number}
     */
    relationshipCount() {
        const ret = wasm.wasmdatabase_relationshipCount(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * Decode rows from `bytes` and execute `template` once per batch
     * with `$rows` bound to the batch payload. Escape hatch for the
     * auto-mapping path: anything Cypher accepts can be used here.
     * @param {Uint8Array} bytes
     * @param {string} format
     * @param {string} template
     * @param {number | null} [batch_size]
     * @returns {any}
     */
    importRowsWithCypher(bytes, format, template, batch_size) {
        const ptr0 = passArray8ToWasm0(bytes, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ptr1 = passStringToWasm0(format, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        const ptr2 = passStringToWasm0(template, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len2 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_importRowsWithCypher(this.__wbg_ptr, ptr0, len0, ptr1, len1, ptr2, len2, isLikeNone(batch_size) ? 0x100000001 : (batch_size) >>> 0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    constructor() {
        const ret = wasm.wasmdatabase_new();
        this.__wbg_ptr = ret >>> 0;
        WasmDatabaseFinalization.register(this, this.__wbg_ptr, this);
        return this;
    }
    clear() {
        const ret = wasm.wasmdatabase_clear(this.__wbg_ptr);
        if (ret[1]) {
            throw takeFromExternrefTable0(ret[0]);
        }
    }
    /**
     * Execute a Lora query. `params` may be `undefined`, `null`, or a
     * plain object keyed by parameter name.
     *
     * Returns `{ columns: string[], rows: Array<Record<string, LoraValue>> }`
     * as a plain JS object (structured-clonable).
     * @param {string} query
     * @param {any} params
     * @returns {any}
     */
    execute(query, params) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_execute(this.__wbg_ptr, ptr0, len0, params);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Compile a query and return its plan without executing it.
     *
     * Mutating queries (CREATE / MERGE / SET / DELETE / REMOVE) leave
     * the graph untouched — this method never runs the executor.
     * @param {string} query
     * @param {any} params
     * @returns {any}
     */
    explain(query, params) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_explain(this.__wbg_ptr, ptr0, len0, params);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    /**
     * Execute a query and return the plan plus runtime metrics.
     *
     * **PROFILE executes the query for real.** Mutating queries are
     * persisted exactly as in `execute()`. Use `explain()` to inspect
     * a mutating plan without running it.
     * @param {string} query
     * @param {any} params
     * @returns {any}
     */
    profile(query, params) {
        const ptr0 = passStringToWasm0(query, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmdatabase_profile(this.__wbg_ptr, ptr0, len0, params);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
module.exports.WasmDatabase = WasmDatabase;

const WasmQueryStreamFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmquerystream_free(ptr >>> 0, 1));

class WasmQueryStream {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmQueryStream.prototype);
        obj.__wbg_ptr = ptr;
        WasmQueryStreamFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmQueryStreamFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmquerystream_free(ptr, 0);
    }
    /**
     * @returns {any}
     */
    next() {
        const ret = wasm.wasmquerystream_next(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    close() {
        wasm.wasmquerystream_close(this.__wbg_ptr);
    }
    /**
     * @returns {any}
     */
    columns() {
        const ret = wasm.wasmquerystream_columns(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
module.exports.WasmQueryStream = WasmQueryStream;

const WasmRowExportFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmrowexport_free(ptr >>> 0, 1));
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
class WasmRowExport {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmRowExport.prototype);
        obj.__wbg_ptr = ptr;
        WasmRowExportFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmRowExportFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmrowexport_free(ptr, 0);
    }
    /**
     * Pull and encode the next chunk of rows. Returns the encoded
     * bytes (possibly empty if the encoder buffered without
     * flushing — JSONL/CSV/JSON encoders always flush per row, so
     * this is rare), or `null` when the export is fully drained.
     * After `null` is returned, the cursor is closed automatically.
     * @returns {any}
     */
    next() {
        const ret = wasm.wasmrowexport_next(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    close() {
        wasm.wasmrowexport_close(this.__wbg_ptr);
    }
    /**
     * @returns {any}
     */
    columns() {
        const ret = wasm.wasmrowexport_columns(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
module.exports.WasmRowExport = WasmRowExport;

const WasmRowImportFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_wasmrowimport_free(ptr >>> 0, 1));
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
class WasmRowImport {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(WasmRowImport.prototype);
        obj.__wbg_ptr = ptr;
        WasmRowImportFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WasmRowImportFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_wasmrowimport_free(ptr, 0);
    }
    /**
     * Append a chunk of bytes and process any records that became
     * complete. Returns progress: total bytes ingested, completed
     * rows so far, and batches committed so far.
     * @param {Uint8Array} chunk
     * @returns {any}
     */
    feed(chunk) {
        const ptr0 = passArray8ToWasm0(chunk, wasm.__wbindgen_malloc);
        const len0 = WASM_VECTOR_LEN;
        const ret = wasm.wasmrowimport_feed(this.__wbg_ptr, ptr0, len0);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
    close() {
        wasm.wasmrowimport_close(this.__wbg_ptr);
    }
    /**
     * Signal that no more bytes will be fed, drain any residual
     * records, and flush the final partial batch. Returns the
     * final stats and closes the cursor.
     * @returns {any}
     */
    finish() {
        const ret = wasm.wasmrowimport_finish(this.__wbg_ptr);
        if (ret[2]) {
            throw takeFromExternrefTable0(ret[1]);
        }
        return takeFromExternrefTable0(ret[0]);
    }
}
module.exports.WasmRowImport = WasmRowImport;

module.exports.__wbg_String_8f0eb39a4a4c2f66 = function(arg0, arg1) {
    const ret = String(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_buffer_609cc3eee51ed158 = function(arg0) {
    const ret = arg0.buffer;
    return ret;
};

module.exports.__wbg_call_672a4d21634d4a24 = function() { return handleError(function (arg0, arg1) {
    const ret = arg0.call(arg1);
    return ret;
}, arguments) };

module.exports.__wbg_call_7cccdd69e0791ae2 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = arg0.call(arg1, arg2);
    return ret;
}, arguments) };

module.exports.__wbg_crypto_86f2631e91b51511 = function(arg0) {
    const ret = arg0.crypto;
    return ret;
};

module.exports.__wbg_done_769e5ede4b31c67b = function(arg0) {
    const ret = arg0.done;
    return ret;
};

module.exports.__wbg_entries_3265d4158b33e5dc = function(arg0) {
    const ret = Object.entries(arg0);
    return ret;
};

module.exports.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
    let deferred0_0;
    let deferred0_1;
    try {
        deferred0_0 = arg0;
        deferred0_1 = arg1;
        console.error(getStringFromWasm0(arg0, arg1));
    } finally {
        wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
    }
};

module.exports.__wbg_getRandomValues_b3f15fcbfabb0f8b = function() { return handleError(function (arg0, arg1) {
    arg0.getRandomValues(arg1);
}, arguments) };

module.exports.__wbg_get_67b2ba62fc30de12 = function() { return handleError(function (arg0, arg1) {
    const ret = Reflect.get(arg0, arg1);
    return ret;
}, arguments) };

module.exports.__wbg_get_b9b93047fe3cf45b = function(arg0, arg1) {
    const ret = arg0[arg1 >>> 0];
    return ret;
};

module.exports.__wbg_instanceof_ArrayBuffer_e14585432e3737fc = function(arg0) {
    let result;
    try {
        result = arg0 instanceof ArrayBuffer;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Map_f3469ce2244d2430 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Map;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_instanceof_Uint8Array_17156bcf118086a9 = function(arg0) {
    let result;
    try {
        result = arg0 instanceof Uint8Array;
    } catch (_) {
        result = false;
    }
    const ret = result;
    return ret;
};

module.exports.__wbg_isArray_a1eab7e0d067391b = function(arg0) {
    const ret = Array.isArray(arg0);
    return ret;
};

module.exports.__wbg_isSafeInteger_343e2beeeece1bb0 = function(arg0) {
    const ret = Number.isSafeInteger(arg0);
    return ret;
};

module.exports.__wbg_iterator_9a24c88df860dc65 = function() {
    const ret = Symbol.iterator;
    return ret;
};

module.exports.__wbg_length_a446193dc22c12f8 = function(arg0) {
    const ret = arg0.length;
    return ret;
};

module.exports.__wbg_length_e2d2a49132c1b256 = function(arg0) {
    const ret = arg0.length;
    return ret;
};

module.exports.__wbg_msCrypto_d562bbe83e0d4b91 = function(arg0) {
    const ret = arg0.msCrypto;
    return ret;
};

module.exports.__wbg_new_405e22f390576ce2 = function() {
    const ret = new Object();
    return ret;
};

module.exports.__wbg_new_5e0be73521bc8c17 = function() {
    const ret = new Map();
    return ret;
};

module.exports.__wbg_new_78feb108b6472713 = function() {
    const ret = new Array();
    return ret;
};

module.exports.__wbg_new_8a6f238a6ece86ea = function() {
    const ret = new Error();
    return ret;
};

module.exports.__wbg_new_a12002a7f91c75be = function(arg0) {
    const ret = new Uint8Array(arg0);
    return ret;
};

module.exports.__wbg_newnoargs_105ed471475aaf50 = function(arg0, arg1) {
    const ret = new Function(getStringFromWasm0(arg0, arg1));
    return ret;
};

module.exports.__wbg_newwithbyteoffsetandlength_d97e637ebe145a9a = function(arg0, arg1, arg2) {
    const ret = new Uint8Array(arg0, arg1 >>> 0, arg2 >>> 0);
    return ret;
};

module.exports.__wbg_newwithlength_a381634e90c276d4 = function(arg0) {
    const ret = new Uint8Array(arg0 >>> 0);
    return ret;
};

module.exports.__wbg_next_25feadfc0913fea9 = function(arg0) {
    const ret = arg0.next;
    return ret;
};

module.exports.__wbg_next_6574e1a8a62d1055 = function() { return handleError(function (arg0) {
    const ret = arg0.next();
    return ret;
}, arguments) };

module.exports.__wbg_node_e1f24f89a7336c2e = function(arg0) {
    const ret = arg0.node;
    return ret;
};

module.exports.__wbg_now_2c95c9de01293173 = function(arg0) {
    const ret = arg0.now();
    return ret;
};

module.exports.__wbg_now_807e54c39636c349 = function() {
    const ret = Date.now();
    return ret;
};

module.exports.__wbg_performance_7a3ffd0b17f663ad = function(arg0) {
    const ret = arg0.performance;
    return ret;
};

module.exports.__wbg_process_3975fd6c72f520aa = function(arg0) {
    const ret = arg0.process;
    return ret;
};

module.exports.__wbg_randomFillSync_f8c153b79f285817 = function() { return handleError(function (arg0, arg1) {
    arg0.randomFillSync(arg1);
}, arguments) };

module.exports.__wbg_require_b74f47fc2d022fd6 = function() { return handleError(function () {
    const ret = module.require;
    return ret;
}, arguments) };

module.exports.__wbg_set_37837023f3d740e8 = function(arg0, arg1, arg2) {
    arg0[arg1 >>> 0] = arg2;
};

module.exports.__wbg_set_3f1d0b984ed272ed = function(arg0, arg1, arg2) {
    arg0[arg1] = arg2;
};

module.exports.__wbg_set_65595bdd868b3009 = function(arg0, arg1, arg2) {
    arg0.set(arg1, arg2 >>> 0);
};

module.exports.__wbg_set_8fc6bf8a5b1071d1 = function(arg0, arg1, arg2) {
    const ret = arg0.set(arg1, arg2);
    return ret;
};

module.exports.__wbg_set_bb8cecf6a62b9f46 = function() { return handleError(function (arg0, arg1, arg2) {
    const ret = Reflect.set(arg0, arg1, arg2);
    return ret;
}, arguments) };

module.exports.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
    const ret = arg1.stack;
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbg_static_accessor_GLOBAL_88a902d13a557d07 = function() {
    const ret = typeof global === 'undefined' ? null : global;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_static_accessor_GLOBAL_THIS_56578be7e9f832b0 = function() {
    const ret = typeof globalThis === 'undefined' ? null : globalThis;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_static_accessor_SELF_37c5d418e4bf5819 = function() {
    const ret = typeof self === 'undefined' ? null : self;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_static_accessor_WINDOW_5de37043a91a9c40 = function() {
    const ret = typeof window === 'undefined' ? null : window;
    return isLikeNone(ret) ? 0 : addToExternrefTable0(ret);
};

module.exports.__wbg_subarray_aa9065fa9dc5df96 = function(arg0, arg1, arg2) {
    const ret = arg0.subarray(arg1 >>> 0, arg2 >>> 0);
    return ret;
};

module.exports.__wbg_value_cd1ffa7b1ab794f1 = function(arg0) {
    const ret = arg0.value;
    return ret;
};

module.exports.__wbg_versions_4e31226f5e8dc909 = function(arg0) {
    const ret = arg0.versions;
    return ret;
};

module.exports.__wbindgen_bigint_from_i64 = function(arg0) {
    const ret = arg0;
    return ret;
};

module.exports.__wbindgen_bigint_from_u64 = function(arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return ret;
};

module.exports.__wbindgen_bigint_get_as_i64 = function(arg0, arg1) {
    const v = arg1;
    const ret = typeof(v) === 'bigint' ? v : undefined;
    getDataViewMemory0().setBigInt64(arg0 + 8 * 1, isLikeNone(ret) ? BigInt(0) : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_boolean_get = function(arg0) {
    const v = arg0;
    const ret = typeof(v) === 'boolean' ? (v ? 1 : 0) : 2;
    return ret;
};

module.exports.__wbindgen_debug_string = function(arg0, arg1) {
    const ret = debugString(arg1);
    const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_error_new = function(arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return ret;
};

module.exports.__wbindgen_in = function(arg0, arg1) {
    const ret = arg0 in arg1;
    return ret;
};

module.exports.__wbindgen_init_externref_table = function() {
    const table = wasm.__wbindgen_export_4;
    const offset = table.grow(4);
    table.set(0, undefined);
    table.set(offset + 0, undefined);
    table.set(offset + 1, null);
    table.set(offset + 2, true);
    table.set(offset + 3, false);
    ;
};

module.exports.__wbindgen_is_bigint = function(arg0) {
    const ret = typeof(arg0) === 'bigint';
    return ret;
};

module.exports.__wbindgen_is_function = function(arg0) {
    const ret = typeof(arg0) === 'function';
    return ret;
};

module.exports.__wbindgen_is_null = function(arg0) {
    const ret = arg0 === null;
    return ret;
};

module.exports.__wbindgen_is_object = function(arg0) {
    const val = arg0;
    const ret = typeof(val) === 'object' && val !== null;
    return ret;
};

module.exports.__wbindgen_is_string = function(arg0) {
    const ret = typeof(arg0) === 'string';
    return ret;
};

module.exports.__wbindgen_is_undefined = function(arg0) {
    const ret = arg0 === undefined;
    return ret;
};

module.exports.__wbindgen_jsval_eq = function(arg0, arg1) {
    const ret = arg0 === arg1;
    return ret;
};

module.exports.__wbindgen_jsval_loose_eq = function(arg0, arg1) {
    const ret = arg0 == arg1;
    return ret;
};

module.exports.__wbindgen_memory = function() {
    const ret = wasm.memory;
    return ret;
};

module.exports.__wbindgen_number_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'number' ? obj : undefined;
    getDataViewMemory0().setFloat64(arg0 + 8 * 1, isLikeNone(ret) ? 0 : ret, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, !isLikeNone(ret), true);
};

module.exports.__wbindgen_number_new = function(arg0) {
    const ret = arg0;
    return ret;
};

module.exports.__wbindgen_string_get = function(arg0, arg1) {
    const obj = arg1;
    const ret = typeof(obj) === 'string' ? obj : undefined;
    var ptr1 = isLikeNone(ret) ? 0 : passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    var len1 = WASM_VECTOR_LEN;
    getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
    getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
};

module.exports.__wbindgen_string_new = function(arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return ret;
};

module.exports.__wbindgen_throw = function(arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
};

const path = require('path').join(__dirname, 'lora_wasm_bg.wasm');
const bytes = require('fs').readFileSync(path);

const wasmModule = new WebAssembly.Module(bytes);
const wasmInstance = new WebAssembly.Instance(wasmModule, imports);
wasm = wasmInstance.exports;
module.exports.__wasm = wasm;

wasm.__wbindgen_start();

