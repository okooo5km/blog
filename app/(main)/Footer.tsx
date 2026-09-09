import Link from 'next/link'
import React from 'react'

import { PeekabooLink } from '~/components/links/PeekabooLink'
import { Container } from '~/components/ui/Container'
import { navigationItems } from '~/config/nav'

import { FooterSponsorLinks } from './FooterSponsorLinks'
import { VisitorStats } from './VisitorStats'

function NavLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <Link
      href={href}
      className="transition hover:text-lime-500 dark:hover:text-lime-400"
    >
      {children}
    </Link>
  )
}

function Links() {
  return (
    <nav className="flex gap-6 text-sm font-medium text-zinc-800 dark:text-zinc-200">
      {navigationItems.map(({ href, text }) => (
        <NavLink key={href} href={href}>
          {text}
        </NavLink>
      ))}
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="mt-32">
      <Container.Outer>
        <div className="border-t border-zinc-100 pb-16 pt-10 dark:border-zinc-700/40">
          <Container.Inner>
            <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
              <p className="text-sm text-zinc-500/80 dark:text-zinc-400/80">
                &copy; {new Date().getFullYear()} • 5km •{' '}
                <strong>Fork 自</strong>
                <PeekabooLink href="https://github.com/CaliCastle/cali.so">
                  cali.so
                </PeekabooLink>
              </p>
              <Links />
            </div>
          </Container.Inner>
          <Container.Inner className="mt-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              <VisitorStats />
              <FooterSponsorLinks />
            </div>
          </Container.Inner>
        </div>
      </Container.Outer>
    </footer>
  )
}
