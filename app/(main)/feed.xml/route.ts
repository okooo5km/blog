import { toHTML } from '@portabletext/to-html'
import RSS from 'rss'

import { seo } from '~/lib/seo'
import { getLatestBlogPostsWithBody } from '~/sanity/queries'

// 自定义组件处理函数
const myPortableTextComponents = {
  types: {
    image: ({ value }) => {
      return `<figure>
        <img src="${value.url}" alt="${value.alt || ''}" />
        ${value.caption ? `<figcaption>${value.caption}</figcaption>` : ''}
      </figure>`
    },
    tweet: ({ value }) => {
      return `<blockquote class="twitter-tweet" data-dnt="true">
        <a href="https://twitter.com/user/status/${value.id}"></a>
      </blockquote>`
    },
    codeBlock: ({ value }) => {
      return `<pre><code class="language-${value.language}">${value.code}</code></pre>`
    },
    table: ({ value }) => {
      const [head, ...rows] = value.rows
      return `
        <table>
          ${
            head && head.cells.filter(Boolean).length > 0
              ? `
            <thead>
              <tr>${head.cells.map((cell) => `<th>${cell}</th>`).join('')}</tr>
            </thead>
          `
              : ''
          }
          <tbody>
            ${rows
              .map(
                (row) => `
              <tr>${row.cells.map((cell) => `<td>${cell}</td>`).join('')}</tr>
            `
              )
              .join('')}
          </tbody>
        </table>
      `
    },
    video: ({ value }) => {
      return `<iframe
        src="${value.url}"
        title="${value.title || ''}"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      ></iframe>`
    },
    latex: ({ value }) => {
      // 这里可能需要使用特定的 LaTeX 渲染库
      return `<div class="latex">${value.body}</div>`
    },
    inlineLatex: ({ value }) => {
      // 这里可能需要使用特定的 LaTeX 渲染库
      return `<span class="inline-latex">${value.body}</span>`
    },
    otherImage: ({ value }) => {
      return `<figure>
        <img src="${value.url}" alt="${value.label || ''}" />
        ${value.label ? `<figcaption>${value.label}</figcaption>` : ''}
      </figure>`
    },
  },
}

export const revalidate = 60 * 60 // 1 hour

export async function GET() {
  const feed = new RSS({
    title: seo.title,
    description: seo.description,
    site_url: seo.url.href,
    feed_url: `${seo.url.href}feed.xml`,
    language: 'zh-CN',
    image_url: `${seo.url.href}opengraph-image.png`,
    generator: 'PHP 9.0',
  })

  const data = await getLatestBlogPostsWithBody({ limit: 999 })
  if (!data) {
    return new Response('Not found', { status: 404 })
  }

  // 在您的 RSS feed 生成代码中
  data.forEach((post) => {
    const htmlContent = toHTML(post.body, {
      components: myPortableTextComponents,
    })

    const content = '<![CDATA[' + `<div>${htmlContent}</div>` + ']]>'

    feed.item({
      title: post.title,
      description: post.description, // 纯文本摘要
      url: `${seo.url.href}blog/${post.slug}`,
      guid: `${seo.url.href}blog/${post.slug}`, // 使用永久链接作为 guid
      date: new Date(post.publishedAt),
      enclosure: {
        url: post.mainImage.asset.url,
      },
      custom_elements: [{ 'content:encoded': content }],
    })
  })

  return new Response(feed.xml(), {
    headers: {
      'content-type': 'application/xml',
    },
  })
}
