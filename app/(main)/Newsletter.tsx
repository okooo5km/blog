'use client'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'
import { useReward } from 'react-rewards'

import { TiltedSendIcon } from '~/assets'
import { Button } from '~/components/ui/Button'

export function Newsletter() {
  const [isQRCodeVisible, setIsQRCodeVisible] = React.useState(false)
  const { reward } = useReward('newsletter-rewards', 'emoji', {
    position: 'absolute',
    emoji: ['🤓', '😊', '🥳', '🤩', '🤪', '🤯', '🥰', '😎', '🤑', '🤗', '😇'],
    elementCount: 32,
  })

  const handleShowQRCode = React.useCallback(() => {
    setIsQRCodeVisible(true)
    reward()
  }, [reward])

  return (
    <div className="relative rounded-2xl border border-zinc-100 p-6 transition-opacity dark:border-zinc-700/40">
      <h2 className="flex items-center justify-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <TiltedSendIcon className="h-5 w-5 flex-none" />
        <span className="ml-2">微信公众号</span>
      </h2>
      <p className="mt-2 text-center text-xs text-zinc-600 dark:text-zinc-400 md:text-sm">
        <span>喜欢我的内容的话不妨关注公众号获取最新动态 🫶</span>
      </p>
      <AnimatePresence mode="wait">
        {!isQRCodeVisible ? (
          <motion.div
            className="mt-6 flex h-10 justify-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit="initial"
          >
            <Button onClick={handleShowQRCode} className="flex-none">
              查看二维码
            </Button>
          </motion.div>
        ) : (
          <motion.div
            className="mt-6 flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit="initial"
          >
            <div className="relative h-48 w-48 overflow-hidden rounded-lg">
              <Image
                src="/wechat-qrcode.jpg"
                alt="微信公众号二维码"
                fill
                className="object-contain"
              />
            </div>
            <p className="mt-3 text-center text-sm text-zinc-600 dark:text-zinc-400">
              扫描上方二维码关注公众号
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <span id="newsletter-rewards" className="relative h-0 w-0" />
    </div>
  )
}
