'use client'
import Image from 'next/image'
import React from 'react'

import { ElegantPopover } from '~/components/ui/Popover'

import { SPONSOR_LINKS } from './Sponsor'

export function FooterSponsorLinks() {
  return (
    <div className="flex items-center gap-3 text-zinc-400 dark:text-zinc-500">
      <span className="text-xs">支持一下</span>
      {SPONSOR_LINKS.map(({ key, label, cta, src, Icon, hoverClass }) => (
        <ElegantPopover
          key={key}
          contentClassName="!p-3"
          content={
            <div className="flex flex-col items-center">
              <Image
                src={src}
                alt={`${label}二维码`}
                width={750}
                height={1124}
                sizes="240px"
                className="h-auto w-60 rounded"
              />
              <span className="mt-2 w-60 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                {cta}
              </span>
            </div>
          }
        >
          <button
            type="button"
            aria-label={label}
            className={`inline-flex h-7 w-7 items-center justify-center rounded-full transition hover:scale-110 ${hoverClass}`}
          >
            <Icon className="h-4 w-4" />
          </button>
        </ElegantPopover>
      ))}
    </div>
  )
}
