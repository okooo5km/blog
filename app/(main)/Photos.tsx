import Image from 'next/image'
import type { CSSProperties } from 'react'

export function Photos({ photos }: { photos: string[] }) {
  if (!photos.length) return null
  return (
    <div className="mt-16 sm:mt-20">
      <div className="-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0">
        {photos.map((image, idx) => (
          <div
            key={image}
            style={
              {
                '--photo-width': `${Math.min(100 / photos.length, 40)}vw`,
              } as CSSProperties
            }
            className={`relative h-40 w-[calc(50vw-4rem)] flex-none snap-start overflow-hidden rounded-xl bg-zinc-100 ring-2 ring-lime-800/20 transition-transform duration-200 hover:scale-105 motion-reduce:transition-none dark:bg-zinc-800 dark:ring-lime-300/10 md:h-72 md:w-[calc(var(--photo-width)-1.5rem)] md:rounded-3xl ${idx % 2 === 0 ? 'rotate-2' : '-rotate-2'}`}
          >
            <Image
              src={image}
              alt=""
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              priority={idx < 2}
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
