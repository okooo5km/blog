import { execFileSync } from 'node:child_process'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import assert from 'node:assert/strict'

// Public build inputs only. Runtime secrets remain in the existing Worker.
const defaults = JSON.parse(readFileSync(new URL('../config/cloudflare-build.json', import.meta.url), 'utf8'))
assert.ok(Object.keys(defaults).every(key => key.startsWith('NEXT_PUBLIC_')))
const env = { ...defaults, ...process.env, SKIP_ENV_VALIDATION: '1' }
const action = process.argv[2]
assert.ok(action === 'build' || action === 'deploy', 'Expected build or deploy')
function run(args, capture = false) {
  return execFileSync('pnpm', args, {
    env, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit', maxBuffer: 20 * 1024 * 1024,
  })
}

if (action === 'build') {
  run(['lint'])
  run(['exec', 'wrangler', 'd1', 'migrations', 'apply', 'BLOG_DB', '--local'])
  // A clean CI checkout has no local D1 data. Seed only public counters so
  // generated pages preserve real counts; never copy comments or subscribers.
  const sql = "SELECT key,value FROM blog_state WHERE key='total_page_views' OR key LIKE 'post:views:%' OR key LIKE 'reactions:%'"
  const response = JSON.parse(run(['exec', 'wrangler', 'd1', 'execute', 'BLOG_DB', '--remote', '--command', sql, '--json'], true))
  assert.ok(response[0]?.success && Array.isArray(response[0].results), 'Cannot load public statistics')
  const quote = value => "'" + String(value).replaceAll("'", "''") + "'"
  const rows = response[0].results
  mkdirSync('.wrangler', { recursive: true })
  if (rows.length) {
    const seed = rows.map(row => `INSERT INTO blog_state(key,value) VALUES (${quote(row.key)},${quote(row.value)}) ON CONFLICT(key) DO UPDATE SET value=excluded.value;`).join('\n')
    writeFileSync('.wrangler/public-build-statistics.sql', seed, { mode: 0o600 })
    run(['exec', 'wrangler', 'd1', 'execute', 'BLOG_DB', '--local', '--file', '.wrangler/public-build-statistics.sql'])
  }
  console.log(`Loaded ${rows.length} public counters for static generation.`)
  run(['build:cloudflare'])
} else {
  run(['exec', 'opennextjs-cloudflare', 'deploy'])
  run(['smoke:deployment', defaults.NEXT_PUBLIC_SITE_URL])
}
