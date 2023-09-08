import { type Metadata } from 'next'

import { Projects } from '~/app/(main)/projects/Projects'
import { Container } from '~/components/ui/Container'

const title = '我的项目&产品'
const description =
  '个人做了各种各样的不知名小项目和产品，这里是我筛选出来了的一些，后面会持续更新。'
export const metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
  },
  twitter: {
    title,
    description,
    card: 'summary_large_image',
  },
} satisfies Metadata

export default function ProjectsPage() {
  return (
    <Container className="mt-16 sm:mt-32">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          我过去的一些项目&产品。
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          我做了各种各样的小项目，有<b>开源</b>的，有<b>实验</b>
          的，也有 <b>以乐趣为导向</b>
          的，会优先列出最新做的一些产品。
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <Projects />
      </div>
    </Container>
  )
}

export const revalidate = 3600
