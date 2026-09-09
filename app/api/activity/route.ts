import { type NextRequest, NextResponse } from 'next/server'

import { getIP } from '~/lib/ip'
import { createRateLimit } from '~/lib/ratelimit'
import { storage } from '~/lib/storage'


export async function GET(req: NextRequest) {
  const ratelimit = createRateLimit('RATE_ACTIVITY')
  const { success } = await ratelimit.limit('activity:app' + `_${getIP(req)}`)
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  const app = await storage.get('activity:app')

  return NextResponse.json({
    app,
  })
}
