import { kvKeys } from '~/config/kv'
import { env } from '~/env.mjs'
import { redis } from '~/lib/redis'
import { getLatestBlogPosts } from '~/sanity/queries'

import { BlogPostCard } from './BlogPostCard'

export async function BlogPosts({ limit = 5 }) {
  const posts = await getLatestBlogPosts({ limit, forDisplay: true })

  if (posts.length === 0) {
    return (<strong>🏃 我的新文章很快就会发布，不要着急！</strong>)
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const postIdKeys = posts.map(({ _id }) => kvKeys.postViews(_id))

  let views: number[] = []
  if (env.VERCEL_ENV === 'development') {
    views = posts.map(() => Math.floor(Math.random() * 1000))
  } else {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    views = await redis.mget<number[]>(...postIdKeys)
  }

  return (
    <>
      {posts.map((post, idx) => (
        <BlogPostCard post={post} views={views[idx] ?? 0} key={post._id} />
      ))}
    </>
  )
}
