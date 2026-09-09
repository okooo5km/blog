import { getCloudflareContext } from '@opennextjs/cloudflare'
import { drizzle } from 'drizzle-orm/d1'

// Resolve bindings inside the request; local dev uses Wrangler's local D1.
export function getDatabase() {
  return drizzle(getCloudflareContext().env.BLOG_DB)
}

export const db = new Proxy({} as ReturnType<typeof getDatabase>, {
  get(_target, property) {
    const database = getDatabase()
    const value = Reflect.get(database, property)
    return typeof value === 'function' ? value.bind(database) : value
  },
})
