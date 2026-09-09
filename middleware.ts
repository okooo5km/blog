import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'

import { getIP } from '~/lib/ip'

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

  if (!isPublicRoute(req)) {
    await auth.protect()
  }
})
