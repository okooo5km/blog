'use client'

import * as PopoverPrimitive from '@radix-ui/react-popover'
import { clsxm } from '@zolplay/utils'
import { AnimatePresence, motion } from 'framer-motion'
import * as React from 'react'

const { Root, Trigger, Portal, Anchor } = PopoverPrimitive

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, sideOffset = 6, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={clsxm(
      'z-50 overflow-hidden rounded-md bg-white px-3 py-1.5 text-xs font-medium text-zinc-900 ring-1 ring-zinc-900/10 transition focus:outline-none dark:bg-zinc-800 dark:text-zinc-200 dark:ring-white/10',
      className
    )}
    {...props}
  />
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export const Popover = {
  Root,
  Trigger,
  Content: PopoverContent,
  Portal,
  Anchor,
} as const

type ElegantPopoverProps = {
  children: React.ReactNode
  content: React.ReactNode
  contentClassName?: string
  side?: PopoverPrimitive.PopoverContentProps['side']
  align?: PopoverPrimitive.PopoverContentProps['align']
}

export function ElegantPopover({
  children,
  content,
  contentClassName,
  side = 'top',
  align = 'center',
}: ElegantPopoverProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>{children}</Popover.Trigger>
      <AnimatePresence>
        {open && (
          <Popover.Portal forceMount>
            <Popover.Content
              side={side}
              align={align}
              className={contentClassName}
              asChild
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                {content}
              </motion.div>
            </Popover.Content>
          </Popover.Portal>
        )}
      </AnimatePresence>
    </Popover.Root>
  )
}
