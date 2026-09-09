import { notFound, permanentRedirect } from 'next/navigation'

import { BlogArchive, blogMetadata } from '~/app/(main)/blog/BlogArchive'

type Props = { params: Promise<{ page: string }> }

export async function generateMetadata({ params }: Props) {
  const { page } = await params
  return {
    ...blogMetadata,
    title: `我的博客 · 第 ${page} 页`,
    alternates: { canonical: `/blog/page/${page}` },
  }
}

export default async function ArchivePage({ params }: Props) {
  const { page } = await params
  if (!/^[1-9]\d*$/.test(page) || !Number.isSafeInteger(Number(page)))
    notFound()
  if (page === '1') permanentRedirect('/blog')
  return <BlogArchive page={Number(page)} />
}

export function generateStaticParams() {
  return []
}
export const revalidate = 60
