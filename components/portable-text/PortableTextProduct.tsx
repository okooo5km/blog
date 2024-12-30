/* eslint-disable @next/next/no-img-element */
'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import * as Dialog from '@radix-ui/react-dialog'
import { Card } from '@sanity/ui'
import { clsxm } from '@zolplay/utils'
import { AnimatePresence, motion } from 'framer-motion'
import { Star } from 'lucide-react'
import React from 'react'

import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'

export function PortableTextProduct({
  value,
}: PortableTextComponentProps<{
  _key: string
  image: {
    _type: string
    asset: {
      _ref: string
      _type: string
    }
  }
  link: string | undefined
  title: string
  description: string
  discount: string
  rating: number
  actionTitle: string
}>) {
  const [isZoomed, setIsZoomed] = React.useState(false)

  const imageRef = value.image?.asset?._ref
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const imageData = imageRef ? imageRef.split('-') : []
  const imageUrl = imageRef
    ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageData[1]}-${imageData[2]}.${imageData[3]}`
    : ''

  const rating = value.rating || 4.5

  if (!value.link) {
    return <Card padding={4}>Missing Image URL</Card>
  }

  return (
    <div className="group relative mx-auto max-w-sm pr-3 md:pr-0">
      <ClientOnly>
        <Commentable className="z-30" blockId={value._key} />
      </ClientOnly>

      <Dialog.Root open={isZoomed} onOpenChange={setIsZoomed}>
        <AnimatePresence>
          {!isZoomed && (
            <motion.div
              className="flex flex-col gap-2"
              layoutId={`image_${value._key}`}
            >
              <div
                className={clsxm(
                  'rounded-2xl border border-zinc-400/20 bg-zinc-100 p-4 dark:border-zinc-700/50 dark:bg-zinc-800'
                )}
              >
                <Dialog.Trigger>
                  {/* 图片部分 */}
                  <img
                    src={imageUrl}
                    className={clsxm(
                      'relative z-20 cursor-zoom-in dark:brightness-75 dark:transition-[filter] dark:hover:brightness-100',
                      'rounded-lg'
                    )}
                    alt={value.title}
                  />
                </Dialog.Trigger>

                {/* 标题和星级评分在同一行 */}
                <div className="mt-4 flex flex-row items-center justify-between">
                  <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
                    {value.title}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => {
                      const isHalf = rating - i > 0 && rating - i < 1
                      const isFull = rating - i >= 1
                      return isFull ? (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ) : isHalf ? (
                        <div key={i} className="relative">
                          <Star className="h-4 w-4 text-yellow-400" />
                          <div className="absolute inset-0 w-[50%] overflow-hidden">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          </div>
                        </div>
                      ) : (
                        <Star key={i} className="h-4 w-4 text-yellow-400" />
                      )
                    })}
                  </div>
                </div>

                {/* 描述文字 */}
                <p className="mt-4 text-sm text-zinc-600 dark:text-zinc-400">
                  {value.description}
                </p>

                {/* 按钮 */}
                <a href={value.link} target="_blank" className="block">
                  <button className="mt-4 w-full rounded-full bg-zinc-900 py-2 text-sm text-zinc-100 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200">
                    查看详情
                  </button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isZoomed && (
            <Dialog.Portal forceMount>
              <Dialog.Close className="fixed inset-0 z-50 flex h-screen w-screen cursor-zoom-out items-center justify-center">
                {/* Overlay */}
                <Dialog.Overlay asChild>
                  <motion.div
                    className="absolute inset-0 bg-black/50"
                    initial={{ opacity: 0, backdropFilter: 'blur(0)' }}
                    animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                    exit={{ opacity: 0, backdropFilter: 'blur(0)' }}
                  />
                </Dialog.Overlay>

                <Dialog.Content className="w-full overflow-hidden">
                  <div className="relative flex aspect-[3/2] items-center justify-center">
                    <div className="relative flex aspect-[3/2] w-full max-w-7xl items-center">
                      <motion.div
                        layoutId={`image_${value._key}`}
                        className="absolute inset-0"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                          duration: 0.5,
                        }}
                      >
                        <img
                          src={imageUrl}
                          className="mx-auto h-full overflow-hidden object-contain"
                          alt={value.title}
                        />
                      </motion.div>
                    </div>
                  </div>
                </Dialog.Content>
              </Dialog.Close>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>
    </div>
  )
}
