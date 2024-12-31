import { Card } from '@sanity/ui'
import { ArrowRight, Star, Tag } from 'lucide-react'
import { type PreviewProps } from 'sanity'

type ProductProps = PreviewProps & {
  image: {
    asset: {
      _ref: string
      _type: string
    }
    _type: string
  }
  link: string
  title: string
  description: string
  discount: string
  rating: number
  actionTitle: string
}

export function ProductPreview(props: ProductProps) {
  if (!props.image) {
    return <Card padding={4}>Missing Image URL</Card>
  }

  const imageRef = props.image?.asset?._ref
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET
  const imageData = imageRef ? imageRef.split('-') : []
  const imageUrl = imageRef
    ? `https://cdn.sanity.io/images/${projectId}/${dataset}/${imageData[1]}-${imageData[2]}.${imageData[3]}`
    : ''

  const rating = props.rating || 5

  return (
    <Card className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-4 text-black shadow-md dark:bg-gray-900 dark:text-white">
      <Card className="overflow-hidden rounded-lg shadow-lg">
        <img
          src={imageUrl}
          alt={props.title}
          className="h-48 w-full object-cover"
        />
      </Card>
      {/* 标题和星级评分在同一行 */}
      <div className="mt-4 flex flex-row items-center justify-between">
        <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          {props.title}
        </span>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => {
            const isHalf = rating - i > 0 && rating - i < 1
            const isFull = rating - i >= 1
            return isFull ? (
              <Star
                key={i}
                className="h-4 w-4 fill-yellow-400 text-yellow-400"
              />
            ) : isHalf ? (
              <div key={i} className="relative">
                <Star className="h-4 w-4 text-yellow-400" />
                <div className="absolute inset-0 w-[50%] overflow-hidden">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                </div>
              </div>
            ) : (
              <Star key={i} className="h-4 w-4 text-yellow-400" />
            )
          })}
        </div>
      </div>

      {/* 标签信息 */}
      {props.discount && (
        <div className="mt-1 flex items-center gap-0.5 text-xs">
          <Tag className="h-3 w-3" />
          {props.discount}
        </div>
      )}

      {props.description && (
        <p className="text-sm text-gray-500 dark:text-gray-300">
          {props.description}
        </p>
      )}
      <a
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <button className="flex w-full flex-row gap-2 rounded-lg p-2 text-sm font-medium text-black hover:bg-white dark:text-white dark:hover:bg-gray-200">
          {props.actionTitle}
          <ArrowRight className="h-4 w-4" />
        </button>
      </a>
    </Card>
  )
}
