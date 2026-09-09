import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'
import { type NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

import { emailConfig } from '~/config/email'
import { db } from '~/db'
import { type GuestbookDto, GuestbookHashids } from '~/db/dto/guestbook.dto'
import { fetchGuestbookMessages } from '~/db/queries/guestbook'
import { guestbook } from '~/db/schema'
import NewGuestbookEmail from '~/emails/NewGuestbook'
import NewGuestbookReplyEmail from '~/emails/NewGuestbookReply'
import { env } from '~/env.mjs'
import { url } from '~/lib'
import { getIP } from '~/lib/ip'
import { resend } from '~/lib/mail'
import { ratelimit } from '~/lib/ratelimit'

function getKey(id?: string) {
  return `guestbook${id ? `:${id}` : ''}`
}

export async function GET(req: NextRequest) {
  try {
    const { success } = await ratelimit.limit(getKey(getIP(req)))
    if (!success) {
      return new Response('Too Many Requests', {
        status: 429,
      })
    }

    return NextResponse.json(await fetchGuestbookMessages())
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}

const SignGuestbookSchema = z.object({
  message: z.string().min(1).max(600),
  parentId: z.string().nullable().optional(),
})

export async function POST(req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(getKey(user.id))
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  try {
    const data = await req.json()
    const { message, parentId: hashedParentId } =
      SignGuestbookSchema.parse(data)

    // Decode parentId from Hashids
    const [decodedParentId] = GuestbookHashids.decode(hashedParentId ?? '')
    const parentId = decodedParentId ? (decodedParentId as number) : null

    // Look up parent message info for response and notification
    let parentUserInfo: {
      firstName?: string | null
      lastName?: string | null
    } | null = null
    let parentAuthorUserId: string | null = null
    if (parentId) {
      const [parentRow] = await db
        .select({
          userId: guestbook.userId,
          userInfo: guestbook.userInfo,
        })
        .from(guestbook)
        .where(eq(guestbook.id, parentId))
      if (parentRow) {
        parentAuthorUserId = parentRow.userId
        if (parentRow.userInfo) {
          const info = parentRow.userInfo as {
            firstName?: string | null
            lastName?: string | null
          }
          parentUserInfo = {
            firstName: info.firstName,
            lastName: info.lastName,
          }
        }
      }
    }

    const guestbookData = {
      userId: user.id,
      message,
      parentId,
      userInfo: {
        firstName: user.firstName,
        lastName: user.lastName,
        imageUrl: user.imageUrl,
      },
    }

    // 解析 @ 提及的用户
    const mentionedUsernames = extractMentions(message)
    // Track already-notified emails to avoid duplicates
    const notifiedEmails = new Set<string>()

    // 发送邮件通知
    if (env.RESEND_API_KEY && env.NODE_ENV === 'production' && env.APP_ENV === 'production') {
      // Reply notification: notify parent message author
      if (parentAuthorUserId && parentAuthorUserId !== user.id) {
          try {
            const clerk = await clerkClient()
            const clerkUser = await clerk.users.getUser(parentAuthorUserId)
            const email = clerkUser.emailAddresses[0]?.emailAddress
            if (email) {
              notifiedEmails.add(email)
              await resend.emails.send({
                from: emailConfig.from,
                to: email,
                subject: '👋 有人回复了你在留言墙的留言',
                react: NewGuestbookReplyEmail({
                  link: url(`/guestbook`).href,
                  userFirstName: user.firstName,
                  userLastName: user.lastName,
                  userImageUrl: user.imageUrl,
                  commentContent: message,
                }),
              })
            }
          } catch (error) {
            console.error(
              `Failed to notify parent author ${parentAuthorUserId}:`,
              error
            )
          }
      }

      // @ mention notifications
      const mentionEmails: string[] = []
      if (mentionedUsernames.length > 0) {
        const messages = await fetchGuestbookMessages()
        const mentionedUserIds = new Set<string>()

        // 匹配用户名找到用户ID
        for (const msg of messages) {
          if (msg.userInfo) {
            const fullName =
              `${msg.userInfo.firstName || ''} ${msg.userInfo.lastName || ''}`.trim()
            if (
              mentionedUsernames.some((username) =>
                fullName.includes(username)
              )
            ) {
              mentionedUserIds.add(msg.userId)
            }
          }
        }

        // 获取被提及用户的邮箱
        for (const userId of mentionedUserIds) {
          try {
            const clerk = await clerkClient()
            const clerkUser = await clerk.users.getUser(userId)
            const email = clerkUser.emailAddresses[0]?.emailAddress
            if (email && !notifiedEmails.has(email)) {
              mentionEmails.push(email)
              notifiedEmails.add(email)
            }
          } catch (error) {
            console.error(
              `Failed to get email for user ${userId}:`,
              error
            )
          }
        }
      }

      // 根留言（非回复）时通知管理员
      const adminEmail = env.SITE_NOTIFICATION_EMAIL_TO
      if (!parentId && adminEmail && !notifiedEmails.has(adminEmail)) {
        mentionEmails.push(adminEmail)
        notifiedEmails.add(adminEmail)
      }

      // 发送 @提及 和管理员通知邮件
      if (mentionEmails.length > 0) {
        await Promise.all(
          mentionEmails.map((email) =>
            resend.emails.send({
              from: emailConfig.from,
              to: email,
              subject:
                email === adminEmail
                  ? '👋 有人刚刚在留言墙留言了'
                  : '👋 有人在留言墙提到了你',
              react: NewGuestbookEmail({
                link: url(`/guestbook`).href,
                userFirstName: user.firstName,
                userLastName: user.lastName,
                userImageUrl: user.imageUrl,
                commentContent: message,
              }),
            })
          )
        )
      }
    }

    const [newGuestbook] = await db
      .insert(guestbook)
      .values(guestbookData)
      .returning({
        newId: guestbook.id,
      })

    return NextResponse.json(
      {
        ...guestbookData,
        id: GuestbookHashids.encode(newGuestbook.newId),
        parentId: hashedParentId ?? null,
        parentUserInfo,
        createdAt: new Date(),
      } satisfies GuestbookDto,
      {
        status: 201,
      }
    )
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}

// 提取消息中的 @ 提及（忽略 Markdown 链接中的 @）
function extractMentions(message: string): string[] {
  const mentions: string[] = []
  
  // 使用同样的逻辑：只处理不在 Markdown 链接中的 @ 提及
  message.replace(
    /(?<!\]\(.*?)@([^\s\]]+)(?!\]\()/g,
    (match, username) => {
      // 额外检查：如果这个 @ 在方括号内，说明可能是 Markdown 链接的一部分
      const beforeAt = message.substring(0, message.indexOf(match))
      const openBrackets = (beforeAt.match(/\[/g) || []).length
      const closeBrackets = (beforeAt.match(/\]/g) || []).length
      
      // 如果方括号不匹配，说明我们在一个未关闭的方括号内，跳过
      if (openBrackets <= closeBrackets) {
        mentions.push(username)
      }
      
      return match
    }
  )
  
  return mentions
}
