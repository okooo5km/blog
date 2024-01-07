'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import * as Dialog from '@radix-ui/react-dialog'
import { AnimatePresence, motion } from 'framer-motion'
import React from 'react'

import { ClientOnly } from '~/components/ClientOnly'
import { Commentable } from '~/components/Commentable'

interface TableCell {
  _key: string
  _type: string
  cells: string[]
}

export function PortableTextTable({
  value,
}: PortableTextComponentProps<{
  _key: string
  _type: string
  rows: TableCell[]
}>) {
  const [head, ...rows] = value.rows
  const [isZoomed, setIsZoomed] = React.useState(false)

  return (
    <div data-blockid={value._key} className="group relative pr-3 md:pr-0">
      <ClientOnly>
        <Commentable className="z-30" blockId={value._key} />
      </ClientOnly>

      <Dialog.Root open={isZoomed} onOpenChange={setIsZoomed}>
        <AnimatePresence>
          {!isZoomed && (
            <div>
              <motion.div className="relative">
                <Dialog.Trigger className="w-full">
                  <table className="table-fixed break-words">
                    {head && head.cells.filter(Boolean).length > 0 && (
                      <thead>
                        <tr>
                          {head.cells.map((cell, index) => (
                            <th key={index}>{cell}</th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.cells.map((cell, cellIndex) => {
                            return <td key={cellIndex}>{cell}</td>
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
                        className="absolute inset-0"
                        transition={{
                          type: 'spring',
                          stiffness: 300,
                          damping: 30,
                          duration: 0.5,
                        }}
                      >
                        <table>
                          {head && head.cells.filter(Boolean).length > 0 && (
                            <thead>
                              <tr>
                                {head.cells.map((cell, index) => (
                                  <th key={index}>{cell}</th>
                                ))}
                              </tr>
                            </thead>
                          )}
                          <tbody>
                            {rows.map((row, rowIndex) => (
                              <tr key={rowIndex}>
                                {row.cells.map((cell, cellIndex) => {
                                  return <td key={cellIndex}>{cell}</td>
                                })}
                              </tr>
                            ))}
                          </tbody>
                        </table>
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
