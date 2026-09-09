import { getCloudflareContext } from '@opennextjs/cloudflare'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { ratelimit } from '~/lib/ratelimit'
import { storage } from '~/lib/storage'
import { getBlogPost } from '~/sanity/queries'

const input = z.object({ pathname: z.string().startsWith('/').max(1024) })

export async function POST(request: Request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) {
    return new Response('Forbidden', { status: 403 })
  }
  const parsed = input.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return new Response('Invalid path', { status: 400 })

  const { success } = await ratelimit.limit(`visit:${getIP(request)}`)
  if (!success) return new Response('Too Many Requests', { status: 429 })

  const match = /^\/blog\/([^/]+)$/.exec(parsed.data.pathname)
  const post = match ? await getBlogPost(decodeURIComponent(match[1])) : null
  const pipeline = storage.pipeline()
  if (env.APP_ENV === 'production') pipeline.incr(kvKeys.totalPageViews)
  else pipeline.get(kvKeys.totalPageViews)
  pipeline.get(kvKeys.currentVisitor)
  if (post) {
    if (env.APP_ENV === 'production') pipeline.incr(kvKeys.postViews(post._id))
    else pipeline.get(kvKeys.postViews(post._id))
  }

  if (env.APP_ENV === 'production') {
    let country = request.headers.get('x-vercel-ip-country')
    let city = request.headers.get('x-vercel-ip-city')
    try {
      const { cf } = getCloudflareContext()
      country = typeof cf?.country === 'string' ? cf.country : country
      city = typeof cf?.city === 'string' ? cf.city : city
    } catch {
      // Local Next.js and the Vercel rollback do not have Cloudflare context.
    }
    const countryInfo = countries.find((item) => item.cca2 === country)
    if (countryInfo) {
      pipeline.set(kvKeys.currentVisitor, {
        country,
        city,
        flag: countryInfo.flag,
      })
    }
  }

  const [totalViews, lastVisitor, postViews] = await pipeline.exec()
  return NextResponse.json(
    {
      totalViews: totalViews ?? 0,
      lastVisitor,
      postViews: post ? postViews ?? 0 : undefined,
    },
    { headers: { 'Cache-Control': 'private, no-store' } }
  )
}
