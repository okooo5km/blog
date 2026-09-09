import assert from 'node:assert/strict'

const base = new URL(process.argv[2] ?? 'http://localhost:8787')
const checks = [
  ['/', 200, '近期文章'],
  ['/blog', 200, '下一页'],
  ['/blog/page/2', 200, '上一页'],
  ['/blog/page/1', 308],
  ['/blog/page/0', 404],
  ['/blog/page/999999', 404],
  ['/blog/5km-littlebox-illustrations', 200, 'data-postid'],
  ['/blog/cloudflare-migration-nonexistent-post', 404],
  ['/projects', 200],
  ['/guestbook', 200],
  ['/feed.xml', 200, '<rss'],
  ['/rss', 200, '<rss'],
  ['/sitemap.xml', 200, '<urlset'],
  ['/api/guestbook', 200],
  ['/api/guestbook/users', 401],
  ['/api/reactions', 400],
]

for (const [path, status, expectedText] of checks) {
  const start = performance.now()
  const response = await fetch(new URL(path, base), { redirect: 'manual' })
  const body = await response.text()
  if (status === 404 && response.status === 200) {
    // Next.js can stream a not-found page after committing a 200 header.
    assert.ok(/<meta name="robots" content="noindex"/.test(body), `${path}: missing noindex`)
    assert.ok(!body.includes('data-postid='), `${path}: unexpected article`)
  } else {
    assert.equal(response.status, status, `${path}: unexpected status`)
  }
  if (expectedText) assert.ok(body.includes(expectedText), `${path}: missing content`)
  console.log(`${response.status} ${path} ${Math.round(performance.now() - start)}ms`)
  if (path === '/') {
    const source = body.match(/src="([^\"]*\/_next\/image\?[^\"]+)"/)?.[1]?.replaceAll('&amp;', '&')
    assert.ok(source, 'Home page must contain optimized images')
    const image = await fetch(new URL(source, base))
    assert.equal(image.status, 200, 'Image optimizer must succeed')
    assert.match(image.headers.get('content-type') ?? '', /^image\//)
    console.log('200 image optimizer')
  }
}

const admin = await fetch(new URL('/admin', base), { redirect: 'manual' })
assert.ok([302, 303, 307, 308, 401, 404].includes(admin.status), 'Admin must reject anonymous access')
console.log(`${admin.status} /admin (anonymous access denied)`)

for (const [body, origin, expected] of [
  ['{}', base.origin, 400],
  ['{"pathname":"/"}', 'https://example.org', 403],
]) {
  const response = await fetch(new URL('/api/visit', base), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Origin: origin },
    body,
  })
  assert.equal(response.status, expected, 'Invalid visit request must be rejected before writes')
  console.log(`${expected} /api/visit (invalid request rejected)`)
}

console.log('Deployment smoke checks passed. No comments, subscriptions, or emails were created.')
