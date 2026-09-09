import { Resend } from 'resend'

import { env } from '~/env.mjs'

export function getResend() {
  return new Resend(env.RESEND_API_KEY)
}
