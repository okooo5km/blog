'use client'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import React from 'react'

import { NewCommentIcon } from '~/assets'

const STORAGE_PREFIX = 'blog:hint-seen:'
const AUTO_DISMISS_MS = 6000
const COOLDOWN_MS = 14 * 24 * 60 * 60 * 1000

type Props = {
  postKey: string
}

export function ParagraphCommentsHint({ postKey }: Props) {
  const [visible, setVisible] = React.useState(false)
  const [paused, setPaused] = React.useState(false)

  const storageKey = `${STORAGE_PREFIX}${postKey}`

  React.useEffect(() => {
    if (typeof window === 'undefined') return
    const raw = window.localStorage.getItem(storageKey)
    if (!raw) {
      setVisible(true)
      return
    }
    const ts = Number(raw)
    if (!Number.isFinite(ts) || Date.now() - ts > COOLDOWN_MS) {
      setVisible(true)
    }
  }, [storageKey])

  const dismiss = React.useCallback(() => {
    window.localStorage.setItem(storageKey, String(Date.now()))
    setVisible(false)
  }, [storageKey])

  React.useEffect(() => {
    if (!visible || paused) return
    const timer = window.setTimeout(dismiss, AUTO_DISMISS_MS)
    return () => window.clearTimeout(timer)
  }, [visible, paused, dismiss])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          className="mt-6 flex items-center gap-2 rounded-lg border border-lime-300/60 bg-lime-100/70 px-3 py-2 text-xs text-lime-900 dark:border-lime-500/30 dark:bg-lime-900/25 dark:text-lime-100"
        >
          <NewCommentIcon className="h-3.5 w-3.5 flex-none" />
          <span className="flex-1">
            这里支持段落级评论 — 桌面端悬停段落、移动端点击段落，都会出现
            <NewCommentIcon className="mx-1 inline-block h-3.5 w-3.5 align-text-bottom" />
            气泡
          </span>
          <button
            type="button"
            onClick={dismiss}
            aria-label="关闭提示"
            className="flex h-5 w-5 flex-none items-center justify-center rounded-full transition hover:bg-lime-200/70 dark:hover:bg-lime-800/40"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
