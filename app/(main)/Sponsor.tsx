'use client'
import { Coffee, MessageCircle, Wallet } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

import { ElegantPopover } from '~/components/ui/Popover'

export type SponsorLink = {
  key: string
  label: string
  cta: string
  src: string
  Icon: React.ElementType
  hoverClass: string
}

export const SPONSOR_LINKS: SponsorLink[] = [
  {
    key: 'bmc',
    label: 'Buy Me a Coffee',
    cta: '扫码请我喝咖啡 ☕️',
    src: '/qrcodes/bmc.jpeg',
    Icon: Coffee,
    hoverClass: 'hover:text-yellow-400',
  },
  {
    key: 'wechat',
    label: '微信支付',
    cta: '扫码请我喝咖啡 ☕️',
    src: '/qrcodes/wechatpay.jpeg',
    Icon: MessageCircle,
    hoverClass: 'hover:text-green-600 dark:hover:text-green-400',
  },
  {
    key: 'alipay',
    label: '支付宝支付',
    cta: '扫码请我喝咖啡 ☕️',
    src: '/qrcodes/alipay.jpeg',
    Icon: Wallet,
    hoverClass: 'hover:text-blue-600 dark:hover:text-blue-400',
  },
]

export function Sponsor() {
  return (
    <div className="relative rounded-2xl border border-zinc-100 p-6 transition-opacity dark:border-zinc-700/40">
      <h2 className="flex items-center justify-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
        <span className="mr-1">☕️</span>
        <span>支持一下</span>
      </h2>
      <p className="mt-2 text-center text-xs text-zinc-600 dark:text-zinc-400 md:text-sm">
        如果我的内容对你有帮助，可以请我喝杯咖啡 🫶
      </p>
      <div className="mt-6 flex items-center justify-center gap-4">
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
                  sizes="288px"
                  className="h-auto w-72 rounded"
                />
                <span className="mt-2 w-72 text-center text-xs font-medium text-zinc-700 dark:text-zinc-300">
                  {cta}
                </span>
              </div>
            }
          >
            <button
              type="button"
              aria-label={label}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-full border border-zinc-200 bg-white text-zinc-500 transition hover:scale-110 dark:border-zinc-700/60 dark:bg-zinc-800/40 dark:text-zinc-400 ${hoverClass}`}
            >
              <Icon className="h-5 w-5" />
            </button>
          </ElegantPopover>
        ))}
      </div>
    </div>
  )
}
