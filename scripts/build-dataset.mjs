import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { createDatabase } from '../vendor/loradb-wasm/dist/index.js'

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const seedPath = path.join(rootDir, 'data', 'seed.cypher')
const outputDir = path.join(rootDir, 'public', 'data')
const outputPath = path.join(outputDir, 'example.lorasnap')

const db = await createDatabase()

try {
  const seedQuery = await readFile(seedPath, 'utf8')
  await db.execute(seedQuery)
  const snapshot = await db.saveSnapshot()
  await mkdir(outputDir, { recursive: true })
  await writeFile(outputPath, snapshot)
  console.log(`Wrote example snapshot to ${outputPath}`)
} finally {
  db.dispose()
}
