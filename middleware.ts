import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'
import {
  type NextFetchEvent,
  type NextRequest,
  NextResponse,
} from 'next/server'

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

const isContentRoute = createRouteMatcher([
  '/',
  '/blog(.*)',
  '/projects',
  '/guestbook',
  '/newsletters(.*)',
  '/about',
  '/rss',
  '/feed',
  '/ama',
])

const clerkCookieNames = ['__session', '__client_uat', '__clerk_db_jwt']

// 没有任何 Clerk 状态的公开内容请求（搜索/AI 爬虫、首次访问）不需要鉴权。
// Clerk 开发实例会把这类文档请求 307 到 *.clerk.accounts.dev 握手，
// 该响应带 X-Robots-Tag: noindex, nofollow，会让 Google 把整站判为 noindex。
function canSkipClerk(req: NextRequest) {
  if (req.method !== 'GET' && req.method !== 'HEAD') {
    return false
  }
  if (!isContentRoute(req)) {
    return false
  }
  for (const key of req.nextUrl.searchParams.keys()) {
    if (key.startsWith('__clerk')) {
      return false
    }
  }

  return !req.cookies
    .getAll()
    .some(({ name }) =>
      clerkCookieNames.some(
        (prefix) => name === prefix || name.startsWith(`${prefix}_`)
      )
    )
}

const handleWithClerk = clerkMiddleware(async (auth, req: NextRequest) => {
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

export default function middleware(req: NextRequest, event: NextFetchEvent) {
  if (canSkipClerk(req)) {
    return NextResponse.next()
  }

  return handleWithClerk(req, event)
}
