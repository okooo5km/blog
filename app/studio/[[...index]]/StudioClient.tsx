'use client'

/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import config from '~/sanity.config'

const NextStudio = dynamic(
  () => import('next-sanity/studio').then((mod) => mod.NextStudio),
  { ssr: false }
)

// Suppress React DOM nesting warnings caused by Sanity Studio internals
// (@sanity/ui renders <div> inside <p> in blockquote elements)
function useSuppressSanityDOMWarnings() {
  useEffect(() => {
    const originalConsoleError = console.error
    console.error = (...args: unknown[]) => {
      const msg = typeof args[0] === 'string' ? args[0] : ''
      if (
        msg.includes('cannot contain') ||
        msg.includes('cannot be a descendant')
      ) {
        return
      }
      originalConsoleError.apply(console, args)
    }
    return () => {
      console.error = originalConsoleError
    }
  }, [])
}

export default function Studio() {
  useSuppressSanityDOMWarnings()
  return <NextStudio config={config} />
}