'use client'

import { SignedIn, SignedOut, SignInButton } from '@clerk/nextjs'
import { usePathname } from 'next/navigation'
import React from 'react'

import { UserArrowLeftIcon } from '~/assets'
import { ClientOnly } from '~/components/ClientOnly'
import { Button } from '~/components/ui/Button'
import { type GuestbookDto } from '~/db/dto/guestbook.dto'

import { GuestbookFeeds } from './GuestbookFeeds'
import { GuestbookInput } from './GuestbookInput'

export function Guestbook(props: { messages?: GuestbookDto[] }) {
  const pathname = usePathname()

  return (
    <section className="max-w-2xl">
      <ClientOnly><SignedOut>
        <SignInButton mode="modal" forceRedirectUrl={pathname}>
          <Button type="button">
            <UserArrowLeftIcon className="mr-1 h-5 w-5" />
            登录后才可以留言噢
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <GuestbookInput />
      </SignedIn></ClientOnly>

      <GuestbookFeeds messages={props.messages} />
    </section>
  )
}
