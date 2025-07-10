import { currentUser } from '@clerk/nextjs'
import { clerkClient } from '@clerk/nextjs/server'
import { type NextRequest, NextResponse } from 'next/server'

import { fetchGuestbookMessages } from '~/db/queries/guestbook'
import { ratelimit } from '~/lib/redis'

export async function GET(_req: NextRequest) {
  const user = await currentUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { success } = await ratelimit.limit(`guestbook-users:${user.id}`)
  if (!success) {
    return new Response('Too Many Requests', {
      status: 429,
    })
  }

  try {
    // 获取留言墙消息以获取所有参与过的用户
    const messages = await fetchGuestbookMessages()
    
    // 提取唯一的用户ID
    const uniqueUserIds = Array.from(
      new Set(messages.map((msg) => msg.userId))
    )
    
    // 获取用户详细信息，包括邮箱
    const users = await Promise.all(
      uniqueUserIds.map(async (userId) => {
        try {
          const clerkUser = await clerkClient.users.getUser(userId)
          return {
            id: userId,
            name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim() || 'Anonymous',
            email: clerkUser.emailAddresses[0]?.emailAddress || null,
            imageUrl: clerkUser.imageUrl,
          }
        } catch (error) {
          // 如果获取用户失败，使用缓存的信息
          const cachedUser = messages.find(msg => msg.userId === userId)
          return {
            id: userId,
            name: cachedUser?.userInfo ? 
              `${cachedUser.userInfo.firstName || ''} ${cachedUser.userInfo.lastName || ''}`.trim() || 'Anonymous' : 
              'Anonymous',
            email: null,
            imageUrl: cachedUser?.userInfo?.imageUrl || null,
          }
        }
      })
    )
    
    return NextResponse.json(users)
  } catch (error) {
    return NextResponse.json({ error }, { status: 400 })
  }
}