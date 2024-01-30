/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import highlight1 from '~/assets/highlights/highlight1.webp'
import highlight2 from '~/assets/highlights/highlight2.webp'
import highlight3 from '~/assets/highlights/highlight3.webp'
import highlight4 from '~/assets/highlights/highlight4.webp'
import highlight5 from '~/assets/highlights/highlight5.webp'
import highlight6 from '~/assets/highlights/highlight6.webp'

const alts = [
  '大学说走就走的骑行之旅',
  'INFJ 人格类型的我',
  '个人能力一览',
  '教育经历非常普通',
  '工作经历也很一般',
  '正式独立开发的第一款产品：Zipic',
]

const images = [
  highlight1,
  highlight2,
  highlight3,
  highlight4,
  highlight5,
  highlight6,
]

export function Photos() {
  const [width, setWidth] = React.useState(0)
  const [isCompact, setIsCompact] = React.useState(false)
  const expandedWidth = React.useMemo(() => width * 1.38, [width])

  React.useEffect(() => {
    const handleResize = () => {
      // 640px is the breakpoint for md
      if (window.innerWidth < 640) {
        setIsCompact(true)
        return setWidth(window.innerWidth / 2 - 64)
      }

      setWidth(window.innerWidth / images.length - 4 * images.length)
    }

    window.addEventListener('resize', handleResize)
    handleResize()

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <motion.div
      className="mt-16 sm:mt-20"
      initial={{ opacity: 0, scale: 0.925, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        delay: 0.5,
        type: 'spring',
      }}
    >
      <div className="-my-4 flex w-full snap-x snap-proximity scroll-pl-4 justify-start gap-4 overflow-x-auto px-4 py-4 sm:gap-6 md:justify-center md:overflow-x-hidden md:px-0">
        {images.map((image, idx) => (
          <motion.div
            key={image.src}
            className="relative h-40 flex-none shrink-0 snap-start overflow-hidden rounded-xl bg-zinc-100 ring-2 ring-lime-800/20 dark:bg-zinc-800 dark:ring-lime-300/10 md:h-72 md:rounded-3xl"
            animate={{
              width,
              opacity: isCompact ? 1.0 : 0.9,
              filter: isCompact ? 'grayscale(0)' : 'grayscale(0.15)',
              rotate: idx % 2 === 0 ? 2 : -1,
            }}
            whileHover={
              isCompact
                ? {}
                : {
                    width: expandedWidth,
                    opacity: 1,
                    filter: 'grayscale(0)',
                  }
            }
            layout
          >
            <Image
              src={image}
              alt={alts[idx] ?? ''}
              quality={80}
              className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
