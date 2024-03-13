/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import('./env.mjs'))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.sanity.io',
        port: '',
        pathname: `/images/${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}/**`,
      },
    ],
  },

  redirects() {
    return [
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

export default nextConfig
