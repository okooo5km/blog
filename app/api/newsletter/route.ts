import { Ratelimit } from '@upstash/ratelimit'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '~/config/email'
import { db } from '~/db'
import { subscribers } from '~/db/schema'
import ConfirmSubscriptionEmail from '~/emails/ConfirmSubscription'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { resend } from '~/lib/mail'
import { redis } from '~/lib/redis'

const newsletterFormSchema = z.object({
  email: z.string().email().min(1),
})

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(1, '10 s'),
  analytics: true,
})

export async function POST(req: NextRequest) {
  if (env.NODE_ENV === 'production') {
    const { success } = await ratelimit.limit('subscribe_' + (req.ip ?? ''))
    if (!success) {
      return NextResponse.error()
    }
  }

  try {
    const { data } = await req.json()
    const parsed = newsletterFormSchema.parse(data)

    const [subscriber] = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.email, parsed.email))

    if (subscriber) {
      // 如果存在订阅记录，检查是否已退订
      if (!subscriber.unsubscribedAt) {
        // 邮箱存在且未退订，表示已经是活跃订阅者
        return NextResponse.json({
          status: 'success',
          message: '您已经订阅了我们的 Newsletter',
        })
      } else {
        // 之前退订过的用户重新订阅，更新记录
        await db
          .update(subscribers)
          .set({
            unsubscribedAt: null,
            updatedAt: new Date(),
            token: crypto.randomUUID(), // 生成新的 token
          })
          .where(eq(subscribers.email, parsed.email))

        return NextResponse.json({
          status: 'success',
          message: '欢迎重新订阅！',
        })
      }
    }

    // 新订阅者，生成 token 并发送确认邮件
    const token = crypto.randomUUID()

    if (env.NODE_ENV === 'production') {
      await resend.emails.send({
        from: emailConfig.from,
        to: parsed.email,
        subject: '来自 5km studio 的订阅确认',
        react: ConfirmSubscriptionEmail({
          link: url(`confirm/${token}`).href,
        }),
      })

      await db.insert(subscribers).values({
        email: parsed.email,
        token,
        subscribedAt: new Date(), // 添加订阅时间
        unsubscribedAt: null,
        updatedAt: new Date(),
      })
    }

    return NextResponse.json({
      status: 'success',
      message: '订阅确认邮件已发送，请查收！',
    })
  } catch (error) {
    console.error('[Newsletter]', error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: '邮箱格式不正确' }, { status: 400 })
    }

    return NextResponse.json({ error: '订阅失败，请稍后重试' }, { status: 500 })
  }
}
