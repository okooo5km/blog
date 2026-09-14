import { type Metadata } from 'next'

import { Projects } from '~/app/(main)/projects/Projects'
import { StoreIcon } from '~/assets'
import { Container } from '~/components/ui/Container'

const title = '我的项目&产品'
const description =
  '个人做了各种各样的不知名小项目和产品，这里是我筛选出来了的一些，后面会持续更新。'
export const metadata = {
  alternates: { canonical: '/projects' },
  title,
  description,
  openGraph: {
    url: '/projects',
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
    <Container className="mt-12 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-justify text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          <StoreIcon className="mb-2 mr-2 inline-flex transform-gpu text-4xl transition-transform duration-500 hover:rotate-180 sm:text-6xl" />
          <span>我的一些产品和项目</span>
        </h1>
        🚀 我热爱创造和探索，做过各种各样的小项目和产品！
        <br /> 🌟 有<b>开源</b>的也有
        <b>闭源</b>的， 🛠️ 有<b>硬件</b>的也有<b>软件</b>的。
        <br />
        📌 这里会
        <strong className="underline decoration-lime-500 decoration-wavy decoration-2 underline-offset-4">
          优先展示最近完成的精选项目
        </strong>
        ✨
      </header>
      <div className="mt-16 sm:mt-20">
        <Projects />
      </div>
    </Container>
  )
}

export const revalidate = 3600
