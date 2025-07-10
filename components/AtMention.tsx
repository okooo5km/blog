import { clsxm } from '@zolplay/utils'
import React from 'react'

interface AtMentionProps {
  children: React.ReactNode
  className?: string
}

export function AtMention({ children, className }: AtMentionProps) {
  return (
    <span
      className={clsxm(
        'inline-flex items-center rounded-md bg-lime-100 px-1.5 py-0.5 text-sm font-medium text-lime-800 dark:bg-lime-900/20 dark:text-lime-400',
        className
      )}
    >
      {children}
    </span>
  )
}

// 解析消息中的 @ 提及
export function parseAtMentions(message: string): React.ReactNode[] {
  const parts: React.ReactNode[] = []
  const regex = /@([^\s]+)/g
  let lastIndex = 0
  let match
  
  while ((match = regex.exec(message)) !== null) {
    // 添加 @ 之前的文本
    if (match.index > lastIndex) {
      parts.push(message.substring(lastIndex, match.index))
    }
    
    // 添加 @ 提及
    parts.push(
      <AtMention key={match.index}>
        @{match[1]}
      </AtMention>
    )
    
    lastIndex = match.index + match[0].length
  }
  
  // 添加剩余的文本
  if (lastIndex < message.length) {
    parts.push(message.substring(lastIndex))
  }
  
  return parts.length > 0 ? parts : [message]
}