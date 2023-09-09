export const seo = {
  title: '5km • 独立创客',
  description:
    ' 🔖 Hi，我是5km！自称独立创客，在探寻极简创业之道，致力于持续创造出优秀作品，目前专注于桌面应用开发。我对开发（软件或硬件）和设计怀有热爱🔥，喜欢创新和探索新事物，期盼与大家有深度的交流📮。',
  url: new URL(
    process.env.NODE_ENV === 'production'
      ? 'https://5km.studio'
      : 'http://localhost:3000'
  ),
} as const
