import 'dotenv/config'
import { mkdir, writeFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { neon } from '@neondatabase/serverless'
import { Redis } from '@upstash/redis'

// Read-only source snapshot. Contains personal data: never commit this directory.
const directory = `.migration-private/${new Date().toISOString().replaceAll(':', '-')}`
await mkdir(directory, { recursive: true, mode: 0o700 })
const sql = neon(process.env.DATABASE_URL)
const tables = {}
const sequences = {}
for (const name of ['comments', 'guestbook', 'subscribers', 'newsletters']) {
  tables[name] = await sql.query(`SELECT * FROM ${name} ORDER BY id`)
  const [sequence] = await sql.query("SELECT pg_sequence_last_value(pg_get_serial_sequence($1, 'id')::regclass)::text AS last_value", [name])
  sequences[name] = Number(sequence.last_value ?? 0)
}
const redis = new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN })
const values = {}
let cursor = 0
do {
  const page = await redis.scan(cursor, { count: 1000 })
  cursor = page[0]
  const keys = page[1].filter(key => !key.startsWith('@upstash/ratelimit'))
  if (keys.length) {
    const batch = redis.pipeline()
    for (const key of keys) { batch.get(key); batch.ttl(key) }
    const results = await batch.exec()
    keys.forEach((key,index) => { values[key] = { value: results[index*2], ttl: results[index*2+1] } })
  }
} while (String(cursor) !== '0')
const snapshot = JSON.stringify({ capturedAt: new Date().toISOString(), tables, sequences, redis: values }, null, 2)
await writeFile(`${directory}/snapshot.json`, snapshot, { mode: 0o600 })
console.log(JSON.stringify({ directory, rows: Object.fromEntries(Object.entries(tables).map(([name, rows]) => [name, rows.length])), redisKeys: Object.keys(values).length, sha256: createHash('sha256').update(snapshot).digest('hex') }, null, 2))
