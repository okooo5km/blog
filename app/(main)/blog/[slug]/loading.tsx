import { Container } from '~/components/ui/Container'

export default function BlogPostPageSkeleton() {
  return (
    <Container className="mt-16 lg:mt-32">
      <div role="status" aria-label="正在加载文章" className="min-h-screen">
        <span className="sr-only">正在加载文章…</span>
        <div aria-hidden="true" className="w-full md:flex md:justify-between">
          <aside className="hidden w-[160px] shrink-0 lg:block" />
          <div className="min-w-0 max-w-2xl space-y-8 motion-safe:animate-pulse md:flex-1">
            <div className="mb-8 h-10 w-10 rounded-full bg-zinc-200 dark:bg-zinc-800 lg:hidden" />
            <div className="aspect-[240/135] w-full rounded-3xl bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-1/2 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-10 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="space-y-4">
              {[0, 1, 2, 3].map((line) => (
                <div
                  key={line}
                  className="h-4 rounded bg-zinc-200 dark:bg-zinc-800"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Container>
  )
}
