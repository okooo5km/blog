import { getCloudflareContext } from '@opennextjs/cloudflare'

let contextInitialization: Promise<unknown> | undefined

async function initializeContext() {
  try {
    getCloudflareContext()
    return
  } catch {
    // Concurrent SSG reads must share one local workerd startup, or SQLite locks.
    contextInitialization ??= getCloudflareContext({ async: true }).finally(() => {
      contextInitialization = undefined
    })
    await contextInitialization
  }
}

function database() {
  return getCloudflareContext().env.BLOG_DB
}

function read(key: string) {
  return database().prepare('SELECT value FROM blog_state WHERE key = ? AND (expires_at IS NULL OR expires_at > ?)').bind(key, Date.now())
}

function write(key: string, value: unknown, seconds?: number) {
  return database().prepare('INSERT INTO blog_state(key, value, expires_at) VALUES (?, ?, ?) ON CONFLICT(key) DO UPDATE SET value=excluded.value, expires_at=excluded.expires_at RETURNING value').bind(key, JSON.stringify(value), seconds ? Date.now() + seconds * 1000 : null)
}

function increment(key: string) {
  return database().prepare("INSERT INTO blog_state(key,value) VALUES (?, '1') ON CONFLICT(key) DO UPDATE SET value=CAST(CAST(value AS INTEGER)+1 AS TEXT), expires_at=NULL RETURNING value").bind(key)
}

function decode<T>(rows: { value?: string }[]): T | null {
  return rows[0]?.value == null ? null : JSON.parse(rows[0].value) as T
}

export const storage = {
  async get<T = unknown>(key: string): Promise<T | null> {
    return decode<T>((await read(key).all<{ value: string }>()).results)
  },
  async set(key: string, value: unknown, options?: { ex: number }) {
    await write(key, value, options?.ex).run()
  },
  async mget<T extends unknown[]>(...keys: string[]): Promise<T> {
    if (!keys.length) return [] as unknown as T
    await initializeContext()
    const result = await database().batch<{ value: string }>(keys.map(read))
    return result.map(item => decode(item.results)) as T
  },
  pipeline() {
    const statements: D1PreparedStatement[] = []
    const pipeline = {
      get(key: string) { statements.push(read(key)); return pipeline },
      set(key: string, value: unknown) { statements.push(write(key, value)); return pipeline },
      incr(key: string) { statements.push(increment(key)); return pipeline },
      async exec() {
        const result = await database().batch<{ value: string }>(statements)
        return result.map(item => decode(item.results))
      },
    }
    return pipeline
  },
  async incrementReaction(key: string, index: number) {
    const path = `$[${index}]`
    const result = await database().prepare(`INSERT INTO blog_state(key,value) VALUES (?, json_set('[0,0,0,0]', ?, 1)) ON CONFLICT(key) DO UPDATE SET value=json_set(value, ?, COALESCE(json_extract(value, ?),0)+1) RETURNING value`).bind(key, path, path, path).all<{ value: string }>()
    return decode<number[]>(result.results)
  },
}
