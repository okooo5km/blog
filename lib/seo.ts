export const seo = {
  title: '5km • 独立创客',
  description:
    '👋 嗨，我是十里(5km) —— 独立创客，极简创业探索者。🚀专注于数字/数码创作，致力于持续创造优秀作品。💡追求创新与卓越，乐于探索软硬结合的无限可能。🤝期待与你交流，分享创作心得，共同成长！',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://5km.studio'
      : 'http://localhost:3000'
  ),
} as const
