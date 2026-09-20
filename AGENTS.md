# AGENTS.md

AI 编程助手项目指南 - MAGI Portal

## 项目概述

magi.website 是一个基于 Astro + Tailwind CSS 的静态站点，作为个人 AI 产品与服务的统一入口门户。主域名展示产品矩阵，二级域名（api/chat/agent.magi.website）承载具体 AI 产品。

设计灵感来自《新世纪福音战士》(EVA) 中的 MAGI 超级计算机系统（以东方三圣贤 Melchior/Balthasar/Caspar 命名），采用终端/命令行风格的暗色科技感设计。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 框架 | Astro 4.x | 静态站点生成，零 JS 默认 |
| 样式 | Tailwind CSS 3.x | 原子化 CSS |
| 部署 | Cloudflare Pages | 边缘部署 |
| 语言 | TypeScript | 类型安全 |
| 字体 | JetBrains Mono + Orbitron | 终端字体 + 标题字体 |

## 项目结构

```
magi-portal/
├── astro.config.mjs       # Astro 配置
├── tailwind.config.mjs    # Tailwind 主题配置
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
│   └── _headers           # Cloudflare 安全 headers
├── .github/
│   └── workflows/         # CI/CD 配置
└── src/
    ├── layouts/
    │   └── Layout.astro           # 基础布局 + 语言切换器
    ├── components/
    │   ├── Hero.astro             # 终端启动序列
    │   ├── MatrixBackground.astro # 数字雨背景
    │   ├── Products.astro         # 产品矩阵
    │   ├── ProductCard.astro
    │   ├── Features.astro
    │   ├── About.astro            # MAGI 系统可视化
    │   ├── Footer.astro
    │   └── seo/                   # SEO 组件
    ├── i18n/
    │   ├── index.ts               # i18n 工具函数
    │   ├── zh.ts                  # 中文翻译
    │   ├── en.ts                  # 英文翻译
    │   ├── client.ts              # 客户端翻译脚本
    │   └── translations.ts        # 浏览器端翻译
    ├── pages/
    │   ├── index.astro            # 首页
    │   └── sitemap.xml.ts         # 站点地图
    └── styles/
        └── global.css             # 全局样式 + 动画
```

## 核心约定

### 1. 设计风格

- **配色**: 黑底 `#0D0D0D` + 终端绿 `#00FF41`
- **强调色**: 青色 `#00FFFF`、品红 `#FF00FF`、琥珀 `#FFAA00`
- **字体**: JetBrains Mono (代码/正文) + Orbitron (标题)
- **元素**: CRT 扫描线、闪烁光标、脉冲发光、故障效果 (Glitch)

### 2. i18n 多语言

- 支持中文（zh）和英文（en）
- 自动检测浏览器语言
- 手动切换器在页面右上角
- 语言选择持久化到 localStorage

**使用方式**：
```astro
<span data-i18n="hero.headline">原文</span>
<p data-i18n="products.api.description">原文</p>
```

**注意**：
- 所有用户可见的文本必须使用 `data-i18n` 属性
- 翻译键路径使用点号分隔（如 `about.paragraphs.0`）
- 修改 Layout.astro 中的 `translations` 对象添加新翻译
- 避免硬编码中英文混用

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
npx wrangler pages deploy dist --project-name=magi-portal --commit-dirty=true
```

### Cloudflare Pages 配置

```
Build command: npm run build
Build output: dist
NODE_VERSION: 20
```

## 添加新组件

1. 在 `src/components/` 创建 `.astro` 文件
2. 使用 `data-i18n` 属性标记所有文本
3. 复用 `Layout.astro` 中的样式工具类（`terminal-text`, `terminal-dim`, `terminal-highlight` 等）
4. 在 `src/pages/index.astro` 中导入使用

## 添加新语言

1. 在 `src/i18n/` 创建新语言文件（如 `ja.ts`）
2. 在 `Layout.astro` 的 `translations` 对象中添加
3. 在 `getLocale()` 函数中添加新语言判断
4. 在语言切换器中添加新选项

## 注意事项

- **不要**直接修改 `node_modules/` 或 `.astro/` 中的文件
- **不要**提交 `.env` 文件（已加入 .gitignore）
- **不要**在代码中硬编码文本，所有用户可见内容必须支持 i18n
- 修改 `wrangler.toml` 时需谨慎，错误的配置会导致部署失败
- 添加新依赖前检查是否与 Astro 4 兼容

## 相关文档

- `docs/plan.md` - 项目整体规划
- `README.md` - 项目说明
- [Astro 文档](https://docs.astro.build)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
