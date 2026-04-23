import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'

import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import countries from '~/lib/countries.json'
import { getIP } from '~/lib/ip'
import { redis } from '~/lib/redis'

export const config = {
  matcher: ['/((?!_next|studio|.*\\..*).*)'],
}

const isPublicRoute = createRouteMatcher([
  '/',
  '/studio(.*)',
  '/api(.*)',
  '/blog(.*)',
  '/confirm(.*)',
  '/projects',
  '/guestbook',
  '/newsletters(.*)',
  '/about',
  '/rss',
  '/feed',
  '/ama',
  '/unsubscribe',
  '/sign-in(.*)',
  '/sign-up(.*)',
])

export default clerkMiddleware(async (auth, req: NextRequest) => {
  const { nextUrl } = req

  const blockedIPs: Array<string> = []
  const ip = getIP(req)
  const isApi = nextUrl.pathname.startsWith('/api/')

  if (blockedIPs?.includes(ip)) {
    if (isApi) {
      return NextResponse.json(
        { error: 'You have been blocked.' },
        { status: 403 }
      )
    }

    nextUrl.pathname = '/blocked'
    return NextResponse.rewrite(nextUrl)
  }

  if (nextUrl.pathname === '/blocked') {
    nextUrl.pathname = '/'
    return NextResponse.redirect(nextUrl)
  }

  // Geo tracking via headers (Next.js 15 removed req.geo)
  if (!isApi && env.VERCEL_ENV === 'production') {
    const country = req.headers.get('x-vercel-ip-country') ?? undefined
    const rawCity = req.headers.get('x-vercel-ip-city') ?? undefined
    let city = rawCity
    if (rawCity) {
      try {
        city = decodeURIComponent(rawCity)
      } catch {
        city = rawCity
      }
    }

    if (country) {
      const countryInfo = countries.find((x) => x.cca2 === country)
      if (countryInfo) {
        const flag = countryInfo.flag
        await redis.set(kvKeys.currentVisitor, { country, city, flag })
      }
    }
  }

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
