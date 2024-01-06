'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import * as Dialog from '@radix-ui/react-dialog'
import { Card } from '@sanity/ui'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'

export function PortableTextVideo({
  value,
}: PortableTextComponentProps<{
  _key: string
  url: string | undefined
  title: string
}>) {
  const [isZoomed, setIsZoomed] = React.useState(false)
  if (!value.url) {
    return <Card padding={4}>Missing Video URL</Card>
  }

  return (
    <div data-blockid={value._key} className="group relative pr-3 md:pr-0">
      <ClientOnly>
        <Commentable className="z-30" blockId={value._key} />
      </ClientOnly>

      <Dialog.Root open={isZoomed} onOpenChange={setIsZoomed}>
        <AnimatePresence>
          {!isZoomed && (
            <div>
              <motion.div className="relative" layoutId={`image_${value._key}`}>
                <Dialog.Trigger>
                  <video className="rounded-xl md:rounded-3xl" controls>
                    <source src={value.url} type="video/mp4" />
                  </video>
                </Dialog.Trigger>
              </motion.div>
            </div>
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
                        <video className="rounded-xl md:rounded-3xl" controls>
                          <source src={value.url} type="video/mp4" />
                        </video>
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
