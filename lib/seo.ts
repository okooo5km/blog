export const seo = {
  title: '5km • 独立创客',
  description:
    '👋 嗨，我是十里(5km) —— 独立创客，极简创业探索者。🚀 专注于桌面应用开发，致力于持续创造优秀作品。💡 热爱软硬件开发与设计，追求创新，乐于探索。🤝 期待与你深度交流，共同成长！',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://5km.studio'
      : 'http://localhost:3000'
  ),
} as const
