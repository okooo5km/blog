import { kvKeys } from '~/config/kv'
import { getPostStatistics } from '~/lib/post-statistics'
import { getLatestBlogPosts } from '~/sanity/queries'

import { BlogPostCard } from './BlogPostCard'

export async function BlogPosts({ limit = 5, offset = 0 }) {
  const posts = await getLatestBlogPosts({ limit, offset, forDisplay: true })

  if (!posts?.length) {
    return (<strong>🏃 我的新文章很快就会发布，不要着急！</strong>)
  }

  const postIdKeys = posts.map(({ _id }) => kvKeys.postViews(_id))

  let views: number[] = []
  try {
    views = (await getPostStatistics(postIdKeys)) as number[]
  } catch (error) {
    console.error('Post statistics unavailable', error)
  }

  return (
    <>
      {posts.map((post, idx) => (
        <BlogPostCard post={post} views={views[idx] ?? 0} key={post._id} />
      ))}
    </>
  )
}
