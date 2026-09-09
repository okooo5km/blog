import { type NextRequest, NextResponse } from 'next/server'

import { getIP } from '~/lib/ip'
import { createRateLimit } from '~/lib/ratelimit'
import { storage } from '~/lib/storage'


function getKey(id: string) {
  return `reactions:${id}`
}

const ratelimit = createRateLimit('RATE_GENERAL')

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id || id.length > 200) return new Response('Missing or invalid id', { status: 400 })

  const { success } = await ratelimit.limit(getKey(id) + `_${getIP(req)}`)
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  const value = await storage.get<number[]>(getKey(id))
  return NextResponse.json(value ?? [0, 0, 0, 0], { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function PATCH(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  const index = searchParams.get('index')
  if (!id || id.length > 200 || !index || !/^[0-3]$/.test(index)) {
    return new Response('Missing id or index', { status: 400 })
  }

  const key = getKey(id)

  const { success } = await ratelimit.limit(key + `_${getIP(req)}`)
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  const current = await storage.incrementReaction(key, Number(index))


  return NextResponse.json({
    data: current,
  })
}
