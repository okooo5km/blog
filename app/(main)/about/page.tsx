import { type Metadata } from 'next'
import Link from 'next/link'

import { Container } from '~/components/ui/Container'
import { seo } from '~/lib/seo'

export const metadata: Metadata = {
  title: '关于十里（5km）',
  description:
    '十里（5km），独立开发者与产品创作者。记录 macOS 应用开发、AI 工具实践、设计和独立产品的制作过程。',
  alternates: { canonical: '/about' },
  openGraph: { title: '关于十里（5km）', url: '/about', type: 'profile' },
}

export default function AboutPage() {
  return (
    <Container className="mt-16 sm:mt-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'ProfilePage',
            '@id': new URL('/about#profile', seo.url).href,
            url: new URL('/about', seo.url).href,
            mainEntity: {
              '@type': 'Person',
              '@id': new URL('/about#person', seo.url).href,
              name: '十里（5km）',
              alternateName: ['5km', 'okooo5km'],
              url: new URL('/about', seo.url).href,
              sameAs: [
                'https://github.com/okooo5km',
                'https://twitter.com/okooo5km',
              ],
            },
          }).replace(/</g, '\u003c'),
        }}
      />
      <div className="max-w-2xl">
        <p className="mb-4 text-sm font-medium text-lime-700 dark:text-lime-400">
          关于作者
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-zinc-800 dark:text-zinc-100 sm:text-5xl">
          我是十里，
          <br className="sm:hidden" />
          也叫 5km。
        </h1>
        <p className="mt-6 text-lg leading-8 text-zinc-600 dark:text-zinc-400">
          我是一名独立开发者与产品创作者，喜欢做工具，也喜欢把制作过程写下来。这个博客记录我在
          macOS 开发、AI 工具、设计与独立产品上的实践。
        </p>
        <div className="mt-12 space-y-10 text-base leading-8 text-zinc-600 dark:text-zinc-400">
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
              我在做什么
            </h2>
            <p>
              从 Zipic 的图片压缩，到 Orchard 的 Apple
              应用工具，再到文章配图的小盒
              Skill，我关心的是：一个工具能否解决自己的问题，也帮到其他人。
            </p>
            <Link
              className="mt-3 inline-block font-medium text-lime-700 underline underline-offset-4 dark:text-lime-400"
              href="/projects"
            >
              看看我的产品与项目 →
            </Link>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
              这里写些什么
            </h2>
            <p>
              我会写 SwiftUI、AppKit 和 Vapor 的开发笔记，也会记录
              Tailscale、Cloudflare 和 AI
              工具的配置与排错。比起只给结论，我更愿意留下问题、尝试过程和适用条件。
            </p>
            <Link
              className="mt-3 inline-block font-medium text-lime-700 underline underline-offset-4 dark:text-lime-400"
              href="/blog"
            >
              阅读技术、工具与独立开发笔记 →
            </Link>
          </section>
          <section>
            <h2 className="mb-3 text-xl font-semibold text-zinc-800 dark:text-zinc-100">
              交流与勘误
            </h2>
            <p>
              技术文章记录的是当时的实践，系统版本和工具行为可能变化。如果发现问题，欢迎在文章下评论，或到留言墙告诉我。引用文章时，请保留原文链接，方便读者查看上下文。
            </p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 font-medium text-lime-700 underline underline-offset-4 dark:text-lime-400">
              <Link href="/guestbook">留言墙</Link>
              <a href="https://github.com/okooo5km">GitHub</a>
              <a href="https://twitter.com/okooo5km">X / Twitter</a>
              <a href="/feed.xml">RSS 订阅</a>
            </div>
          </section>
        </div>
      </div>
    </Container>
  )
}
