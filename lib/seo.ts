export const seo = {
  title: '5km • Indie Maker',
  description:
    '我叫 5km，一名独立创客，设计、开发都会一点，有亿点点细节控，兴趣比较多，喜欢折腾。目前致力于极简主义创业，希望能在互联网输送和吸收能量，持续输出优秀产品！',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://5km.studio'
      : 'http://localhost:3000'
  ),
} as const
