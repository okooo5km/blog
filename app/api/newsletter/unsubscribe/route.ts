import { Ratelimit } from '@upstash/ratelimit'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '~/db'
import { subscribers } from '~/db/schema'
import { env } from '~/env.mjs'
import { redis } from '~/lib/redis'

const unsubscribeSchema = z.object({
  email: z.string().email().min(1),
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, '10 s'),
  analytics: true,
})

export async function POST(req: NextRequest) {
  // 生产环境进行速率限制
  if (env.NODE_ENV === 'production') {
    const { success } = await ratelimit.limit('unsubscribe_' + (req.ip ?? ''))
    if (!success) {
      return NextResponse.json(
        { error: '请求过于频繁，请稍后再试' },
        { status: 429 }
      )
    }
  }

  try {
    const { data } = await req.json()
    const parsed = unsubscribeSchema.parse(data)

    // 查找订阅记录
    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, parsed.email))

    if (!subscriber) {
      return NextResponse.json(
        { error: '未找到该邮箱的订阅记录' },
        { status: 404 }
      )
    }

    // 如果已经退订，直接返回成功
    if (subscriber.unsubscribedAt) {
      return NextResponse.json({ status: 'success' })
    }

    // 更新退订时间
    await db
      .update(subscribers)
      .set({
        unsubscribedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(subscribers.email, parsed.email))

    return NextResponse.json({ status: 'success' })
  } catch (error) {
    console.error('[Unsubscribe]', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 })
    }

    return NextResponse.json({ error: '退订失败，请稍后重试' }, { status: 500 })
  }
}
