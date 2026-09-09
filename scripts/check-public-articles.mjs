import assert from 'node:assert/strict'
const origin = process.argv[2] ?? 'https://5km.studio'
const xml = await (await fetch(origin+'/sitemap.xml')).text()
const urls = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>new URL(x[1])).filter(u=>u.origin===new URL(origin).origin && /^\/blog\/[^/]+$/.test(u.pathname))
let next=0
const errors=[]
await Promise.all(Array.from({length:2},async()=> {
  while(next<urls.length) {
    const url=urls[next++]
    try { const response=await fetch(url,{signal:AbortSignal.timeout(30000)});const html=await response.text();assert.equal(response.status,200);assert.ok(html.includes('data-postid=')); }
    catch(error) {errors.push(url.pathname+': '+error.message)}
  }
}))
console.log(JSON.stringify({articles:urls.length,passed:urls.length-errors.length,errors},null,2))
assert.ok(urls.length>0 && errors.length===0)
