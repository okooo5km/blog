import { Card } from '@sanity/ui'
import { type PreviewProps } from 'sanity'
import { Star, StarHalf } from 'lucide-react'

type ProductProps = PreviewProps & {
  image: any
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

  const rating = props.rating || 4.5

  return (
    <Card className="flex flex-col items-center justify-center space-y-4 rounded-lg bg-white p-4 text-black shadow-md dark:bg-gray-900 dark:text-white">
      <Card className="overflow-hidden rounded-lg shadow-lg">
        <img
          src={imageUrl}
          alt={props.title}
          className="h-48 w-full object-cover"
        />
      </Card>
      <div className="flex flex-row items-center justify-between">
        <div className="text-xl font-bold">{props.title}</div>
        <div className="flex items-center">
          {[...Array(5)].map((_, i) => {
            const isHalf = rating - i >= 0.5 && rating - i < 1
            return (
              <span key={i}>
                {i < Math.floor(rating) ? (
                  <Star className="h-5 w-5 fill-current text-yellow-400" />
                ) : isHalf ? (
                  <StarHalf className="h-5 w-5 fill-current text-yellow-400" />
                ) : (
                  <Star className="h-5 w-5 fill-current text-gray-300" />
                )}
              </span>
            )
          })}
        </div>
      </div>
      <p className="text-center text-sm text-gray-500 dark:text-gray-300">
        {props.description}
      </p>
      <a
        href={props.link}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full"
      >
        <button className="w-full rounded-lg px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2  dark:text-white dark:hover:bg-gray-200">
          {props.actionTitle}
        </button>
      </a>
    </Card>
  )
}
