import Balancer from 'react-wrap-balancer'

import { PeekabooLink } from '~/components/links/PeekabooLink'
import { SocialLink } from '~/components/links/SocialLink'
import { Container } from '~/components/ui/Container'

import { BlogPosts } from './BlogPosts'

const description =
  '✍️ 分享是最好的学习！我深信写作不仅能帮助自己梳理思路、加深理解，更能为他人带来启发与价值。🔍 这里主要分享技术见解，同时也会探讨设计思维、产品洞察等多元话题。🌊 期待与你在知识的海洋中相遇，共同成长。'
export const metadata = {
  title: '我的博客',
  description,
  openGraph: {
    title: '我的博客',
    description,
  },
  twitter: {
    title: '我的博客',
    description,
    card: 'summary_large_image',
  },
}

// TODO: add pagination or infinite scroll
export default function BlogPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <header className="max-w-2xl">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          感谢您的关注
        </h1>
        <p className="my-4 text-base text-zinc-600 dark:text-zinc-400">
          <Balancer>{description}</Balancer>
        </p>
        <p className="my-4">
          <Balancer>
            💬
            <strong> 新开始，新征途！</strong>
            过去写的文章都在
            <PeekabooLink href="https://blog.5km.studio">
              原博客网站
            </PeekabooLink>
            ，也欢迎您去看看！👏
          </Balancer>
        </p>
        <p className="flex items-center">
          <SocialLink href="/feed.xml" platform="rss" />
        </p>
      </header>
      <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
        <BlogPosts limit={100} />
      </div>
    </Container>
  )
}

export const revalidate = 60
