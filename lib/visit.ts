'use client'

import { useQuery } from '@tanstack/react-query'
import { usePathname } from 'next/navigation'

export type VisitStats = {
  totalViews: number
  postViews?: number
  lastVisitor?: { country: string; city?: string; flag: string } | null
}

export function useVisit() {
  const pathname = usePathname()
  return useQuery<VisitStats>({
    queryKey: ['visit', pathname],
    queryFn: async () => {
      const response = await fetch('/api/visit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pathname }),
      })
      if (!response.ok) throw new Error('Visit statistics unavailable')
      return response.json()
    },
    staleTime: Infinity,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  })
}
