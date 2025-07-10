'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { AtMention } from '~/components/AtMention'
import { RichLink } from '~/components/links/RichLink'

export function CommentMarkdown({ children }: { children: string }) {
  // 预处理文本，将 @提及 转换为特殊的链接格式
  const processedText = children.replace(
    /@([^\s]+)/g,
    '[@$1](mention:$1)'
  )
  
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        a: ({ children, href }) => {
          // 处理 @提及 链接
          if (href?.startsWith('mention:')) {
            return <AtMention>{children}</AtMention>
          }
          
          const rel = !href?.startsWith('/') ? 'noreferrer noopener' : undefined
          return (
            <RichLink
              href={href ?? ''}
              rel={rel}
              className="font-bold text-zinc-800 hover:underline dark:text-zinc-100"
            >
              {children}
            </RichLink>
          )
        },
      }}
    >
      {processedText}
    </ReactMarkdown>
  )
}
