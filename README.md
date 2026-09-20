# Magi Portal

Personal AI Lab - 专注于 AI 产品与服务的个人开发者门户

## 🛠️ 技术栈

- **框架**: [Astro](https://astro.build) v4
- **样式**: [Tailwind CSS](https://tailwindcss.com)
- **部署**: [Cloudflare Pages](https://pages.cloudflare.com)
- **域名**: magi.website

## ✨ 功能特性

- 🚀 基于 Astro 的高性能静态站点
- 🎨 响应式暗色主题设计
- 🔍 完整的 SEO 优化 (Meta, Sitemap, JSON-LD)
- 📱 移动端优先的响应式布局
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

### Cloudflare Pages 部署

1. 在 Cloudflare Dashboard 创建 Pages 项目
2. 获取以下 Secret：
   - `CLOUDFLARE_API_TOKEN`: Cloudflare API Token
   - `CLOUDFLARE_ACCOUNT_ID`: Cloudflare Account ID

3. 在 GitHub仓库 Settings > Secrets 中添加：
   ```bash
   # 添加 Secret
   CLOUDFLARE_API_TOKEN=your_api_token
   CLOUDFLARE_ACCOUNT_ID=your_account_id
   ```

4. 推送代码到 main 分支，自动部署

### GitHub Actions 工作流

- **cloudflare-deploy.yml**: 生产环境部署
- **preview.yml**: Pull Request 预览部署
- **deploy.yml**: GitHub Pages 备用部署

## 📁 项目结构

```
magi-portal/
├── src/
│   ├── components/     # 组件
│   ├── layouts/        # 布局
│   ├── pages/          # 页面
│   └── styles/         # 样式
├── public/             # 静态资源
├── .github/
│   └── workflows/      # CI/CD 配置
└── docs/
    └── plan.md         # 项目规划
```

## 🔗 相关链接

- [Astro 文档](https://docs.astro.build)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)
- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [Cloudflare Workers 文档](https://developers.cloudflare.com/workers/)

## 📄 许可证

MIT
