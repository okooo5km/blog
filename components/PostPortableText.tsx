'use client'

import { PortableText, type PortableTextComponents } from '@portabletext/react'
import dynamic from 'next/dynamic'
import React from 'react'

import { PeekabooLink } from '~/components/links/PeekabooLink'
import {
  PortableTextBlocksBlockquote,
  PortableTextBlocksH1,
  PortableTextBlocksH2,
  PortableTextBlocksH3,
  PortableTextBlocksH4,
  PortableTextBlocksListItem,
  PortableTextBlocksNormal,
} from '~/components/portable-text/PortableTextBlocks'
import { PortableTextImage } from '~/components/portable-text/PortableTextImage'
import { PortableTextOtherImage } from '~/components/portable-text/PortableTextOtherImage'
import { PortableTextProduct } from '~/components/portable-text/PortableTextProduct'
import { PortableTextTable } from '~/components/portable-text/PortableTextTable'
import { PortableTextTweet } from '~/components/portable-text/PortableTextTweet'
import { PortableTextVideo } from '~/components/portable-text/PortableTextVideo'

const PortableTextCodeBlock = dynamic(() =>
  import('./portable-text/PortableTextCodeBlock').then(
    (module) => module.PortableTextCodeBlock
  )
)

const PortableTextLatex = dynamic(() =>
  import('./portable-text/PortableTextLatex').then(
    (module) => module.PortableTextLatex
  )
)

const PortableTextInlineLatex = dynamic(() =>
  import('./portable-text/PortableTextInlineLatex').then(
    (module) => module.PortableTextInlineLatex
  )
)

const components: PortableTextComponents = {
  block: {
    normal: PortableTextBlocksNormal,
    h1: PortableTextBlocksH1,
    h2: PortableTextBlocksH2,
    h3: PortableTextBlocksH3,
    h4: PortableTextBlocksH4,
    blockquote: PortableTextBlocksBlockquote,
  },
  listItem: PortableTextBlocksListItem,
  types: {
    image: PortableTextImage,
    tweet: PortableTextTweet,
    codeBlock: PortableTextCodeBlock,
    table: PortableTextTable,
    video: PortableTextVideo,
    latex: PortableTextLatex,
    inlineLatex: PortableTextInlineLatex,
    otherImage: PortableTextOtherImage,
    product: PortableTextProduct,
  },

  marks: {
    link: ({ children, value }) => {
      const rel = !value.href.startsWith('/')
        ? 'noreferrer noopener'
        : undefined
      return (
        <PeekabooLink href={value.href} rel={rel}>
          {children}
        </PeekabooLink>
      )
    },
  },
}

export function PostPortableText(props: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
  components?: PortableTextComponents
}) {
  return (
    <PortableText
      value={props.value}
      components={props.components ?? components}
    />
  )
}
