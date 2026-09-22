# AGENTS.md

AI 编程助手项目指南 - MAGI Portal

## 项目概述

magi.website 是一个基于 Astro + Tailwind CSS 的静态站点，作为个人 AI 产品与服务的统一入口门户。主域名展示产品矩阵，二级域名（api/chat/agent.magi.website）承载具体 AI 产品。

设计语言为深色淡灰渐变 + 单一品牌绿高亮 + Inter 字体（Apple 风格）：巨字标题、大量留白、轻盈边框、克制的色彩。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Astro 4.x | 静态站点生成，零 JS 默认 |
| 样式 | Tailwind CSS 3.x | 原子化 CSS |
| 部署 | Cloudflare Pages | 边缘部署 |
| 语言 | TypeScript | 类型安全 |
| 字体 | Inter (Google Fonts) | 单一字体，含 CJK fallback |

## 项目结构

```
magi-portal/
├── astro.config.mjs       # Astro 配置
├── tailwind.config.mjs    # Tailwind 主题 (Apple-style tokens)
├── wrangler.toml          # Cloudflare Pages 配置
├── tsconfig.json          # TypeScript 配置
├── package.json
├── .env                   # 本地环境变量 (不提交)
├── .env.example           # 环境变量模板
├── docs/
│   └── plan.md            # 项目规划文档
├── public/                # 静态资源
│   ├── favicon.svg
│   ├── og-default.svg
│   ├── robots.txt
│   ├── _headers           # Cloudflare 安全 headers
│   ├── _redirects         # Cloudflare 路由重定向
│   └── skill.md           # Agent skill manifest (SKILL.md 规范)
├── .github/
│   └── workflows/         # CI/CD 配置
└── src/
    ├── layouts/
    │   └── Layout.astro           # 基础布局 + top nav + 内联 footer + 内联 i18n 脚本
    ├── components/
    │   ├── Hero.astro             # 全屏居中巨字标题 + 双 CTA
    │   ├── Products.astro         # 3 列 bento 产品卡片
    │   ├── ProductCard.astro
    │   ├── Features.astro         # 4 个交替 split section (copy + visual)
    │   ├── About.astro            # editorial 双栏 (bio + tech chips | contact cards)
    │   ├── MatrixBackground.astro # 极简 CSS radial glow (无 JS)
    │   └── seo/                   # SEO 组件
    ├── i18n/
    │   └── index.ts               # locales 注册表 (Layout 内联 i18n 用)
    ├── pages/
    │   ├── index.astro            # 首页
    │   └── sitemap.xml.ts         # 站点地图
    └── styles/
        └── global.css             # Tailwind layers + Apple-style components (.eyebrow / .display / .btn-primary / .card-surface ...)
```

## 核心约定

### 1. 设计风格

- **背景**: `#000` → `#1d1d1f` 顶部到底部淡灰渐变 (固定附着)
- **品牌色**: `#00C853` (accent) — CTA / 链接 / eyebrow
- **文字**: `#f5f5f7` 主 / `#86868b` 次 / `#6e6e73` 弱
- **卡片**: `rgba(255,255,255,0.04)` 底 + 1px `rgba(255,255,255,0.08)` 边
- **字体**: Inter (含 `font-feature-settings` 抗锯齿优化)
- **尺寸感**: Hero headline `text-7xl~8xl`、section title `text-4xl~6xl`、正文 `text-base~xl`
- **节奏**: section 间距 `py-32 md:py-40`，巨大留白

样式 token 集中在 `tailwind.config.mjs` (colors: `bg/ink/accent/line`)。组件 utility 集中在 `src/styles/global.css` 的 `@layer components` (`.eyebrow`、`.display`、`.section-title`、`.btn-primary`、`.btn-secondary`、`.link-arrow`、`.card-surface`、`.nav-link`)。

### 2. i18n 多语言

- 翻译字典内联在 `Layout.astro` 的 `<script is:inline>` 块中（`translations.en`、`translations.zh`）
- 顶层 nav 右上角语言切换器，下拉选择 zh/en
- 选择持久化到 `localStorage('locale')`，默认跟随浏览器语言
- `src/i18n/index.ts` 仅导出 `locales` 字典（zh→"中文"、en→"EN"）给 Layout 显示用

**使用方式**：
```astro
<span data-i18n="hero.headline">原文</span>
<p data-i18n="products.api.description">原文</p>
```

**注意**：
- 所有用户可见的文本必须使用 `data-i18n` 属性
- 翻译键路径使用点号分隔（如 `features.items.0.headline`）
- 修改 `Layout.astro` 内联脚本的 `translations` 对象添加/修改词条
- 数组索引也作为 key 段（如 `about.paragraphs.0`）
- 避免硬编码用户可见文本

### 3. 环境变量

| 变量名 | 用途 | Cloudflare Pages |
|--------|------|-----------------|
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
- JSON-LD 结构化数据（使用 `OrganizationSchema.astro`）

### 5. 响应式设计

- Mobile First 策略
- 断点：`md:` (768px), `lg:` (1024px)
- 触摸目标 ≥ 44px

### 6. 公共资产

- `public/skill.md`：agent skill manifest，遵循 SKILL.md 规范（YAML frontmatter + Markdown）。任何 agent 集成对接站点能力时 curl 此文件
- `public/_redirects`：Cloudflare Pages 路由重定向（`_headers` 中的 `Location` 指令对不存在的路径不生效，必须用 `_redirects`）
- `public/_headers`：安全头 + 缓存策略

## 开发命令

```bash
# 安装依赖
npm install

# 本地开发（http://localhost:4321）
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 部署到 Cloudflare Pages
npx wrangler pages deploy dist --project-name=magi-portal
```

## 部署流程

### 当前方式：手动部署

```bash
npm run build
npx wrangler pages deploy dist --project-name=magi-portal
```

### Cloudflare Pages 配置

```
Build command: npm run build
Build output: dist
NODE_VERSION: 20
```

## 添加新组件

1. 在 `src/components/` 创建 `.astro` 文件
2. 复用 `tailwind.config.mjs` 中的语义色 token (`bg-*` / `ink-*` / `accent` / `line-*`)
3. 复用 `global.css` 的组件 utility（`.card-surface` / `.eyebrow` / `.display` / `.btn-primary` 等）
4. 使用 `data-i18n` 属性标记所有用户可见文本
5. 在 `src/pages/index.astro` 中导入使用

## 添加新语言

1. 在 `Layout.astro` 内联脚本的 `translations` 对象中添加新 locale 键
2. 在 `src/i18n/index.ts` 的 `locales` 字典添加显示名
3. 在 `getLocale()` 函数中添加识别规则
4. 在 `<html lang>` 和 `setLocale` 的 `document.documentElement.lang` 同步更新

## 注意事项

- **不要**直接修改 `node_modules/` 或 `.astro/` 中的文件
- **不要**提交 `.env` 文件（已加入 .gitignore）
- **不要**在代码中硬编码用户可见文本，必须用 `data-i18n`
- 修改 `wrangler.toml` 时需谨慎，错误的配置会导致部署失败
- 添加新依赖前检查是否与 Astro 4 兼容
- 不要重新引入 CRT / 终端风的样式 token (`.terminal-text` / `.pulse-glow` / `.glitch` 等已移除)

## 相关文档

- `docs/plan.md` - 项目整体规划
- `README.md` - 项目说明
- [Astro 文档](https://docs.astro.build)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
