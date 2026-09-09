import { sql } from 'drizzle-orm'
import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

const timestamp = (name: string) => integer(name, { mode: 'timestamp_ms' })
const json = (name: string) => text(name, { mode: 'json' })
const varchar = (name: string, _options: { length: number }) => text(name)

export const subscribers = sqliteTable('subscribers', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: varchar('email', { length: 120 }),
  token: varchar('token', { length: 50 }),
  subscribedAt: timestamp('subscribed_at'),
  unsubscribedAt: timestamp('unsubscribed_at'),
  updatedAt: timestamp('updated_at').default(sql`(unixepoch() * 1000)`),
})

export const newsletters = sqliteTable('newsletters', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  subject: varchar('subject', { length: 200 }),
  body: text('body'),
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').default(sql`(unixepoch() * 1000)`),
  updatedAt: timestamp('updated_at').default(sql`(unixepoch() * 1000)`),
})

export const comments = sqliteTable(
  'comments',
  {
    id: integer('id').primaryKey({ autoIncrement: true }),
    userId: varchar('user_id', { length: 200 }).notNull(),
    userInfo: json('user_info'),
    postId: varchar('post_id', { length: 100 }).notNull(),
    parentId: integer('parent_id'),
    body: json('body'),
    createdAt: timestamp('created_at').default(sql`(unixepoch() * 1000)`),
    updatedAt: timestamp('updated_at').default(sql`(unixepoch() * 1000)`),
  },
  (table) => ({
    postIdx: index('post_idx').on(table.postId),
  })
)

export const guestbook = sqliteTable('guestbook', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: varchar('user_id', { length: 200 }).notNull(),
  userInfo: json('user_info'),
  message: text('message').notNull(),
  parentId: integer('parent_id'),
  createdAt: timestamp('created_at').default(sql`(unixepoch() * 1000)`),
  updatedAt: timestamp('updated_at').default(sql`(unixepoch() * 1000)`),
})
