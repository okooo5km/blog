import { type Metadata } from 'next'
import { notFound } from 'next/navigation'

import { BlogPostPage } from '~/app/(main)/blog/BlogPostPage'
import { kvKeys } from '~/config/kv'
import { getPostStatistics } from '~/lib/post-statistics'
import { getBlogPost } from '~/sanity/queries'

export const generateMetadata = async (props: {
  params: Promise<{ slug: string }>
}) => {
  const params = await props.params
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  const { title, description, mainImage } = post

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: mainImage.asset.url,
        },
      ],
      type: 'article',
    },
    twitter: {
      images: [
        {
          url: mainImage.asset.url,
        },
      ],
      title,
      description,
      card: 'summary_large_image',
      site: '@okooo5km',
      creator: '@okooo5km',
    },
  } satisfies Metadata
}

export default async function BlogPage(props: {
  params: Promise<{ slug: string }>
}) {
  const params = await props.params
  const post = await getBlogPost(params.slug)
  if (!post) {
    notFound()
  }

  const related = post.related ?? []
  const keys = [
    kvKeys.postViews(post._id),
    `reactions:${post._id}`,
    ...related.map(({ _id }) => kvKeys.postViews(_id)),
  ]
  let values: unknown[] = []
  try {
    values = await getPostStatistics(keys)
  } catch (error) {
    console.error('Post statistics unavailable', error)
  }
  const views = typeof values[0] === 'number' ? values[0] : 0
  const reactions = Array.isArray(values[1])
    ? (values[1] as number[])
    : undefined
  const relatedViews = related.map((_, index) =>
    typeof values[index + 2] === 'number' ? (values[index + 2] as number) : 0
  )

  return (
    <BlogPostPage
      post={post}
      views={views}
      relatedViews={relatedViews}
      reactions={reactions}
    />
  )
}

export const revalidate = 60

// Generate article pages on first visit and refresh them through ISR.
export function generateStaticParams() {
  return []
}
