/* eslint-disable @next/next/no-img-element */
'use client'

import { motion } from 'framer-motion'
import React from 'react'

const alts = [
  '大学说走就走的骑行之旅：青岛-北京',
  '人生第一辆车直接买了国产的 SUV：小UNI',
  'INFJ 人格类型的我',
  '千辛万苦终于有了自己的第一套房：小甜酱',
  '九年义务恋爱画上句号新的课程开启',
  '正式独立开发的第一款产品：Zipic',
]

const images = [
  'https://pichome-1254392422.cos.ap-chengdu.myqcloud.com/uPic/highlight-biketour.webp',
  'https://pichome-1254392422.cos.ap-chengdu.myqcloud.com/uPic/highlight-infj.webp',
  'https://pichome-1254392422.cos.ap-chengdu.myqcloud.com/uPic/highlight-car.webp',
  'https://pichome-1254392422.cos.ap-chengdu.myqcloud.com/uPic/highlight-house.webp',
  'https://pichome-1254392422.cos.ap-chengdu.myqcloud.com/uPic/highlight-wedding.webp',
  'https://pichome-1254392422.cos.ap-chengdu.myqcloud.com/uPic/highlight-zipic.webp',
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
        {images.map((url, idx) => (
          <motion.div
            key={url}
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
            <img src={url} alt={alts[idx] ?? ''} className="pointer-events-none absolute inset-0 h-full w-full select-none object-cover"/>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
