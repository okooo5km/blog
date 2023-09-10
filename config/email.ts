export const emailConfig = {
  from: 'hi@5km.studio',
  baseUrl:
    process.env.VERCEL_ENV === 'production'
      ? `https://5km.studio`
      : 'http://localhost:3000',
}
