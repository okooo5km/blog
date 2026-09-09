import { BlogArchive, blogMetadata } from './BlogArchive'

export const metadata = { ...blogMetadata, alternates: { canonical: '/blog' } }

export default function BlogPage() {
  return <BlogArchive />
}

export const revalidate = 60
