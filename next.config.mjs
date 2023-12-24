import { get } from '@vercel/edge-config'

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

const redirects = [
  {
    source: '/twitter',
    destination: 'https://twitter.com/okooo5km',
    permanent: true,
  },
  {
    source: '/github',
    destination: 'https://github.com/okooo5km',
    permanent: false,
  },
  {
    source: '/bilibili',
    destination: 'https://space.bilibili.com/376027669',
    permanent: true,
  },
  {
    source: '/tg',
    destination: 'https://t.me/okooo5km',
    permanent: true,
  },
  {
    source: '/youtube',
    destination: 'https://www.youtube.com/@okooo5km',
    permanent: true,
  },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },

  images: {
    domains: ['cdn.sanity.io'],
  },

  redirects() {
    return redirects
  },

  rewrites() {
    return [
      {
        source: '/feed',
        destination: '/feed.xml',
      },
      {
        source: '/rss',
        destination: '/feed.xml',
      },
      {
        source: '/rss.xml',
        destination: '/feed.xml',
      },
    ]
  },
}

console.log('config: ', nextConfig)

export default nextConfig
