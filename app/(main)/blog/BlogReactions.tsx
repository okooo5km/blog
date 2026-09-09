'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  motion,
  type MotionValue,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'
import Image from 'next/image'
import React from 'react'

import { prettifyNumber } from '~/lib/math'
import { type Post } from '~/sanity/schemas/post'

function moodToReactions(mood: Post['mood']) {
  switch (mood) {
    case 'happy':
      return ['claps', 'tada', 'confetti', 'fire']
    case 'sad':
      return ['pray', 'cry', 'heart', 'hugs']
    default:
      return ['claps', 'heart', 'thumbs-up', 'fire']
  }
}

export function BlogReactions({
  _id,
  mood,
  reactions,
}: Pick<Post, '_id' | 'mood'> & { reactions?: number[] }) {
  const mouseY = useMotionValue(Infinity)
  const onMouseMove = React.useCallback(
    (e: React.MouseEvent) => {
      mouseY.set(e.clientY)
    },
    [mouseY]
  )
  const queryClient = useQueryClient()
  const queryKey = ['reactions', _id]
  const { data: cachedReactions = [0, 0, 0, 0] } = useQuery({
    queryKey,
    queryFn: async (): Promise<number[]> => {
      const response = await fetch(`/api/reactions?id=${encodeURIComponent(_id)}`)
      if (!response.ok) throw new Error('无法读取点赞数量')
      return JSON.parse(await response.text())
    },
    placeholderData: reactions,
    retry: false,
    refetchOnWindowFocus: false,
  })
  const mutation = useMutation({
    mutationFn: async (index: number): Promise<number[]> => {
      const response = await fetch(`/api/reactions?id=${encodeURIComponent(_id)}&index=${index}`, { method: 'PATCH' })
      if (!response.ok) throw new Error(response.status === 429 ? '操作太快，请稍后再试' : '点赞失败，请重试')
      return JSON.parse(await response.text()).data
    },
    onSuccess: data => queryClient.setQueryData(queryKey, data),
  })

  return (
    <motion.div
      className="pointer-events-auto flex w-12 flex-col items-center justify-center gap-8 rounded-3xl bg-gradient-to-b from-zinc-100/80 to-white/90 px-1 pb-8 pt-4 ring-1 ring-zinc-400/10 backdrop-blur-lg dark:from-zinc-800/80 dark:to-zinc-950/80 dark:ring-zinc-500/10"
      onMouseMove={onMouseMove}
      onMouseLeave={() => mouseY.set(Infinity)}
      initial={{
        opacity: 0,
        y: 8,
        rotateY: 90,
      }}
      animate={{
        opacity: 1,
        y: 0,
        rotateY: 0,
      }}
      transition={{
        delay: 0.5,
        duration: 0.55,
        type: 'spring',
        damping: 15,
        stiffness: 180,
      }}
    >
      {moodToReactions(mood).map((reaction, idx) => (
        <ReactIcon
          key={idx}
          y={mouseY}
          image={`/reactions/${reaction}.png`}
          count={cachedReactions[idx]}
          onClick={() => mutation.mutate(idx)}
          disabled={mutation.isPending}
        />
      ))}
      {mutation.isError && <span role="status" className="text-xs">{mutation.error.message}</span>}
    </motion.div>
  )
}

function ReactIcon({
  y,
  image,
  count = 0,
  onClick,
  disabled,
}: {
  y: MotionValue
  image: string
  count?: number
  disabled?: boolean
  onClick?: () => void
}) {
  const ref = React.useRef<HTMLButtonElement>(null)

  const distance = useTransform(y, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 }

    return val - bounds.y - bounds.height / 2
  })

  const heightSync = useTransform(distance, [-120, 0, 120], [24, 36, 24])
  const height = useSpring(heightSync, {
    mass: 0.1,
    stiffness: 180,
    damping: 15,
  })

  return (
    <motion.button
      ref={ref}
      type="button"
      style={{ height }}
      className="relative aspect-square h-8"
      whileTap={{
        scale: 1.3,
      }}
      onClick={onClick}
      disabled={disabled}
    >
      <Image
        src={image}
        alt=""
        className="inline-block"
        priority
        fetchPriority="high"
        fill
        unoptimized
      />
      <span className="absolute -bottom-6 left-0 flex w-full items-center justify-center whitespace-nowrap text-[12px] font-semibold text-zinc-700/30 dark:text-zinc-200/25">
        {prettifyNumber(count, true)}
      </span>
    </motion.button>
  )
}
