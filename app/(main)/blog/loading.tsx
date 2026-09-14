import { Container } from '~/components/ui/Container'

export default function BlogArchiveSkeleton() {
  return (
    <Container className="mt-16 sm:mt-24">
      <div role="status" aria-label="正在加载博客列表">
        <span className="sr-only">正在加载博客列表…</span>
        <div aria-hidden="true" className="motion-safe:animate-pulse">
          <div className="max-w-2xl space-y-4">
            <div className="h-12 w-4/5 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-4 w-5/6 rounded bg-zinc-200 dark:bg-zinc-800" />
            <div className="h-16" />
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-20 lg:grid-cols-2 lg:gap-8">
            {[0, 1, 2, 3].map((card) => (
              <div
                key={card}
                className="overflow-hidden rounded-3xl bg-zinc-200 dark:bg-zinc-800"
              >
                <div className="aspect-[240/135]" />
                <div className="h-24 border-t border-zinc-300/50 dark:border-zinc-700/50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </Container>
  )
}
