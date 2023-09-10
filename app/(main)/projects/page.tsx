import { type Metadata } from 'next'

import { Projects } from '~/app/(main)/projects/Projects'
import { StoreIcon } from '~/assets'
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
    <Container className="mt-12 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl text-justify">
          <StoreIcon className="mb-2 mr-2 text-4xl sm:text-6xl inline-flex transform-gpu transition-transform duration-500 hover:rotate-180"/>
          <span>
            我的一些产品和项目
          </span>
        </h1>
        <p className="mt-6 text-base text-zinc-600 dark:text-zinc-400">
          🎈 我做过各种各样的小项目和产品，有<b>开源</b>的也有<b>闭源</b>
          的，有<b>硬件</b>的也有<b>软件</b>的!
          <br/>
          这里会
          <strong className="underline decoration-2 underline-offset-4 decoration-wavy decoration-lime-500">优先列出最近做的一些产品和项目</strong>。
        </p>
      </header>
      <div className="mt-16 sm:mt-20">
        <Projects />
      </div>
    </Container>
  )
}

export const revalidate = 3600
