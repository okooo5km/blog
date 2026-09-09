import { env } from '~/env.mjs'

export const emailConfig = {
  from: env.NEXT_PUBLIC_SITE_EMAIL_FROM,
  baseUrl:
    env.APP_ENV === 'production'
      ? env.NEXT_PUBLIC_SITE_URL
      : 'http://localhost:3000',
}
