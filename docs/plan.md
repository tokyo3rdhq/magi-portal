# magi.website 重建计划与决策记录

> 这份文档记录**当前架构**与**决策历史**。它是项目结构的权威说明——如果代码与本文档冲突，以代码为准，并提 PR 同步本文档。

## 概述

magi.website 是一个基于 Astro + Tailwind CSS 的静态站点，作为个人 AI 产品与服务的统一入口门户。

- **主域名 (magi.website)**：产品矩阵介绍、关于、联系方式
- **二级域名**：独立承载具体 AI 产品 / 服务

## 架构

```
magi.website (主站, Astro 静态)
├── Landing Page / 产品介绍 / 关于 / 联系方式
└── 产品矩阵展示 + 外链跳转

├── api.magi.website     (API 聚合服务, Cloudflare Worker)
├── chat.magi.website    (AI 对话助手, Cloudflare Worker)
└── agent.magi.website   (AI Agent 服务, Cloudflare Worker)
```

主站是**纯静态**——不接数据库、不跑 SSR、不需要冷启动。子域名产品各自独立部署在 Cloudflare Workers / Pages。

## 技术栈

### 主站

| 用途 | 选型 | 理由 |
|------|------|------|
| 框架 | Astro 4.x | 静态站点性能最优，零 JS 默认，TTFB 低 |
| 样式 | Tailwind CSS 3.x | 原子化 CSS，与 Cloudflare Pages 完美兼容 |
| 类型 | TypeScript (strict) | i18n 字典编译期一致性 |
| 部署 | Cloudflare Pages | 与 Worker 生态深度集成，全球边缘，免费额度充足 |
| 字体 | Inter (Google Fonts) | 现代无衬线，CJK fallback 到 PingFang/Hiragino |

### 已废弃（不要重新引入）

- ~~JetBrains Mono + Orbitron~~ → Inter
- ~~EVA MAGI 终端风 / CRT / Glitch / Matrix Rain / 闪烁光标~~ → Apple 风格深色渐变
- ~~astro-seo / @astrojs/sitemap 集成~~ → 自写 `sitemap.xml.ts` + Layout 内联 meta
- ~~Vue 3 / React (按需引入)~~ → 当前只有 .astro，纯静态
- ~~OG 图片自动生成 (satori + resvg)~~ → 静态 `og-default.svg`

### 子域名产品（规划中）

| 产品 | 选型 |
|------|------|
| API Gateway | CF Worker + R2/KV，OpenAI 兼容 |
| AI Chat | CF Worker + AI Gateway |
| AI Agent | CF Worker + D1 + Vectorize |

## 设计语言（当前）

- **背景**: `#000` → `#1d1d1f` 顶部到底部淡灰渐变 (固定附着)
- **品牌色**: `#00C853` (accent)
- **文字**: `#f5f5f7` / `#86868b` / `#6e6e73` 三档
- **Hero 文案**: `AI you can trust. Built to last.` / `可信的 AI，可托付长远。`
- **节奏**: section 间距 `py-32 md:py-40`
- **Tailwind tokens**: `bg-*` / `ink-*` / `accent` / `line-*`
- **组件 utility**: `.eyebrow` / `.display` / `.section-title` / `.btn-primary` / `.btn-secondary` / `.link-arrow` / `.card-surface` / `.nav-link`

详细规范见 `AGENTS.md`。

## i18n 国际化

### 实现方式

- 客户端 JS 实现，**不需要 SSR**
- 用户切换语言无刷新
- 语言选择持久化到 `localStorage`
- 文案独立成模块（`src/i18n/locales/{en,zh}.ts`），类型系统强制 zh/en 同构

### 翻译文件结构

```ts
// src/i18n/types.ts
export type TranslationTree = {
  nav: { products: string; features: string; about: string };
  hero: { eyebrow: string; headline: string; subhead: string; ctaPrimary: string; ctaSecondary: string };
  products: { eyebrow: string; headline: string; subhead: string; api: { name: string; description: string }; chat: { ... }; agent: { ... } };
  features: { eyebrow: string; items: Array<{ eyebrow: string; headline: string; body: string }> };
  about: { eyebrow: string; headline: string; body: string; tech: string; contact: string; emailLabel: string; githubLabel: string };
};
```

### 语言检测优先级

1. `localStorage.locale`（用户手动选择）
2. `navigator.language` startsWith 'en' → en
3. fallback: en

### 使用方式

```astro
<h1 data-i18n="hero.headline">原文</h1>
<p data-i18n="products.api.description">原文</p>
```

`Layout.astro` 内联 i18n bootstrap 扫描所有 `[data-i18n]` 元素，按 `key.split('.')` 路径查字典并替换 `textContent`。数组索引也作为 key 段（如 `features.items.0.headline`）。

### 已废弃

- ~~`zh.ts` / `en.ts` 顶层翻译文件 + `client.ts` / `translations.ts` 客户端工具~~ → 合并到 `locales/{en,zh}.ts` + Layout 内联 bootstrap
- ~~`<html lang>` 通过 SSR 决定~~ → 客户端根据 `localStorage` 切换

## SEO 方案

### 当前实现

- `<head>` 在 `Layout.astro` 内联：title、description、canonical、OG、Twitter Card
- JSON-LD `Organization` schema 在 `OrganizationSchema.astro`
- Sitemap：自写 `src/pages/sitemap.xml.ts`（非 `@astrojs/sitemap` 集成）
- `robots.txt`: 允许所有爬虫，禁用 Bytespider 与 AhrefsBot
- `_headers`: 安全头（X-Frame-Options DENY 等）+ 缓存策略
- `_redirects`: 路由重定向（`/skills.md → /skill.md 301`）

### Cloudflare `_headers` vs `_redirects` 区别

- `_headers` 的 `Location:` 只对**真实存在**的静态文件生效
- 不存在的路径会被 SPA fallback 到 `index.html`（200），不会触发 `Location`
- 想重写 `/foo → /bar` 这种**不存在→存在**的路径，必须用 `_redirects`

### SEO Checklist

| 类别 | 项 | 状态 |
|------|----|------|
| Meta | Title 唯一且含关键词 | ✅ |
| Meta | Description < 160 字符 | ✅ |
| Meta | Canonical URL 正确 | ✅ |
| OG | OG Image 1200x630 | ⚠️ 当前为 SVG，未来生成 PNG |
| OG | OG Title/Description | ✅ |
| Twitter | Twitter Card | ✅ |
| 结构 | Sitemap | ✅ |
| 结构 | Robots.txt | ✅ |
| 结构化 | JSON-LD Organization | ✅ |
| 移动 | 响应式 + 触控 44px+ | ✅ |

## 站点内容

### 当前页面

单页 `src/pages/index.astro`，section 顺序：

1. **Hero** — eyebrow (`Personal AI Lab` / `个人 AI 实验室`) + 巨字标题 (`AI you can trust. Built to last.` / `可信的 AI，可托付长远。`) + 双 CTA (`View Products` / `Contact Me`)
2. **Products** — 3 列 bento (API / Chat / Agent)
3. **Features** — 4 个交替 split section (Performance / Privacy / Integration / Scale)
4. **About** — editorial 双栏 (bio + tech chips | contact cards)
5. **Footer** — 单行版权 + 联系邮箱

### Hero Section

- **标语**: `AI you can trust. Built to last.` (en) / `可信的 AI，可托付长远。` (zh)
- **CTA**: `View Products` / `Contact Me`

### Products Section

| 产品 | 链接 |
|------|------|
| MAGI API | api.magi.website |
| MAGI Chat | chat.magi.website |
| MAGI Agent | agent.magi.website |

## 开发计划

### ✅ Phase 1 — 主站基础建设（完成）

- Astro 项目脚手架
- Tailwind CSS 配置
- Hero / Products / Features / About / Footer 组件
- 响应式适配
- 部署到 Cloudflare Pages

### ✅ Phase 2 — SEO（完成）

- 内联 head meta
- 自写 sitemap
- JSON-LD Organization
- robots.txt
- `_headers` / `_redirects`

### ✅ Phase 5 — i18n（完成）

- zh / en 双语
- localStorage 持久化
- 浏览器语言检测
- 顶部 nav 切换器

### ⏳ Phase 3 — CI/CD

- 当前手动 wrangler 部署
- 可选：GitHub Actions 自动部署

### ⏳ Phase 4 — 子域名产品

- Magi API (API Gateway Worker)
- Magi Chat (AI Chat Worker)
- Magi Agent (Agent Worker + D1 + Vectorize)

### ⏳ Phase 6 — 增值

- OG 图片自动生成（satori + resvg）替代静态 SVG
- 访问统计（Umami / Plausible）

## 项目结构

```
magi-portal/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── wrangler.toml
├── public/
│   ├── favicon.svg
│   ├── og-default.svg
│   ├── robots.txt
│   ├── _headers
│   ├── _redirects
│   └── skill.md             # Agent skill manifest
├── src/
│   ├── layouts/
│   │   └── Layout.astro     # head + sticky nav + footer + inline i18n bootstrap
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── Products.astro
│   │   ├── ProductCard.astro
│   │   ├── Features.astro
│   │   ├── About.astro
│   │   ├── MatrixBackground.astro   # 极简 CSS radial glow
│   │   └── seo/
│   │       ├── OrganizationSchema.astro
│   │       ├── ProductSchema.astro  # 未在 Layout 启用
│   │       └── SEO.astro             # 未在 Layout 启用 (Layout 内联了 meta)
│   ├── i18n/
│   │   ├── index.ts          # barrel
│   │   ├── types.ts          # TranslationTree 类型
│   │   ├── translations.ts   # { en, zh } 注册表
│   │   ├── locales-meta.ts   # { en: 'EN', zh: '中文' }
│   │   └── locales/
│   │       ├── en.ts
│   │       └── zh.ts
│   ├── pages/
│   │   ├── index.astro
│   │   └── sitemap.xml.ts
│   └── styles/
│       └── global.css
└── docs/
    └── plan.md
```

## 部署

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=magi-portal
```

Cloudflare Pages 配置：
- Build command: `npm run build`
- Build output: `dist`
- NODE_VERSION: 20

## 预算

| 项目 | 费用 |
|------|------|
| 域名 (.website) | ~$10–15/年 |
| Cloudflare Pages | 免费 |
| Cloudflare Workers | 免费 (10 万请求/天) |
| Cloudflare D1 | 免费 (5GB) |
| Cloudflare Vectorize | 免费 (30M 维向量) |
| **总计** | **~$10–15/年** |

## 参考

- [Astro 文档](https://docs.astro.build)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [SKILL.md 规范](https://github.com/anthropics/skills)
