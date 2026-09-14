import { type MetadataRoute } from 'next'

import { seo } from '~/lib/seo'
import { getSitemapPosts } from '~/sanity/queries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getSitemapPosts()
  return [
    ...['/', '/blog', '/projects', '/guestbook', '/ama', '/about'].map(
      (path) => ({
        url: new URL(path, seo.url).href,
      })
    ),
    ...posts.map(({ slug, updatedAt }) => ({
      url: new URL(`/blog/${encodeURIComponent(slug)}`, seo.url).href,
      lastModified: updatedAt,
    })),
  ]
}

export const revalidate = 60
