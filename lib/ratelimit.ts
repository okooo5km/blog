import { getCloudflareContext } from '@opennextjs/cloudflare'

type RateBinding = 'RATE_GENERAL' | 'RATE_COMMENTS' | 'RATE_NEWSLETTER' | 'RATE_ACTIVITY'

// Per-location abuse protection, not a global accounting quota.
export function createRateLimit(binding: RateBinding) {
  return {
    limit(key: string) {
      return getCloudflareContext().env[binding].limit({ key })
    },
  }
}

export const ratelimit = createRateLimit('RATE_GENERAL')
