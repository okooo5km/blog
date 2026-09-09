import assert from 'node:assert/strict'
import { getPlatformProxy } from 'wrangler'
import { drizzle } from 'drizzle-orm/d1'
import { eq, sql } from 'drizzle-orm'
import { comments, guestbook, newsletters, subscribers } from '../db/schema.ts'
const platform = await getPlatformProxy()
const db = drizzle(platform.env.BLOG_DB)
const marker = 'migration-model-test-20260910'
const created = []
try {
  const date = new Date('2026-09-09T12:34:56.789Z')
  const [comment] = await db.insert(comments).values({ userId: marker, postId: marker, userInfo: {firstName:'迁移验证'}, body: {text:'中文 😃',blockId:'paragraph'}, createdAt:date }).returning()
  created.push([comments,comment.id])
  assert.equal(comment.createdAt.getTime(),date.getTime())
  assert.deepEqual(comment.body,{text:'中文 😃',blockId:'paragraph'})
  const [reply] = await db.insert(comments).values({userId:marker,postId:marker,parentId:comment.id,body:{text:'回复'}}).returning()
  created.push([comments,reply.id]);assert.equal(reply.parentId,comment.id);assert.ok(reply.createdAt instanceof Date)
  const [message] = await db.insert(guestbook).values({userId:marker,message:'留言验证',userInfo:{firstName:'本地'}}).returning()
  created.push([guestbook,message.id]);assert.equal(message.message,'留言验证')
  const [subscriber] = await db.insert(subscribers).values({email:marker+'@example.invalid',token:marker,subscribedAt:date}).returning()
  created.push([subscribers,subscriber.id]);await db.update(subscribers).set({unsubscribedAt:date}).where(eq(subscribers.id,subscriber.id))
  const [updated] = await db.select().from(subscribers).where(eq(subscribers.id,subscriber.id));assert.equal(updated.unsubscribedAt.getTime(),date.getTime())
  const [newsletter] = await db.insert(newsletters).values({subject:marker,body:'**测试**'}).returning()
  created.push([newsletters,newsletter.id]);assert.equal(newsletter.body,'**测试**')
  const [counts] = await db.all(sql`SELECT count(*) AS total FROM comments WHERE created_at >= unixepoch('now', 'start of month')*1000`)
  assert.ok(counts.total>=2)
  console.log('D1 Drizzle: insert/returning, JSON, millisecond dates, defaults, reply IDs, update, admin count all passed')
} finally {
  for (const [table,id] of created.reverse()) await db.delete(table).where(eq(table.id,id))
  await platform.dispose()
}
