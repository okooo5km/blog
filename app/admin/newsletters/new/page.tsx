import { Card, Text, TextInput, Title } from '@tremor/react'
import { extendDateTime, parseDateTime } from '@zolplay/utils'
import { and, isNull, lte } from 'drizzle-orm'
import { redirect } from 'next/navigation'
import { z } from 'zod'

import { Button } from '~/components/ui/Button'
import { emailConfig } from '~/config/email'
import { db } from '~/db'
import { newsletters, subscribers } from '~/db/schema'
import NewslettersTemplate from '~/emails/NewslettersTemplate'
import { env } from '~/env.mjs'
import { resend } from '~/lib/mail'

extendDateTime({
  timezone: true,
})

const CreateNewsletterSchema = z.object({
  subject: z.string().min(1),
  body: z.string().min(1),
})

export default function CreateNewsletterPage() {
  async function addNewsletter(formData: FormData) {
    'use server'

    const data = CreateNewsletterSchema.parse(
      Object.fromEntries(formData.entries())
    )

    // 修改查询条件：只获取已确认订阅且未退订的用户
    const subs = await db
      .select({
        email: subscribers.email,
      })
      .from(subscribers)
      .where(
        and(
          // 已确认订阅的时间
          lte(subscribers.subscribedAt, new Date()),
          // 未退订的用户（unsubscribedAt 为 null）
          isNull(subscribers.unsubscribedAt)
        )
      )

    const subscriberEmails = new Set(
      subs
        .filter((sub) => typeof sub.email === 'string' && sub.email.length > 0)
        .map((sub) => sub.email)
    )

    // 检查是否有有效的订阅者
    if (subscriberEmails.size === 0) {
      throw new Error('没有有效的订阅者')
    }

    try {
      // 发送 newsletter
      await resend.emails.send({
        subject: data.subject,
        from: emailConfig.from,
        to: env.SITE_NOTIFICATION_EMAIL_TO ?? [],
        reply_to: emailConfig.from,
        bcc: Array.from(subscriberEmails),
        react: NewslettersTemplate({
          subject: data.subject,
          body: data.body,
        }),
      })

      // 记录到数据库
      await db.insert(newsletters).values({
        ...data,
        sentAt: parseDateTime({
          date: new Date(),
          timezone: 'Asia/Shanghai',
        })?.toDate(),
      })

      redirect('/admin/newsletters')
    } catch (error) {
      console.error('发送 newsletter 失败:', error)
      throw new Error('发送失败，请稍后重试')
    }
  }

  return (
    <>
      <Title>Create a newsletter</Title>

      <Card className="mt-6">
        <form className="flex flex-col gap-4" action={addNewsletter}>
          <div className="flex flex-col space-y-3">
            <Text>Subject</Text>
            <TextInput name="subject" required />
          </div>

          <div className="flex flex-col space-y-2">
            <label
              htmlFor="body"
              className="block text-sm font-medium leading-6 text-zinc-800 dark:text-zinc-200"
            >
              Body
            </label>
            <div className="mt-2">
              <textarea
                rows={20}
                name="body"
                id="body"
                className="block w-full rounded-md border-0 px-2 py-2 text-zinc-900 shadow-sm ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 dark:bg-slate-800 dark:text-zinc-100 dark:ring-zinc-700 sm:text-sm sm:leading-6"
                defaultValue={''}
                required
              />
            </div>
          </div>

          <footer className="border-t border-gray-900/10 pt-6 dark:border-gray-100/10">
            <div className="flex justify-end">
              <Button type="submit">Create</Button>
            </div>
          </footer>
        </form>
      </Card>
    </>
  )
}
