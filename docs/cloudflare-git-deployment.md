# Git 自动部署

博客使用 Cloudflare Workers Builds 连接 `okooo5km/blog`，生产分支为 `main`。其他分支不部署到生产，也未启用共享生产数据库的预览构建。

## 更新代码

完成本地开发、检查并提交后，合并到 `main` 并推送：

```bash
git switch main
git merge --ff-only <已验证分支>
git push origin main
```

Cloudflare 执行：

- 构建：`pnpm build:ci`
- 部署及线上检查：`pnpm deploy:ci`
- Node：24.14.0；pnpm：10.33.0（packageManager 字段）
- 根目录：`/`

构建失败不会替换当前 Worker。部署后的检查失败会把该次构建标为失败，但不会自动回滚已部署的代码；需查看 Cloudflare 构建日志并修复。回滚涉及数据服务时必须保留 D1 新写入，不能直接恢复旧 Neon/Redis 版本。

## 构建数据与密钥

`config/cloudflare-build.json` 仅保存浏览器可见的 NEXT_PUBLIC 配置。Cloudflare 运行时密钥继续保留在 Worker Secrets，不写入仓库，也不需要提供给构建流程。邮件客户端延迟到实际发送时创建，因此静态构建不依赖 Resend 私钥。

`scripts/cloudflare-ci.mjs` 会初始化构建机器的本地 D1，并从生产 D1 **只读**获取公开访问计数与点赞值，用于静态页面的初始显示。不会导出评论、留言、订阅者、邮件或访客位置。生产数据库的 schema 不会在每次部署中自动变更。

修改数据表时，应新增并检查 `db/d1-migrations`，先验证本地迁移，再执行 `pnpm db:migrate:remote`，最后部署兼容该 schema 的代码。

## 更新文章

在 Sanity 发布内容即可，不用推送 Git。内容缓存 300 秒、页面缓存 60 秒，过期后由访问触发后台更新。

## Vercel

`vercel.json` 设置 `git.deploymentEnabled: false`，阻止该博客在 Vercel 重复自动部署；保留已有部署与项目。

## 头像

默认博客头像使用 `assets/Portrait.webp`，来自指定的 Avatar-orange-left，512×512、28360 字节。保持首页与导航头像组件及原有右键切换行为。

参考：[Workers Builds](https://developers.cloudflare.com/workers/ci-cd/builds/)、[Vercel Git 配置](https://vercel.com/docs/project-configuration/git-configuration)。
