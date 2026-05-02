# Bloom Timer — Pour Over Coffee Recipes & Timer

## Overview
精确的手冲咖啡计时器 + 12 个世界冠军级配方 + 7 款冲煮器具页 + 比例换算计算器 + Sanity 驱动的 Journal 博客。

- `/recipes` · `/recipes/[slug]` — 12 个配方，每个带按秒播放的 timer
- `/brewers` · `/brewers/[slug]` — 7 款 brewer 的方法集
- `/calculator` — 粉水比、风味偏移换算
- `/xbloom` — xBloom 设备整合页
- `/blog` · `/blog/[slug]` — Sanity-backed Journal，用 GROQ `site == "bloom-timer"` 过滤
- `/api/revalidate` — 接 pixdyne-dashboard dispatcher 的 webhook

## Tech Stack
- Next.js 16 + React 19 + TypeScript 5
- Tailwind CSS 4（`@theme` token + utility classes，主要色板在 `src/app/globals.css`）
- next-sanity + @sanity/image-url + @portabletext/react（共享 Sanity 实例，只读）
- Vitest + @testing-library/react（单元测试）
- Playwright（E2E）
- pnpm

## Sanity Config
- Project ID: `ua8tnjmw`
- Dataset: `production`
- **Site slug:** `bloom-timer` （已加入 pixdyne-dashboard `blog.ts` 的 options list 和 dispatcher 的 SITE_URLS）

## Visual Identity — Editorial Specialty
- Cream paper `#f8f6f1` · Ink `#1a1612` · Terracotta accent `#c8693a`
- Instrument Serif（display）+ Geist（sans）+ Geist Mono（labels / timecodes）
- 平面排版、细线分隔、克制的 micro-interaction（hover 轻微提升 + accent 色横线）
- 无倾斜、无渐变背景、无 emoji

## 关键文件
- `src/data/recipes.ts` · `src/data/brewers.ts` — 配方与器具 SSoT
- `src/lib/sanity/env.ts` — `SITE_ID = 'bloom-timer'` + env + `SITE_URL`
- `src/lib/sanity/client.ts` — Sanity client + `urlFor` image builder（注意 `SanityImageSource` 必须从 `@sanity/image-url` 根导入，v2 移除了 `/lib/types/types` 子路径）
- `src/lib/sanity/queries.ts` — GROQ 查询，全部用 `site == "bloom-timer"` 过滤
- `src/types/blog.ts` — 博客读取 shape
- `src/app/blog/page.tsx` · `src/app/blog/[slug]/page.tsx` — Journal 列表 + 详情，Server Components + ISR
- `src/app/api/revalidate/route.ts` — 对齐 hiddenmelbourne 模式，`next-sanity/webhook parseBody` 验签
- `src/app/sitemap.ts` — 静态页 + recipes + brewers + 所有博客文章
- `src/components/SiteNav.tsx` — Journal 入口已加在导航

## Commands
- `pnpm dev` — Turbopack dev server
- `pnpm build` — 生产构建（Turbopack）
- `pnpm test` — Vitest（unit）
- `pnpm test:cov` — 覆盖率
- `pnpm test:e2e` — Playwright
- `pnpm typecheck` — `tsc --noEmit`
- `pnpm lint` — Next ESLint

## Sanity 接入 Checklist（每次新站必做）

1. [x] `pixdyne-dashboard/src/sanity/schemaTypes/blog.ts` 的 site options.list 添加 `{title: 'Bloom Timer', value: 'bloom-timer'}`
2. [x] `pixdyne-dashboard/src/app/api/sanity-revalidate/route.ts` 的 `SITE_URLS` 加 `'bloom-timer': 'https://bloom-timer.com'`
3. [ ] **TODO（用户）：** Supabase `sites` 表添加 `bloom-timer` 记录
4. [ ] **TODO（用户）：** Vercel env 配 `SANITY_REVALIDATE_SECRET`（与 pixdyne-dashboard 一致）+ `NEXT_PUBLIC_SITE_URL=https://bloom-timer.com`

Sanity webhook 全局共用 1 个（filter `_type == "blog"`），新站无需新建。

## Gotchas
- Next.js 16 + React 19 + Turbopack — 写新代码前先看 `node_modules/next/dist/docs/`，API/约定可能与训练数据不同（详见 `AGENTS.md`）
- `next-sanity@12` 的 `parseBody` 同时验签 + 反序列化，不要自己读 rawBody
- Sanity `urlFor` 的 source 类型从 `@sanity/image-url` 根导出（不是 `/lib/types/types`）
- 所有图片放 Sanity CDN，博客模板里用 `<img>` 是为了避开 next/image 的 remotePatterns 配置；如以后想用 next/image，记得在 `next.config.ts` 加 `cdn.sanity.io` 白名单
- `.env.local` 不入仓，`.env.example` 经 `!.env.example` 例外允许提交

@AGENTS.md
