# Magi Portal

Personal AI Lab - 专注于 AI 产品与服务的个人开发者门户

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build) v4
- **样式**: [Tailwind CSS](https://tailwindcss.com)
- **部署**: [Cloudflare Pages](https://pages.cloudflare.com)
- **域名**: magi.website

## ✨ 功能特性

- 🚀 基于 Astro 的高性能静态站点
- 🎨 终端科技感暗色主题（EVA MAGI 风格）
- 🔍 完整的 SEO 优化 (Meta, Sitemap, JSON-LD)
- 📱 移动端优先的响应式布局
- 🌐 多语言支持 (i18n)
- ⚡ Cloudflare Edge 全球加速

## 📦 开发

```bash
# 安装依赖
npm install

# 本地开发
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 🚀 部署

通过 Wrangler CLI 手动部署：

```bash
# 构建
npm run build

# 部署到 Cloudflare Pages
npx wrangler pages deploy dist --project-name=magi-portal
```

## 📁 项目结构

```
magi-portal/
├── src/
│   ├── components/     # 组件
│   ├── layouts/        # 布局
│   ├── pages/          # 页面
│   └── styles/         # 样式
├── public/             # 静态资源
├── docs/
│   └── plan.md         # 项目规划
└── AGENTS.md           # AI 编程助手指南
```

## 🔗 相关链接

- [Astro 文档](https://docs.astro.build)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 📄 许可证

MIT
