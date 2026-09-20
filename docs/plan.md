# magi.website 重建计划

## 概述

将 magi.website 打造成个人 AI 产品与服务的统一入口站，通过主域名承载产品矩阵介绍，二级域名独立承载具体 AI 产品/服务。

## 架构规划

```
magi.website (主站)
├── Landing Page / 产品介绍 / 关于我
└── 产品矩阵展示 + 外链跳转

├── api.magi.website     (API 聚合服务 - Cloudflare Worker)
├── chat.magi.website    (AI 对话助手 - Cloudflare Worker)
├── agent.magi.website   (AI Agent 服务 - Cloudflare Worker)
└── [更多产品待定...]
```

## 技术栈选择

### 主站 (magi.website)

| 用途 | 技术选型 | 理由 |
|------|----------|------|
| 框架 | **Astro** | 静态站点性能最优，SSR/SSG 灵活，支持多框架组件混用 |
| 样式 | **Tailwind CSS** | 原子化 CSS，开发效率高，与 Cloudflare Pages 完美兼容 |
| 交互 | **Vue 3 / React** (可选) | 按需引入复杂交互组件 |
| 部署 | **Cloudflare Pages** | 与 Worker 生态深度集成，全球边缘部署，免费额度充足 |
| 图标 | **Lucide** 或 **Heroicons** | 开源、轻量、风格统一 |
| 字体 | **Geist** / **Noto Sans SC** | 现代感 + 中文支持 |

### SEO 工具链

| 工具 | 用途 | 说明 |
|------|------|------|
| **astro-seo** | Meta 标签管理 | 统一管理 head 中的 SEO 元素 |
| **@astrojs/sitemap** | Sitemap 生成 | 自动生成 sitemap-index.xml |
| **@astrojs/rss** | RSS Feed | 可选，博客/内容站需要 |
| **astro-compress** | 资源压缩 | HTML/CSS/JS/图片压缩 |
| **@resvg/resvg-js** | OG 图片生成 | SVG → PNG/WebP 渲染 |

### 子域名产品 (Cloudflare Workers)

| 产品 | 技术选型 | 说明 |
|------|----------|------|
| API Gateway | CF Worker + R2/KV | API 聚合、key 管理、限流 |
| AI Chat | CF Worker + AI Gateway | 对接多个 LLM，提供统一对话接口 |
| AI Agent | CF Worker + D1 + Vectorize | Agent 记忆、工具调用、向量检索 |

### 推荐 LLM 接入方案

- **Cloudflare AI Gateway**: 统一管理多个 LLM 提供商（OpenAI、Anthropic、Google 等）
- **兼容 OpenAI API 格式**: 降低接入成本，方便扩展

## i18n 国际化方案

### 实现方式

使用客户端 JavaScript 实现动态翻译，优点：
- 无需 SSR，静态生成即可
- 用户切换语言无刷新
- 语言选择持久化到 localStorage

### 翻译文件结构

```typescript
// src/i18n/translations.ts
export const translations = {
  zh: { /* 中文翻译 */ },
  en: { /* 英文翻译 */ },
};

// 翻译键路径示例:
// hero.badge, hero.headline, hero.subheadline
// products.label, products.api.name, products.api.description
// features.items.performance.title
```

### 语言检测优先级

1. **localStorage** - 用户手动选择
2. **浏览器语言** - navigator.language
3. **默认中文** - fallback

### 语言切换器

- 位置：页面右上角
- 支持：中文 / English
- 状态持久化：localStorage

### 使用方式

```astro
<!-- 在组件中使用 data-i18n 属性 -->
<h1 data-i18n="hero.headline">探索 AI 的无限可能</h1>
<p data-i18n="hero.subheadline">专注于 AI 产品与服务...</p>

<!-- 客户端自动替换翻译 -->
```

### SEO 考虑

- `<html lang="zh-CN">` 或 `<html lang="en-US">`
- 目前为单语言版本，多语言 SEO 可后续扩展为 `/zh/` 和 `/en/` 路径方案

## SEO 方案

### 整体策略

```
┌─────────────────────────────────────────────────────────────┐
│                        SEO 架构                              │
├─────────────────────────────────────────────────────────────┤
│  基础设施层    │  性能优化 (Core Web Vitals)                   │
├─────────────────────────────────────────────────────────────┤
│  Meta 标记层   │  Title / Description / OG / Twitter Card    │
├─────────────────────────────────────────────────────────────┤
│  技术 SEO 层   │  Sitemap / Robots.txt / Canonical / hreflang│
├─────────────────────────────────────────────────────────────┤
│  结构化数据层   │  JSON-LD (Organization, Product, FAQ...)  │
├─────────────────────────────────────────────────────────────┤
│  内容优化层    │  语义 HTML / Heading 层级 / 内链策略         │
└─────────────────────────────────────────────────────────────┘
```

### SEO 组件设计

```astro
---
// src/components/seo/SEO.astro
interface Props {
  title: string;
  description: string;
  canonical?: string;
  ogImage?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
}

const {
  title,
  description,
  canonical = Astro.url.href,
  ogImage = '/og-default.png',
  type = 'website',
  noindex = false,
} = Astro.props;

const siteUrl = 'https://magi.website';
const fullTitle = title === 'Home' ? 'Magi - Personal AI Lab' : `${title} | Magi`;
---

<!-- Primary Meta Tags -->
<title>{fullTitle}</title>
<meta name="title" content={fullTitle} />
<meta name="description" content={description} />

<!-- Canonical -->
<link rel="canonical" href={canonical} />

<!-- Robots -->
{noindex && <meta name="robots" content="noindex, nofollow" />}

<!-- Open Graph / Facebook -->
<meta property="og:type" content={type} />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={fullTitle} />
<meta property="og:description" content={description} />
<meta property="og:image" content={`${siteUrl}${ogImage}`} />
<meta property="og:site_name" content="Magi" />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:url" content={canonical} />
<meta name="twitter:title" content={fullTitle} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

<!-- JSON-LD (可选，根据页面类型) -->
<slot name="jsonld" />
```

### JSON-LD 结构化数据

```astro
---
// src/components/seo/OrganizationSchema.astro
---
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Magi",
  "url": "https://magi.website",
  "logo": "https://magi.website/logo.png",
  "description": "Personal AI Lab - 专注于 AI 产品与服务",
  "sameAs": [
    "https://github.com/tokyo3rdhq",
    "https://twitter.com/xxx"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "hi@magi.website",
    "contactType": "customer service"
  }
})} />
```

```astro
---
// src/components/seo/ProductSchema.astro
interface Props {
  name: string;
  description: string;
  url: string;
  price?: string;
}

const { name, description, url, price } = Astro.props;
---
<script type="application/ld+json" set:html={JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Product",
  "name": name,
  "description": description,
  "url": url,
  ...(price && {
    "offers": {
      "@type": "Offer",
      "price": price,
      "priceCurrency": "USD"
    }
  })
})} />
```

### Sitemap 配置

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://magi.website',
  integrations: [
    sitemap({
      changefreq: 'weekly',
      priority: 0.7,
      lastmod: new Date(),
      serialize(item) {
        if (item.url.includes('/products/')) {
          return { ...item, priority: 0.9 };
        }
        return item;
      }
    })
  ],
});
```

### Robots.txt

```txt
# public/robots.txt
User-agent: *
Allow: /

# Sitemap
Sitemap: https://magi.website/sitemap-index.xml

# Cloudflare Pages 爬虫
User-agent: Bytespider
Disallow: /

User-agent: AhrefsBot
Disallow: /
```

### OG 图片生成

```typescript
// src/lib/og-image.ts
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export async function generateOgImage(title: string): Promise<Buffer> {
  const font = await fetch('https://fonts.gstatic.com/s/inter/v12/...').then(r => r.arrayBuffer());
  
  const svg = await satori(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'Inter',
      }}
    >
      <h1 style={{ fontSize: 60, fontWeight: 'bold' }}>{title}</h1>
      <p style={{ fontSize: 24 }}>magi.website</p>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [{ name: 'Inter', data: font, style: 'normal', weight: 400 }]
    }
  );

  const resvg = new Resvg(svg);
  return resvg.render().asPng();
}
```

### Cloudflare Pages 配置

```toml
# wrangler.toml
name = "magi-portal"
compatibility_date = "2024-01-01"
pages_build_output_dir = "./dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
```

### SEO 检查清单

| 类别 | 检查项 | 状态 |
|------|--------|------|
| **Meta** | Title 唯一且含关键词 | ⬜ |
| **Meta** | Description < 160 字符 | ⬜ |
| **Meta** | Canonical URL 正确 | ⬜ |
| **OG** | OG Image 1200x630 | ⬜ |
| **OG** | OG Title/Description 填写 | ⬜ |
| **Twitter** | Twitter Card 配置 | ⬜ |
| **结构** | Sitemap 提交 Search Console | ⬜ |
| **结构** | Robots.txt 允许爬取 | ⬜ |
| **性能** | LCP < 2.5s | ⬜ |
| **性能** | FID < 100ms | ⬜ |
| **性能** | CLS < 0.1 | ⬜ |
| **结构化** | JSON-LD Organization | ⬜ |
| **内容** | H1 唯一且含主关键词 | ⬜ |
| **内容** | H2-H6 层级清晰 | ⬜ |
| **图片** | Alt 文本完整 | ⬜ |
| **图片** | WebP/AVIF 格式 | ⬜ |
| **移动** | 响应式布局 | ⬜ |
| **移动** | 触控友好 (44px+) | ⬜ |

### Astro SEO 优势

| 优势 | 说明 |
|------|------|
| **零 JS 默认** | 页面秒开 → LCP/CLS 优秀 |
| **静态生成** | TTFB 低 → 爬取友好 |
| **语义化 HTML** | 更好的 DOM 树结构 |
| **Cloudflare Pages** | 全球边缘 → 访问速度一致 |

## 站点内容规划

### 主站页面结构

```
/
├── Hero Section          # 一句话介绍 + CTA
├── Products Section      # 产品矩阵卡片展示
│   ├── API 服务
│   ├── Chat 助手
│   └── Agent 服务
├── Features Section      # 技术特点/优势
├── About Section         # 关于我
└── Footer                # 链接/版权
```

### 页面内容

#### 1. Hero Section
- **标语**: "探索 AI 的无限可能" / "Personal AI Lab"
- **副标题**: 专注于 AI 产品与服务的个人开发者
- **CTA 按钮**: "查看产品" / "联系我"

#### 2. Products Section (产品矩阵)
每个产品卡片包含：
- 产品图标
- 产品名称
- 简短描述
- 跳转链接 (跳转至对应子域名)

示例产品：
| 产品 | 描述 | 链接 |
|------|------|------|
| **Magi API** | 统一的 AI API 聚合服务 | api.magi.website |
| **Magi Chat** | 简洁高效的 AI 对话助手 | chat.magi.website |
| **Magi Agent** | 智能 Agent，满足复杂任务 | agent.magi.website |

#### 3. Features Section
- 🚀 **高性能**: 基于 Cloudflare Edge 全球加速
- 🔒 **隐私优先**: 数据处理透明，用户掌控数据
- 💡 **易于集成**: 标准 API，文档完善
- 🔧 **可扩展**: 模块化设计，随时添加新功能

#### 4. About Section
- 个人介绍（开发者背景）
- 技术栈偏好
- 联系方式 (Email / GitHub / Twitter)

#### 5. Footer
- 版权声明
- 隐私政策链接
- 友链区域 (可选)

## 开发计划

### Phase 1: 主站基础建设
- [ ] 初始化 Astro 项目
- [ ] 配置 Tailwind CSS
- [ ] 开发 Hero / Products / Features / About / Footer 组件
- [ ] 响应式适配 (Mobile First)
- [ ] 部署至 Cloudflare Pages

### Phase 2: SEO 完善
- [ ] 集成 astro-seo 组件
- [ ] 配置 @astrojs/sitemap
- [ ] 添加 JSON-LD 结构化数据
- [ ] 生成 OG 图片
- [ ] 配置 robots.txt
- [ ] 提交 Search Console

### Phase 3: CI/CD 完善
- [ ] GitHub Actions 自动部署
- [ ] 环境变量管理
- [ ] 预览部署 (Preview Deployments)

### Phase 4: 子域名产品开发 (可选)
- [ ] Magi API - API Gateway Worker
- [ ] Magi Chat - AI Chat Worker  
- [ ] Magi Agent - Agent Worker + D1 + Vectorize

### Phase 5: 国际化 (i18n)
- [x] 多语言支持 (中文/英文)
- [x] 浏览器语言自动检测
- [x] 手动语言切换器
- [x] 语言选择持久化 (localStorage)

### Phase 6: 增值功能
- [ ] 访问统计 (可选：Umami / Plausible)
- [ ] 性能监控

## 项目结构 (推荐)

```
magi-portal/
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
├── tsconfig.json
├── .gitignore
├── wrangler.toml              # Cloudflare Pages 配置
├── .github/
│   └── workflows/             # CI/CD 配置
├── public/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── og-default.svg
│   └── _headers              # 安全 headers
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── ProductCard.astro
│   │   ├── Products.astro
│   │   ├── Features.astro
│   │   ├── About.astro
│   │   ├── Footer.astro
│   │   └── seo/
│   │       ├── SEO.astro
│   │       ├── OrganizationSchema.astro
│   │       └── ProductSchema.astro
│   ├── i18n/
│   │   ├── index.ts           # i18n 工具函数
│   │   ├── zh.ts             # 中文翻译
│   │   ├── en.ts             # 英文翻译
│   │   └── client.ts         # 客户端翻译脚本
│   ├── pages/
│   │   ├── index.astro
│   │   └── sitemap.xml.ts    # 站点地图
│   ├── lib/
│   │   └── og-image.ts
│   └── styles/
│       └── global.css
└── docs/
    └── plan.md
```

## 部署流程

```bash
# 1. 安装依赖
npm install

# 2. 本地开发
npm run dev

# 3. 构建
npm run build

# 4. 部署 (通过 Wrangler)
npx wrangler pages deploy dist/
```

## 域名配置 (Cloudflare)

```
DNS 设置:
- A 记录: @ -> 192.0.2.1 (Cloudflare Pages 虚拟 IP)
- CNAME: www -> @

Pages 项目绑定:
- 主站: magi.website
- API 产品: api.magi.website
- Chat 产品: chat.magi.website
- Agent 产品: agent.magi.website
```

## 预算估算

| 项目 | 费用 | 备注 |
|------|------|------|
| 域名 | ~$10-15/年 | .website 后缀 |
| Cloudflare Pages | **免费** | 无限带宽，500 构建分钟/月 |
| Cloudflare Workers | **免费** | 100,000 请求/天 |
| Cloudflare D1 | **免费** | 5GB 存储 |
| Cloudflare Vectorize | **免费** | 30M 维向量 |
| **总计** | **~$10-15/年** | 极低成本 |

## 参考资料

- [Astro 文档](https://docs.astro.build)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)
- [Tailwind CSS 文档](https://tailwindcss.com)
- [Cloudflare AI Gateway](https://developers.cloudflare.com/ai-gateway/)
- [astro-seo GitHub](https://github.com/jonasmerlin/astro-seo)
- [Google SEO 最佳实践](https://developers.google.com/search/docs)
