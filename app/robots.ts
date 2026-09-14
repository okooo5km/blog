import { type MetadataRoute } from 'next'

import { seo } from '~/lib/seo'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/', '/studio/'],
    },
    sitemap: new URL('/sitemap.xml', seo.url).href,
  }
}
