'use client'

import Link, { useLinkStatus } from 'next/link'
import { type ComponentProps } from 'react'
import { createPortal } from 'react-dom'

function NavigationProgress() {
  const { pending } = useLinkStatus()

  if (!pending) return null

  // The portal keeps the indicator outside transformed cards and mobile menus.
  return createPortal(
    <div
      role="status"
      aria-label="正在打开页面"
      className="pointer-events-none fixed inset-x-0 top-0 z-[100] h-1 bg-lime-500/20"
    >
      <span className="block h-full w-1/3 bg-lime-600 motion-safe:animate-pulse dark:bg-lime-400" />
      <span className="sr-only">正在打开页面…</span>
    </div>,
    document.body
  )
}

export function NavigationLink({
  children,
  ...props
}: ComponentProps<typeof Link>) {
  return (
    <Link {...props}>
      {children}
      <NavigationProgress />
    </Link>
  )
}
