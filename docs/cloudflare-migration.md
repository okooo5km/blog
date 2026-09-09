# Cloudflare 迁移与性能优化

## 部署架构

Next.js 15 + OpenNext 运行在 Cloudflare Workers。静态文件由 Workers Static Assets 提供，图片使用 Cloudflare Images binding，ISR 数据存放在博客专属 R2 桶，通过 Durable Object 队列后台刷新。

保留 Sanity、Clerk、Neon、Upstash、Resend。没有执行数据库迁移、删除数据或修改其他项目。

- Worker：`5km-studio-blog`
- 测试域名：`https://5km-studio-blog.okooo5km.workers.dev`
- 正式域名：`https://5km.studio`
- 当前生产版本：`1027b270-be6d-45c6-ac94-705537256e48`
- R2：`5km-studio-blog-cache`
- Durable Object：`DOQueueHandler`，绑定 `NEXT_CACHE_DO_QUEUE`

## 已识别并修复的问题

1. 中间件等待 Redis 写入访客位置，增加所有页面的请求延迟。统计改为客户端访问后调用独立 API。
2. 页面渲染过程累加浏览量，与 ISR、预取及构建行为冲突。SSR 只读取缓存统计，浏览器访问独立计数，同一浏览会话中的同一路径复用查询结果。
3. 文章页串行访问 Redis，并经正式域名请求自己的 reactions API。改为缓存的批量读取。
4. Sanity 查询内插入实时毫秒时间戳，每次产生不同缓存键。改为稳定 GROQ `now()` 和显式 300 秒缓存。
5. 首页照片依赖 JavaScript 计算宽度，初始宽度为零，并直接下载原图。改为服务端可渲染的 CSS 布局与响应式图片。
6. 文章封面和正文图片绕过图片优化；正文图片全部标记高优先级。封面优先加载，正文按尺寸懒加载，放大时仍可查看原图。
7. 每张文章卡片额外下载原图作为背景。背景改用已有 LQIP。
8. 文章页引入 Sanity UI 和公式编辑器，首屏 JS 达 2.22 MB。公共渲染改用独立 KaTeX，公式与代码块按需分包，高亮按语言异步加载。
9. 博客列表一次渲染 100 篇，HTML 约 1.2 MB。改为每页 12 篇，使用可收录的分页链接，原文章 URL 与 sitemap 保持可用。
10. Neon WebSocket 连接池改为 HTTP 驱动，避免 Worker 跨请求连接生命周期问题。
11. Sanity Studio 的配置和编辑器整体移到仅浏览器加载的组件，减少 Worker 服务端代码。

## 本地与发布

```sh
pnpm install --frozen-lockfile
pnpm dev                    # Next.js 本地开发，读取 .env
pnpm lint
pnpm exec tsc --noEmit
pnpm preview                # 构建并在真实 workerd 运行时本地预览
pnpm smoke:deployment http://localhost:8787
pnpm deploy                 # 构建、填充 R2 缓存并部署
pnpm smoke:deployment https://5km.studio
```

Wrangler 使用已有的 Cloudflare 登录。环境变量参照 `.env.example`；生产凭据存放在 Worker Secrets，不能提交 `.env`、`.dev.vars` 或密钥。`APP_ENV=production` 开启真实浏览统计与正式邮件链接；预览设为 `preview`，不累加浏览量。保留 `VERCEL_ENV` 兼容回退。

`next dev` 读取 `.env`；workerd 本地预览需要私有 `.dev.vars`，包含同样的服务凭据以及 `NEXTJS_ENV=production`、`APP_ENV=preview`。Cloudflare 上的 Secret 与本地文件不会自动同步；更新凭据时使用 `pnpm wrangler secret put NAME`。

构建需要所有 `NEXT_PUBLIC_*` 配置和现有服务环境变量。若以后配置 Cloudflare Workers Builds，须把构建环境变量单独添加到 Builds，运行时 Secrets 不会自动成为构建环境变量。构建命令为 `pnpm build:cloudflare`，部署命令为 `pnpm exec opennextjs-cloudflare deploy`。

## 缓存行为

- 首页、列表、文章：ISR 60 秒，后台刷新。
- Sanity 数据：缓存 300 秒，因此 CMS 更新约数分钟可见；无需每次编辑重新部署。
- 统计快照：缓存 60 秒；当前文章访问量在客户端请求后更新。
- 静态哈希资源：一年 immutable。
- 登录、管理后台及个性化 API 不配置公共强制缓存。

## 回滚记录

迁移前 `5km.studio` 为代理 CNAME，目标 `vercel.cdn.yt-blog.top`，TTL Auto。`blog.5km.studio` 是独立 Netlify 旧博客，保持不变；邮件 MX/TXT 与 `n8n` 均不属于迁移范围。

正式切换前先验证 workers.dev。切换后优先使用 `pnpm wrangler rollback` 回到已知正常的 Worker 版本。若需回 Vercel，应解除本博客自定义域名，再恢复上述根域名 CNAME；保留 Vercel 项目作为迁移回退，避免直接删除。

## 调研依据

- [OpenNext 迁移步骤](https://opennext.js.org/cloudflare/get-started)
- [OpenNext ISR 与 Durable Object 队列](https://opennext.js.org/cloudflare/caching)
- [Cloudflare Next.js 部署路径](https://developers.cloudflare.com/workers/framework-guides/web-apps/nextjs/)
- [Clerk 静态与动态渲染](https://clerk.com/docs/guides/development/rendering-modes)
- [Cloudflare 自定义域名](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/)

Cloudflare 当前默认推荐 vinext，但其仍为 beta，且面向 Next.js 16；本项目保留 Next.js 15，使用兼容的 OpenNext，降低迁移变量。

## 验证记录

迁移前同一测试端各取三次请求，详见 `cloudflare-performance-before.json`。这些是单一网络位置的观测，不代表全球用户的 Core Web Vitals。

普通 `pnpm dev --port 3015` 启动并返回首页 HTTP 200，本地临时服务已关闭。本地 workerd 和 workers.dev 的 smoke checks 均通过，包括页面、图片、分页、RSS、sitemap、Neon 留言读取、匿名鉴权及非法统计请求拒绝。Next.js 流式 not-found 在响应头已经发送时可能返回 HTTP 200，但必须包含 noindex 且不包含文章内容，测试显式覆盖这一行为。

Cloudflare tail 单次已缓存首页观测：CPU 15 ms、Worker wall time 201 ms，无异常；客户端总首字节时间仍包含本地网络与 TLS。

Wrangler 设置 `keep_names=false` 修复 next-themes / react-wrap-balancer 的内联脚本 `__name` 异常。

正式域名已于北京时间 2026-09-09 深夜切换完成，DNS 控制台显示 `5km.studio → Worker: 5km-studio-blog`。原 Vercel CNAME 已移除，临时过渡 Worker route 已清理。其余 13 条记录逐项核对保持不变，包含旧博客、n8n 和邮件记录。

正式域名 smoke checks 全部通过。浏览器验证了首页、文章代码块、表格、KaTeX 公式、主题切换、Clerk 登录弹窗，以及 Sanity Studio 登录入口。未创建评论、订阅或发送邮件；未替用户完成第三方 OAuth 登录，因此未声称完整验证登录后编辑或真实邮件投递。

| 指标 | 迁移前 | 迁移后 |
| --- | ---: | ---: |
| 文章页首屏 JavaScript（Next 构建报告） | 2.22 MB | 420 kB |
| 博客列表 HTML（未压缩，中位数） | 1,196,746 B | 300,714 B |
| 首页 TTFB（3 次中位数） | 3.914 s | 2.707 s |
| 列表 TTFB（3 次中位数） | 2.774 s | 2.449 s |
| 示例文章 TTFB（3 次中位数） | 2.185 s | 2.936 s |

原始对照数据保存在 `cloudflare-performance-before.json` 和 `cloudflare-performance-after.json`。列表 HTML 下降约 75%，文章首屏 JS 下降约 81%。文章 TTFB 在本轮采样中反而较慢，不能宣称所有页面网络耗时都改善；样本量小、请求经过不同 Cloudflare 节点，仍存在网络抖动。文章 HTML 略增源于代码块现在出现在服务端 HTML 中，而非等待浏览器加载后才显示。

正式响应包含 `x-opennext: 1`、`x-nextjs-cache: HIT/STALE`，不再依赖 Vercel 回源。后台刷新队列已产生更新后的缓存响应。未人为把鉴权/API 响应设置为公开缓存。

当前通过本地 CLI 发布；**尚未接入 Cloudflare Workers Builds 的 Git 自动发布**。后续可以直接使用 `pnpm deploy`，不需要 Vercel。代码改动保留在 `codex/cloudflare-migration` 分支工作区，未自动提交或推送。
