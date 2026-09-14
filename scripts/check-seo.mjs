import assert from 'node:assert/strict'
import * as cheerio from 'cheerio'

// Validate the actual server response, including when a crawler does not run JS.
const origin = new URL(process.argv[2] ?? 'http://localhost:8787')
const canonicalOrigin = 'https://5km.studio'
async function get(path, userAgent = 'Googlebot') {
  const response = await fetch(new URL(path, origin), {
    headers: { 'User-Agent': userAgent },
    signal: AbortSignal.timeout(60000),
  })
  assert.equal(response.status, 200, `${path}: HTTP status`)
  return response.text()
}

const xml = await get('/sitemap.xml')
const sitemap = cheerio.load(xml, { xmlMode: true })
const urls = sitemap('loc')
  .map((_, el) => sitemap(el).text())
  .get()
assert.ok(urls.length > 6, 'Sitemap must include published articles')
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URLs')
assert.ok(urls.includes(`${canonicalOrigin}/about`))
assert.ok(urls.every((url) => new URL(url).origin === canonicalOrigin))
const dates = sitemap('lastmod')
  .map((_, el) => sitemap(el).text())
  .get()
assert.ok(new Set(dates).size > 1, 'lastmod must reflect CMS dates')
assert.ok(dates.every((date) => Number.isFinite(Date.parse(date))))

const robots = await get('/robots.txt')
assert.ok(robots.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`))
assert.ok(
  !/^Disallow:\s*\/\s*$/im.test(robots),
  'Public site must remain crawlable'
)
const llms = await get('/llms.txt')
assert.ok(llms.startsWith('# 十里'))
const errors = []
let next = 0
let articles = 0
await Promise.all(
  Array.from({ length: 3 }, async () => {
    while (next < urls.length) {
      const url = urls[next++]
      const path = new URL(url).pathname
      try {
        const $ = cheerio.load(await get(path))
        assert.equal(new URL($('link[rel="canonical"]').attr('href')).href, url)
        assert.ok($('title').text().trim())
        assert.ok($('meta[name="description"]').attr('content'))
        assert.ok(
          !($('meta[name="robots"]').attr('content') ?? '').includes('noindex')
        )
        assert.equal($('h1').length, 1, `${path}: one article/page heading`)
        if (path.startsWith('/blog/')) {
          articles++
          assert.ok($('article[data-postid]').text().trim().length > 100)
          assert.ok(
            !$('h1').attr('style')?.includes('opacity:0'),
            'Title must be visible before hydration'
          )
          const schema = JSON.parse(
            $('script[type="application/ld+json"]').html()
          )
          assert.equal(schema['@type'], 'BlogPosting')
          assert.equal(schema.mainEntityOfPage, url)
          assert.equal(schema.author.url, `${canonicalOrigin}/about`)
          assert.ok(schema.datePublished)
          assert.ok(schema.dateModified)
          assert.equal($('a[rel="author"]').attr('href'), '/about')
          assert.ok(
            llms.includes(`](${url})`),
            'llms index must include every published article'
          )
        }
      } catch (error) {
        errors.push({ path, error: error.message })
      }
    }
  })
)
for (const bot of [
  'OAI-SearchBot',
  'ChatGPT-User',
  'PerplexityBot',
  'Claude-SearchBot',
]) {
  const html = await get('/blog/tailscale-peer-relay', bot)
  assert.ok(html.includes('data-postid='), `${bot}: must receive article HTML`)
}
console.log(
  JSON.stringify(
    {
      pages: urls.length,
      articles,
      passed: urls.length - errors.length,
      errors,
    },
    null,
    2
  )
)
assert.equal(errors.length, 0)
