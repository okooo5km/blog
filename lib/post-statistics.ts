import { unstable_cache } from 'next/cache'

import { storage } from '~/lib/storage'

// Cache public statistics for 60 seconds to bound D1 reads.
export const getPostStatistics = unstable_cache(
  async (keys: string[]) => storage.mget<unknown[]>(...keys),
  ['post-statistics-d1-v1'],
  { revalidate: 60 }
)
