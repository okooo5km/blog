'use client'

import dynamic from 'next/dynamic'

// Load the CMS and its schema only in the editor's browser, not in the Worker.
const StudioClient = dynamic(() => import('./StudioClient'), { ssr: false })

export default function Studio() {
  return <StudioClient />
}
