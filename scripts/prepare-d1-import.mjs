import { readFile, writeFile } from 'node:fs/promises'
const source = process.argv[2]
if (!source?.startsWith('.migration-private/')) throw new Error('Expected a private snapshot path')
const snapshot = JSON.parse(await readFile(source, 'utf8'))
const literal = value => value == null ? 'NULL' : typeof value === 'number' ? String(value) : `'${String(value).replaceAll("'", "''")}'`
const statements = []
for (const [table, rows] of Object.entries(snapshot.tables)) {
  for (const row of rows) {
    const values = Object.entries(row).map(([key, value]) => value == null ? null : key.endsWith('_at') ? new Date(value).getTime() : typeof value === 'object' ? JSON.stringify(value) : value)
    statements.push(`INSERT INTO ${table} (${Object.keys(row).join(',')}) VALUES (${values.map(literal).join(',')});`)
  }
}
for (const [name, sequence] of Object.entries(snapshot.sequences ?? {})) {
  if (!['comments','guestbook','subscribers','newsletters'].includes(name) || !Number.isSafeInteger(sequence)) throw new Error('Invalid sequence')
  statements.push(`UPDATE sqlite_sequence SET seq=MAX(seq,${sequence}) WHERE name=${literal(name)};`)
}
for (const [key, entry] of Object.entries(snapshot.redis)) {
  if (entry.value == null || entry.ttl === -2) continue
  const expires = entry.ttl > 0 ? new Date(snapshot.capturedAt).getTime() + entry.ttl * 1000 : null
  statements.push(`INSERT INTO blog_state (key,value,expires_at) VALUES (${literal(key)},${literal(JSON.stringify(entry.value))},${literal(expires)});`)
}
const output = source.replace(/snapshot\.json$/, 'import.sql')
await writeFile(output, statements.join('\n'), { mode: 0o600 })
console.log(`Prepared ${statements.length} rows in ${output}`)
