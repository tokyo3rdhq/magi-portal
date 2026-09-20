// Client-side i18n implementation
const translations = {
  zh: {
    nav: { home: '首页', products: '产品', features: '特点', about: '关于' },
    hero: {
      badge: 'Personal AI Lab',
      headline: '探索 AI 的无限可能',
      subheadline: '专注于 AI 产品与服务的个人开发者，提供 API 聚合、AI 对话、Agent 等智能解决方案',
      ctaProducts: '查看产品',
      ctaContact: '联系我',
    },
    products: {
      label: '产品矩阵',
      title: '我的',
      titleHighlight: 'AI 产品',
      description: '基于 Cloudflare Edge 构建的高性能 AI 服务，覆盖 API、对话、Agent 三大场景',
      api: { name: 'Magi API', description: '统一的 AI API 聚合服务，支持多提供商切换、智能路由、请求限流与用量统计' },
      chat: { name: 'Magi Chat', description: '简洁高效的 AI 对话助手，支持多模型切换、对话管理、上下文记忆' },
      agent: { name: 'Magi Agent', description: '智能 Agent 服务，支持工具调用、长期记忆、复杂任务分解与执行' },
    },
    features: {
      label: '技术特点',
      title: '为什么选择',
      titleHighlight: '我',
      description: '专注于技术深度与用户体验，用心打磨每一个细节',
      items: {
        performance: { title: '高性能', description: '基于 Cloudflare Edge 全球加速，边缘节点覆盖 200+ 城市，平均响应时间 < 50ms' },
        privacy: { title: '隐私优先', description: '数据处理透明，用户掌控数据。支持全程加密传输，关键数据可选择本地处理' },
        integration: { title: '易于集成', description: '标准 OpenAI API 兼容格式，文档完善，多语言 SDK 支持，快速接入现有项目' },
        scalable: { title: '可扩展', description: '模块化架构设计，支持水平扩展，随时添加新功能和接入新的 AI 模型' },
        cost: { title: '成本可控', description: '按需付费，无最低消费。免费额度充足，个人项目和小规模使用完全免费' },
        global: { title: '全球可用', description: '服务全球部署，自动选择最优节点，无论用户身在何处都能获得极速体验' },
      },
    },
    about: {
      label: '关于我',
      title: '你好，我是',
      titleHighlight: 'Magi',
      paragraphs: [
        '一名热爱技术的独立开发者，专注于 AI 领域的产品与服务开发。',
        '热衷于探索前沿技术，致力于将复杂的 AI 能力简化为易于使用的产品，让更多人能够享受 AI 带来的便利。',
        '基于 Cloudflare Edge Platform 构建高性能、高可用的 AI 服务，追求极致的用户体验和系统稳定性。',
      ],
      techStack: '技术栈',
      contact: '联系方式',
    },
    footer: {
      brand: 'Magi',
      tagline: '专注于 AI 产品与服务的个人开发者',
      quickLinks: '快速链接',
      followMe: '关注我',
      copyright: 'All rights reserved.',
      privacy: '隐私政策',
      terms: '服务条款',
    },
  },
  en: {
    nav: { home: 'Home', products: 'Products', features: 'Features', about: 'About' },
    hero: {
      badge: 'Personal AI Lab',
      headline: 'Explore the Infinite Possibilities of AI',
      subheadline: 'Independent developer focused on AI products and services, providing API aggregation, AI chat, and Agent solutions.',
      ctaProducts: 'View Products',
      ctaContact: 'Contact Me',
    },
    products: {
      label: 'Product Portfolio',
      title: 'My',
      titleHighlight: 'AI Products',
      description: 'High-performance AI services built on Cloudflare Edge, covering API, Chat, and Agent scenarios.',
      api: { name: 'Magi API', description: 'Unified AI API aggregation service with multi-provider switching, intelligent routing, rate limiting, and usage statistics.' },
      chat: { name: 'Magi Chat', description: 'Clean and efficient AI chat assistant with multi-model switching, conversation management, and context memory.' },
      agent: { name: 'Magi Agent', description: 'Intelligent Agent service with tool calling, long-term memory, complex task decomposition and execution.' },
    },
    features: {
      label: 'Technical Features',
      title: 'Why Choose',
      titleHighlight: 'Me',
      description: 'Focused on technical depth and user experience, carefully crafting every detail.',
      items: {
        performance: { title: 'High Performance', description: 'Built on Cloudflare Edge with 200+ city coverage, average response time < 50ms.' },
        privacy: { title: 'Privacy First', description: 'Transparent data processing, user data control. Full encryption support with optional local processing.' },
        integration: { title: 'Easy Integration', description: 'Standard OpenAI API compatible format, comprehensive documentation, multi-language SDK support.' },
        scalable: { title: 'Scalable', description: 'Modular architecture with horizontal scaling, easily add new features and AI models.' },
        cost: { title: 'Cost Effective', description: 'Pay-as-you-go, no minimum. Generous free tier, completely free for personal projects.' },
        global: { title: 'Global Availability', description: 'Global deployment with auto node selection, lightning-fast experience anywhere.' },
      },
    },
    about: {
      label: 'About Me',
      title: 'Hello, I\'m',
      titleHighlight: 'Magi',
      paragraphs: [
        'An independent developer passionate about technology, focused on AI products and services.',
        'Dedicated to exploring cutting-edge tech and simplifying complex AI capabilities into accessible products.',
        'Building high-performance AI services on Cloudflare Edge Platform, pursuing excellent user experience and system stability.',
      ],
      techStack: 'Tech Stack',
      contact: 'Contact',
    },
    footer: {
      brand: 'Magi',
      tagline: 'Independent developer focused on AI products and services',
      quickLinks: 'Quick Links',
      followMe: 'Follow Me',
      copyright: 'All rights reserved.',
      privacy: 'Privacy Policy',
      terms: 'Terms of Service',
    },
  },
};

const localeNames = { zh: '中文', en: 'English' };

function getLocale() {
  const saved = localStorage.getItem('locale');
  if (saved && (saved === 'zh' || saved === 'en')) return saved;
  const browserLang = navigator.language.toLowerCase();
  if (browserLang.startsWith('en')) return 'en';
  return 'zh';
}

function setLocale(locale) {
  localStorage.setItem('locale', locale);
  document.documentElement.lang = locale;
  window.dispatchEvent(new CustomEvent('localechange', { detail: locale }));
}

function t(key) {
  const locale = getLocale();
  const keys = key.split('.');
  let value = translations[locale];
  for (const k of keys) {
    value = value?.[k];
  }
  return value || key;
}

function applyTranslations() {
  const locale = getLocale();
  const trans = translations[locale];
  
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (!key) return;
    
    const keys = key.split('.');
    let value = trans;
    
    // Handle array indices (e.g., about.paragraphs.0)
    for (const k of keys) {
      const index = parseInt(k, 10);
      if (!isNaN(index) && Array.isArray(value)) {
        value = value[index];
      } else {
        value = value?.[k];
      }
    }
    
    if (value !== undefined) {
      el.textContent = value;
    }
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  const locale = getLocale();
  document.documentElement.lang = locale;
  
  // Update language switcher display
  const currentLangEl = document.getElementById('current-lang');
  if (currentLangEl) {
    currentLangEl.textContent = localeNames[locale];
  }
  
  // Apply translations
  applyTranslations();
  
  // Re-apply on locale change
  window.addEventListener('localechange', () => {
    applyTranslations();
  });
});

// Expose to window for language switcher
window.__i18n = { getLocale, setLocale, t };
