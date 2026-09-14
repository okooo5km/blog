import { seo } from '~/lib/seo'
import { getPublicPostIndex } from '~/sanity/queries'

// An optional discovery index; HTML remains the canonical, complete source.
const line = (value: string) =>
  (value ?? '').replace(/[\r\n]+/g, ' ').replace(/([\[\]\\])/g, '\\$1')

export async function GET() {
  const posts = await getPublicPostIndex()
  const text = [
    '# 十里（5km）的个人博客',
    '',
    '> 独立开发者的 macOS 开发、AI 工具、设计与产品实践笔记。',
    '',
    '文章正文通过服务端 HTML 提供，无需登录。每篇文章的 canonical URL 是引用地址。发布日期和适用条件请以原文为准。',
    '',
    '## 站点入口',
    '',
    '- [关于作者](https://5km.studio/about)',
    '- [全部文章](https://5km.studio/blog)',
    '- [产品与项目](https://5km.studio/projects)',
    '- [RSS](https://5km.studio/feed.xml)',
    '- [Sitemap](https://5km.studio/sitemap.xml)',
    '',
    '## 文章',
    '',
    ...posts.map(
      (post) =>
        `- [${line(post.title)}](${new URL(`/blog/${encodeURIComponent(post.slug)}`, seo.url).href}): ${line(post.description)}`
    ),
    '',
  ].join('\n')
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
      'X-Content-Type-Options': 'nosniff',
    },
  })
}

export const revalidate = 300
