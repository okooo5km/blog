import { readFile } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import assert from 'node:assert/strict'
import { isDeepStrictEqual } from 'node:util'
const source = process.argv[2]
const remote = process.argv.includes('--remote')
const snapshot = JSON.parse(await readFile(source, 'utf8'))
function query(sql) {
  const raw = execFileSync('pnpm', ['exec','wrangler','d1','execute','BLOG_DB', remote ? '--remote' : '--local','--command',sql,'--json'], { encoding:'utf8', maxBuffer: 20*1024*1024 })
  return JSON.parse(raw)[0].results
}
for (const [table, rows] of Object.entries(snapshot.tables)) {
  const actual = query(`SELECT * FROM ${table} ORDER BY id`)
  const expected = rows.map(row => Object.fromEntries(Object.entries(row).map(([key,value])=>[key,value == null ? null : key.endsWith('_at') ? new Date(value).getTime() : typeof value === 'object' ? JSON.stringify(value) : value])))
  assert.ok(isDeepStrictEqual(actual, expected), `${table}: field mismatch (private values omitted)`)
  console.log(`${table}: ${rows.length} rows, every field equal`)
}
const state = query('SELECT key,value,expires_at FROM blog_state ORDER BY key')
for (const [key, entry] of Object.entries(snapshot.redis)) {
  if (entry.value == null || entry.ttl === -2) continue
  const row = state.find(row=>row.key===key)
  assert.ok(row, 'missing state key')
  assert.ok(isDeepStrictEqual(JSON.parse(row.value), entry.value), 'state value mismatch (private values omitted)')
  const expiry = entry.ttl > 0 ? new Date(snapshot.capturedAt).getTime() + entry.ttl * 1000 : null
  assert.ok(row.expires_at === expiry, 'state expiry mismatch')
}
console.log(`State verified: ${state.length} rows. No private values printed.`)

if (!process.argv.includes('--allow-extra-state')) {
  assert.equal(state.length, Object.values(snapshot.redis).filter(entry => entry.value != null && entry.ttl !== -2).length, 'unexpected state rows')
}
const sequences = query('SELECT name,seq FROM sqlite_sequence')
for (const [name, expected] of Object.entries(snapshot.sequences ?? {})) {
  const actual = sequences.find(row => row.name === name)?.seq ?? 0
  assert.ok(actual >= expected, `${name}: sequence would reuse historical IDs`)
}
console.log('Expiry, state row count and sequence upper bounds verified.')
