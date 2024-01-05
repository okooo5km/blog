import { Card } from '@sanity/ui'
import { type PreviewProps } from 'sanity'

type TweetProps = PreviewProps & {
  url: string | undefined
}

export function VideoPreview(props: TweetProps) {
  if (!props.url) {
    return <Card padding={4}>Missing Video URL</Card>
  }

  return (
    <Card>
      <video controls>
        <source src={props.url} type="video/mp4" />
      </video>
    </Card>
  )
}
