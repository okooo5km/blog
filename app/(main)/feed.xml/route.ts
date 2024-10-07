import RSS from 'rss'

import { seo } from '~/lib/seo'
import { getLatestBlogPosts } from '~/sanity/queries'

export const revalidate = 60 * 60 // 1 hour

export async function GET() {
  const feed = new RSS({
    title: seo.title,
    description: seo.description,
    site_url: seo.url.href,
    feed_url: `${seo.url.href}feed.xml`,
    language: 'zh-CN',
    image_url: `${seo.url.href}opengraph-image.png`,
    generator: 'PHP 9.0',
    custom_elements: [
      {
        follow_challenge: [
          { feedId: '59154114520141824' },
          { userId: '55790185154902016' },
        ],
      },
    ],
  })

  const data = await getLatestBlogPosts({ limit: 999 })
  if (!data) {
    return new Response('Not found', { status: 404 })
  }

  // 在您的 RSS feed 生成代码中
  data.forEach((post) => {
    feed.item({
      title: post.title,
      description: post.description, // 纯文本摘要
      url: `${seo.url.href}blog/${post.slug}`,
      guid: `${seo.url.href}blog/${post.slug}`, // 使用永久链接作为 guid
      date: new Date(post.publishedAt),
      enclosure: {
        url: post.mainImage.asset.url,
      },
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  })
}
