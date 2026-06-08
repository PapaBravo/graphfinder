import './style.css'
import cytoscape from 'cytoscape'
import { createWorkerDatabase } from '../vendor/loradb-wasm/dist/worker-client.js'
import { LoraError, isNode, isRelationship } from '../vendor/loradb-wasm/dist/types.js'

const DEFAULT_QUERY = `MATCH (source)-[relationship]->(target)
RETURN source, relationship, target
ORDER BY source.name, target.name`

const MAX_PREVIEW_ROWS = 25

document.querySelector('#app').innerHTML = `
  <main class="app-shell">
    <section class="panel intro-panel">
      <p class="eyebrow">Static graph explorer</p>
      <h1>graphfinder</h1>
      <p class="lead">
        Query a seeded LoraDB graph in the browser and render any returned nodes and
        relationships with Cytoscape.js.
      </p>
      <div class="summary-grid">
        <div>
          <span class="summary-label">Seeded graph</span>
          <strong id="dataset-stats">Loading…</strong>
        </div>
        <div>
          <span class="summary-label">Status</span>
          <strong id="status-text">Booting database…</strong>
        </div>
      </div>
    </section>

    <section class="workspace">
      <div class="panel query-panel">
        <div class="panel-header">
          <h2>Cypher query</h2>
          <button id="reset-query" class="ghost-button" type="button">Reset</button>
        </div>
        <label class="sr-only" for="query-input">Cypher query</label>
        <textarea id="query-input" spellcheck="false"></textarea>
        <div class="query-actions">
          <button id="run-query" class="primary-button" type="button">Run query</button>
          <span class="hint">Tip: press Ctrl/Cmd + Enter</span>
        </div>
      </div>

      <div class="stack">
        <section class="panel results-panel">
          <div class="panel-header">
            <h2>Result preview</h2>
            <span id="result-meta" class="meta-text">Waiting for first query…</span>
          </div>
          <pre id="result-output">[]</pre>
        </section>

        <section class="panel graph-panel">
          <div class="panel-header">
            <h2>Graph view</h2>
            <span id="graph-meta" class="meta-text">No graph rendered yet</span>
          </div>
          <div id="cy" aria-label="Graph visualization"></div>
        </section>
      </div>
    </section>
  </main>
`

const statusText = document.querySelector('#status-text')
const datasetStats = document.querySelector('#dataset-stats')
const queryInput = document.querySelector('#query-input')
const resultMeta = document.querySelector('#result-meta')
const resultOutput = document.querySelector('#result-output')
const graphMeta = document.querySelector('#graph-meta')
const runQueryButton = document.querySelector('#run-query')
const resetQueryButton = document.querySelector('#reset-query')

queryInput.value = DEFAULT_QUERY

const cy = cytoscape({
  container: document.querySelector('#cy'),
  elements: [],
  layout: { name: 'grid' },
  style: [
    {
      selector: 'node',
      style: {
        'background-color': '#2563eb',
        color: '#eff6ff',
        label: 'data(label)',
        'font-size': 12,
        'text-wrap': 'wrap',
        'text-max-width': 120,
        'text-valign': 'center',
        'text-halign': 'center',
        shape: 'round-rectangle',
        'border-width': 2,
        'border-color': '#dbeafe',
        width: 150,
        height: 56,
        padding: '14px',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 2,
        'curve-style': 'bezier',
        'target-arrow-shape': 'triangle',
        'line-color': '#94a3b8',
        'target-arrow-color': '#94a3b8',
        label: 'data(label)',
        color: '#334155',
        'font-size': 11,
        'text-background-color': '#ffffff',
        'text-background-opacity': 0.9,
        'text-background-padding': 3,
      },
    },
  ],
})

let worker = null
let dbPromise = null

runQueryButton.addEventListener('click', () => {
  void runCurrentQuery()
})

resetQueryButton.addEventListener('click', () => {
  queryInput.value = DEFAULT_QUERY
  queryInput.focus()
})

queryInput.addEventListener('keydown', (event) => {
  if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
    event.preventDefault()
    void runCurrentQuery()
  }
})

window.addEventListener('beforeunload', async () => {
  if (!dbPromise) {
    return
  }

  try {
    const db = await dbPromise
    await db.dispose()
    worker?.terminate()
  } catch {
    // ignore dispose errors on unload
  }
})

void initializeApp()

async function initializeApp() {
  setStatus('Booting database…')
  setBusy(true)

  try {
    const db = await getDatabase()
    const snapshotResponse = await fetch(resolveSnapshotUrl())

    if (!snapshotResponse.ok) {
      throw new Error(`Failed to load example snapshot (${snapshotResponse.status})`)
    }

    await db.loadSnapshot(await snapshotResponse.arrayBuffer())

    const [nodeCount, relationshipCount] = await Promise.all([
      db.nodeCount(),
      db.relationshipCount(),
    ])

    datasetStats.textContent = `${nodeCount} nodes · ${relationshipCount} relationships`
    setStatus('Ready')

    await runCurrentQuery()
  } catch (error) {
    handleError(error, 'Unable to initialize the in-browser graph database.')
  } finally {
    setBusy(false)
  }
}

async function getDatabase() {
  if (!dbPromise) {
    worker = new Worker(new URL('./loradb-worker.js', import.meta.url), {
      type: 'module',
    })
    dbPromise = Promise.resolve(createWorkerDatabase(worker))
  }

  return dbPromise
}

async function runCurrentQuery() {
  const query = queryInput.value.trim()

  if (!query) {
    resultMeta.textContent = 'Enter a query to run against the example graph.'
    resultOutput.textContent = '[]'
    renderGraph({ nodes: [], edges: [] })
    return
  }

  setBusy(true)
  setStatus('Running query…')

  try {
    const db = await getDatabase()
    const result = await db.execute(query)
    const graph = extractGraph(result.rows)

    resultMeta.textContent = `${result.rows.length} row${result.rows.length === 1 ? '' : 's'} · columns: ${result.columns.join(', ') || 'none'}`
    resultOutput.textContent = formatPreview(result.rows)
    renderGraph(graph)
    setStatus('Ready')
  } catch (error) {
    handleError(error, 'Query failed.')
  } finally {
    setBusy(false)
  }
}

function extractGraph(rows) {
  const nodes = new Map()
  const edges = new Map()

  for (const row of rows) {
    visitValue(row, nodes, edges)
  }

  return {
    nodes: Array.from(nodes.values()),
    edges: Array.from(edges.values()),
  }
}

function visitValue(value, nodes, edges) {
  if (Array.isArray(value)) {
    for (const item of value) {
      visitValue(item, nodes, edges)
    }
    return
  }

  if (!value || typeof value !== 'object') {
    return
  }

  if (isNode(value)) {
    upsertNode(nodes, value)
    return
  }

  if (isRelationship(value)) {
    upsertEdge(nodes, edges, value)
    return
  }

  for (const nestedValue of Object.values(value)) {
    visitValue(nestedValue, nodes, edges)
  }
}

function upsertNode(nodes, node) {
  const nodeId = String(node.id)
  const labelBase =
    stringifyProperty(node.properties.name) ||
    stringifyProperty(node.properties.title) ||
    `${node.labels[0] || 'Node'} #${node.id}`
  const badge = node.labels.length ? `\n${node.labels.join(', ')}` : ''

  nodes.set(nodeId, {
    data: {
      id: nodeId,
      label: `${labelBase}${badge}`,
    },
  })
}

function upsertEdge(nodes, edges, relationship) {
  const edgeId = String(relationship.id)
  const source = String(relationship.startId)
  const target = String(relationship.endId)

  if (!nodes.has(source)) {
    nodes.set(source, {
      data: { id: source, label: `Node #${source}` },
    })
  }

  if (!nodes.has(target)) {
    nodes.set(target, {
      data: { id: target, label: `Node #${target}` },
    })
  }

  const detail = Object.entries(relationship.properties)
    .map(([key, propertyValue]) => `${key}: ${stringifyProperty(propertyValue)}`)
    .join(', ')

  edges.set(edgeId, {
    data: {
      id: edgeId,
      source,
      target,
      label: detail ? `${relationship.type}\n${detail}` : relationship.type,
    },
  })
}

function renderGraph(graph) {
  const elements = [...graph.nodes, ...graph.edges]

  cy.elements().remove()

  if (!elements.length) {
    graphMeta.textContent = 'No nodes or relationships were returned by the query.'
    return
  }

  cy.add(elements)
  cy.layout({
    name: elements.length > 12 ? 'cose' : 'breadthfirst',
    animate: false,
    fit: true,
    padding: 24,
  }).run()

  graphMeta.textContent = `${graph.nodes.length} node${graph.nodes.length === 1 ? '' : 's'} · ${graph.edges.length} relationship${graph.edges.length === 1 ? '' : 's'}`
}

function formatPreview(rows) {
  const previewRows = rows.slice(0, MAX_PREVIEW_ROWS)
  const suffix = rows.length > MAX_PREVIEW_ROWS ? `\n\n… ${rows.length - MAX_PREVIEW_ROWS} more row(s)` : ''
  return `${JSON.stringify(previewRows, null, 2)}${suffix}`
}

function stringifyProperty(value) {
  if (value == null) {
    return ''
  }

  if (typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean') {
    return String(value)
  }

  return JSON.stringify(value)
}

function resolveSnapshotUrl() {
  return new URL('data/example.lorasnap', window.location.href).toString()
}

function setBusy(isBusy) {
  runQueryButton.disabled = isBusy
  queryInput.disabled = isBusy
}

function setStatus(message) {
  statusText.textContent = message
}

function handleError(error, fallbackMessage) {
  const message = error instanceof LoraError
    ? `${error.code}: ${error.message}`
    : error instanceof Error
      ? error.message
      : fallbackMessage

  setStatus('Error')
  resultMeta.textContent = fallbackMessage
  resultOutput.textContent = message
  renderGraph({ nodes: [], edges: [] })
}
