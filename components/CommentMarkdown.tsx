'use client'

import * as React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { AtMention } from '~/components/AtMention'
import { RichLink } from '~/components/links/RichLink'

export function CommentMarkdown({ children }: { children: string }) {
  // 更智能的 @ 提及处理：只处理不在 Markdown 链接中的 @ 提及
  const processedText = children.replace(
    // 负向前瞻：确保 @ 前面不是 ]( 或 ](
    // 负向后瞻：确保 @ 后面匹配的用户名后不是 ](
    /(?<!\]\(.*?)@([^\s\]]+)(?!\]\()/g,
    (match, username) => {
      // 额外检查：如果这个 @ 在方括号内，说明可能是 Markdown 链接的一部分
      const beforeAt = children.substring(0, children.indexOf(match))
      const openBrackets = (beforeAt.match(/\[/g) || []).length
      const closeBrackets = (beforeAt.match(/\]/g) || []).length
      
      // 如果方括号不匹配，说明我们在一个未关闭的方括号内，跳过
      if (openBrackets > closeBrackets) {
        return match
      }
      
      return `[@${username}](mention:${username})`
    }
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
