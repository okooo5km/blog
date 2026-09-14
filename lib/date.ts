import dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)

export function getDate(timezone = 'Asia/Shanghai'): dayjs.Dayjs {
  return dayjs().tz(timezone)
}

// Keep SSR, browsers and crawlers on the same publication date.
export function formatPostDate(value: string): string {
  return dayjs(value).tz('Asia/Shanghai').format('YYYY/MM/DD')
}
