'use client'

import { CursorClickIcon, UsersIcon } from '~/assets'
import { prettifyNumber } from '~/lib/math'
import { useVisit } from '~/lib/visit'

export function VisitorStats() {
  const { data } = useVisit()
  const visitor = data?.lastVisitor
  return (
    <div className="flex min-h-4 flex-col items-center justify-start gap-2 text-xs text-zinc-500 dark:text-zinc-400 sm:flex-row">
      <span className="flex items-center gap-1">
        <UsersIcon className="h-4 w-4" />
        总浏览量&nbsp;
        <span className="font-medium" title={data?.totalViews?.toString()}>
          {data ? prettifyNumber(data.totalViews, true) : '—'}
        </span>
      </span>
      {visitor && (
        <span className="flex items-center gap-1">
          <CursorClickIcon className="h-4 w-4" />
          最近访客来自&nbsp;
          {[visitor.city, visitor.country].filter(Boolean).join(', ')}
          <span>{visitor.flag}</span>
        </span>
      )}
    </div>
  )
}
