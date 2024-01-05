'use client'

import { type PortableTextComponentProps } from '@portabletext/react'
import { Card } from '@sanity/ui'
import React from 'react'

import { ClientOnly } from '~/components/ClientOnly'

export function PortableTextVideo({
  value,
}: PortableTextComponentProps<{
  _key: string
  url: string | undefined
  title: string
}>) {
  if (!value.url) {
    return <Card padding={4}>Missing Video URL</Card>
  }

  return (
    <ClientOnly>
      {typeof value.url === 'string' && (
        <div className="flex justify-center">
          <video className="rounded-xl md:rounded-3xl" controls>
            <source src={value.url} type="video/mp4" />
          </video>
        </div>
      )}
    </ClientOnly>
  )
}
