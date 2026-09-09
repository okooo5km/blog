'use client'

import { type PortableTextComponentProps } from '@portabletext/react'

import { Latex } from '~/components/Latex'

export function PortableTextInlineLatex({
  value,
}: PortableTextComponentProps<{
  _key: string
  _type: string
  body?: string
}>) {
  return <Latex body={value.body ?? ''} />
}
