import React from 'react'

import { BlogPosts } from '~/app/(main)/blog/BlogPosts'
import { Headline } from '~/app/(main)/Headline'
import { Newsletter } from '~/app/(main)/Newsletter'
import { Photos } from '~/app/(main)/Photos'
import { Resume } from '~/app/(main)/Resume'
import { PencilSwooshIcon } from '~/assets'
import { NavigationLink } from '~/components/links/NavigationLink'
import { Container } from '~/components/ui/Container'
import { getSettings } from '~/sanity/queries'

export const metadata = { alternates: { canonical: '/' } }

export default async function BlogHomePage() {
  const settings = await getSettings()

  return (
    <>
      <Container className="mt-10">
        <Headline />
      </Container>

      {settings?.heroPhotos && <Photos photos={settings.heroPhotos} />}

      <Container className="mt-24 md:mt-28">
        <div className="mx-auto grid max-w-xl grid-cols-1 gap-y-20 lg:max-w-none lg:grid-cols-2">
          <div className="flex flex-col gap-6 pt-6">
            <h2 className="flex items-center text-sm font-semibold text-zinc-900 dark:text-zinc-100">
              <PencilSwooshIcon className="h-5 w-5 flex-none" />
              <span className="ml-2">近期文章</span>
            </h2>
            <BlogPosts />
            <NavigationLink
              href="/blog"
              className="group inline-flex min-h-11 items-center gap-1 self-end rounded-lg px-2 text-sm font-medium text-zinc-600 transition-colors hover:text-lime-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-lime-600 dark:text-zinc-400 dark:hover:text-lime-400"
            >
              更多文章
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-1 motion-reduce:transform-none"
              >
                →
              </span>
            </NavigationLink>
          </div>
          <aside className="space-y-10 lg:sticky lg:top-8 lg:h-fit lg:pl-16 xl:pl-20">
            <Newsletter />
            {settings?.resume && <Resume resume={settings.resume} />}
          </aside>
        </div>
      </Container>
    </>
  )
}

export const revalidate = 60
