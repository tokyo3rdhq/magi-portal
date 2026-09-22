# AGENTS.md

AI 编程助手项目指南 — MAGI Portal

## 项目概述

magi.website 是一个基于 Astro + Tailwind CSS 的静态站点，作为个人 AI 产品与服务的统一入口门户。主域名展示产品矩阵，二级域名（api/chat/agent.magi.website）承载具体 AI 产品。

设计语言：**深色淡灰渐变 + 单一品牌绿高亮 + Inter 字体（Apple 风格）**——巨字标题、大量留白、轻盈边框、克制的色彩。无 CRT / 终端 / 霓虹元素。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Astro 4.x | 静态站点生成，零 JS 默认 |
| 样式 | Tailwind CSS 3.x | 原子化 CSS |
| 部署 | Cloudflare Pages | 边缘部署 |
| 语言 | TypeScript (strict) | 类型安全 |
| 字体 | Inter (Google Fonts) | 单一字体，含 CJK fallback |

## 项目结构

```
magi-portal/
├── astro.config.mjs       # Astro 配置
├── tailwind.config.mjs    # Tailwind 主题 (Apple-style tokens)
├── wrangler.toml          # Cloudflare Pages 配置
├── tsconfig.json          # TypeScript 配置 (strict)
├── package.json
├── .env                   # 本地环境变量 (不提交)
├── .env.example           # 环境变量模板
├── docs/
│   └── plan.md            # 项目规划与决策记录
├── public/                # 静态资源 (Astro 原样复制到 dist/)
│   ├── favicon.svg
│   ├── og-default.svg
│   ├── robots.txt
│   ├── _headers           # Cloudflare 安全 headers + 缓存策略
│   ├── _redirects         # Cloudflare 路由重定向
│   └── skill.md           # Agent skill manifest (SKILL.md 规范)
└── src/
    ├── layouts/
    │   └── Layout.astro           # <head> meta + sticky top nav + footer + 内联 i18n bootstrap
    ├── components/
    │   ├── Hero.astro             # 全屏居中巨字标题 + eyebrow + 双 CTA
    │   ├── Products.astro         # 3 列 bento 产品卡片
    │   ├── ProductCard.astro      # 单卡片 (label + title + description + "Learn more")
    │   ├── Features.astro         # 4 个交替 split section (copy + visual)
    │   ├── About.astro            # editorial 双栏 (bio + tech chips | contact cards)
    │   ├── MatrixBackground.astro # 极简 CSS radial glow (无 JS / 无 canvas)
    │   └── seo/                   # OrganizationSchema / ProductSchema / SEO (未在 Layout 启用)
    ├── i18n/
    │   ├── index.ts               # barrel: re-export types + translations + locales
    │   ├── types.ts               # Locale + TranslationTree (强制 zh/en 同构)
    │   ├── translations.ts        # { en, zh } 注册表 (SSR + runtime 都消费)
    │   ├── locales-meta.ts        # 显示标签 { en: 'EN', zh: '中文' }
    │   └── locales/
    │       ├── en.ts              # 英文文案 (类型化)
    │       └── zh.ts              # 中文文案 (类型化)
    ├── pages/
    │   ├── index.astro            # 首页
    │   └── sitemap.xml.ts         # 站点地图
    └── styles/
        └── global.css             # Tailwind layers + Apple-style components
```

## 核心约定

### 1. 设计风格

- **背景**: `#000` → `#1d1d1f` 顶部到底部淡灰渐变 (固定附着)
- **品牌色**: `#00C853` (accent) — CTA / 链接 / eyebrow
- **文字**: `#f5f5f7` 主 / `#86868b` 次 / `#6e6e73` 弱
- **卡片**: `rgba(255,255,255,0.04)` 底 + 1px `rgba(255,255,255,0.08)` 边
- **字体**: Inter (含 `-webkit-font-smoothing: antialiased`)
- **尺寸感**: Hero headline `text-7xl~8xl`、section title `text-4xl~6xl`、正文 `text-base~xl`
- **节奏**: section 间距 `py-32 md:py-40`，巨大留白

样式 token 集中在 `tailwind.config.mjs` 的 `colors: { bg, ink, accent, line }`。组件 utility 集中在 `src/styles/global.css` 的 `@layer components`（`.eyebrow`、`.display`、`.section-title`、`.btn-primary`、`.btn-secondary`、`.link-arrow`、`.card-surface`、`.nav-link`）。

### 2. i18n 多语言

字典**物理独立**于 Layout：

- `src/i18n/types.ts` 定义 `TranslationTree` 类型
- `src/i18n/locales/en.ts` 与 `locales/zh.ts` 各导出一份 `TranslationTree`（必须同构，否则 `tsc --noEmit` 报错）
- `src/i18n/translations.ts` 汇总 `{ en, zh }` 注册表
- `src/i18n/locales-meta.ts` 定义显示标签 `{ en: 'EN', zh: '中文' }`

**Layout 用法**：

```astro
---
import { locales, translations } from '../i18n';
---
<script is:inline define:vars={{ translations, locales }}>
  /* 自包含 runtime: getLocale / setLocale / applyTranslations /
     syncActiveLocaleButton, 仅引用注入的 translations + locales */
</script>
```

**运行时行为**：
- 切换器在顶部 nav 右上角，下拉选择 zh/en
- 选择持久化到 `localStorage('locale')`，默认跟随浏览器语言 (`navigator.language` startsWith 'en' → en，否则 zh)
- `applyTranslations()` 扫描所有 `[data-i18n]` 元素，按 `key.split('.')` 路径查字典并替换 `textContent`

**使用方式**（在 .astro 组件里）：

```astro
<span data-i18n="hero.headline">原文</span>
<p data-i18n="products.api.description">原文</p>
```

注意：
- 所有用户可见文本必须使用 `data-i18n` 属性
- key 路径用点号分隔（如 `features.items.0.headline`）
- 数组索引用作 key 段（如 `features.items.0.headline`，而不是 `.performance.headline`）
- 修改文案只改 `src/i18n/locales/{en,zh}.ts`，不要改 Layout

### 3. 环境变量

| 变量名 | 用途 | Cloudflare Pages 类型 |
|--------|------|----------------------|
| `PUBLIC_SITE_URL` | 站点 URL | plain_text |
| `PUBLIC_SITE_NAME` | 站点名称 | plain_text |
| `PUBLIC_GA_ID` | Google Analytics ID | secret_text |

**本地开发**：在 `.env` 文件中设置
**生产环境**：在 Cloudflare Dashboard 或通过 API 配置

### 4. SEO 要求

每个页面必须包含：
- `<title>` 唯一
- `<meta name="description">` < 160 字符
- Open Graph 标签（og:type, og:url, og:title, og:description, og:image）
- Twitter Card 标签
- Canonical URL
- JSON-LD 结构化数据（使用 `OrganizationSchema.astro`，目前仅首页）

### 5. 响应式设计

- Mobile First 策略
- 断点：`md:` (768px), `lg:` (1024px)
- 触摸目标 ≥ 44px

### 6. 公共资产 / Cloudflare 配置

- `public/skill.md`：agent skill manifest，遵循 SKILL.md 规范（YAML frontmatter + Markdown）。agent `curl https://magi.website/skill.md` 获取站点能力描述
- `public/_headers`：安全头 + 缓存策略
  - 顶部无路径规则：X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy 全站生效
  - `/sitemap.xml`: Cache-Control 1 天
  - `/_astro/*`: Cache-Control 1 年 immutable
  - `/skill.md`: Content-Type: text/markdown; charset=utf-8, Cache-Control 1 小时
- `public/_redirects`：路由重定向（`/skills.md → /skill.md 301`）
  - **重要**：`_headers` 里的 `Location:` 指令对**不存在的静态路径**不生效（fallback 到 index.html 200）；要重写路径必须用 `_redirects`

### 7. 滚动行为

`src/styles/global.css` 实现 Apple 风格滚动条：
- 默认 6px 细轨，thumb 透明
- 滚动时（`body.scrolling` class，由 inline script 维护）或 body hover 时 thumb 显形
- `prefers-reduced-motion: reduce` 关闭 smooth scroll 与动效

## 开发命令

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # 输出到 dist/
npm run preview    # 本地预览构建结果
```

## 部署流程

手动部署（当前）：

```bash
npm run build
npx wrangler pages deploy dist --project-name=magi-portal
```

Cloudflare Pages 配置：
```
Build command: npm run build
Build output: dist
NODE_VERSION: 20
```

## 添加新组件

1. 在 `src/components/` 创建 `.astro` 文件
2. 复用 `tailwind.config.mjs` 的语义色 token（`bg-*` / `ink-*` / `accent` / `line-*`）
3. 复用 `global.css` 的组件 utility（`.card-surface` / `.eyebrow` / `.display` / `.btn-primary` 等）
4. 用 `data-i18n` 标记所有用户可见文本
5. 在 `src/pages/index.astro` 导入使用

## 添加新语言

1. 在 `src/i18n/types.ts` 扩展 `Locale` union 类型和 `TranslationTree` 结构
2. 在 `src/i18n/locales/<code>.ts` 导出对应语言的 `TranslationTree`
3. 在 `src/i18n/translations.ts` 注册到 `translations: Record<Locale, TranslationTree>`
4. 在 `src/i18n/locales-meta.ts` 添加显示标签
5. 在 Layout 内联 i18n bootstrap 的 `getLocale` / `setLocale` 添加该语言判断
6. `tsc --noEmit` 应通过；任何遗漏 key 都会被类型系统捕获

## 注意事项

- **不要**直接修改 `node_modules/` 或 `.astro/` 中的文件
- **不要**提交 `.env` 文件（已加入 .gitignore）
- **不要**在代码中硬编码用户可见文本，必须用 `data-i18n`
- **不要**重新引入 CRT / 终端风的样式 token（`.terminal-text` / `.pulse-glow` / `.glitch` 等已移除）
- 修改 `wrangler.toml` 时需谨慎，错误的配置会导致部署失败
- 添加新依赖前检查是否与 Astro 4 兼容

## 相关文档

- `docs/plan.md` - 项目整体规划与决策记录
- `README.md` - 公开项目说明
- `public/skill.md` - Agent skill manifest (curl 可访问)
- [Astro 文档](https://docs.astro.build)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
