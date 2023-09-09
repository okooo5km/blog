export const emailConfig = {
  from: '5km@smslit.cn',
  baseUrl:
    process.env.VERCEL_ENV === 'production'
      ? `https://5km.studio`
      : 'http://localhost:3000',
}
