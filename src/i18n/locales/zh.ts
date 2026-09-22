import type { TranslationTree } from '../types';

const zh: TranslationTree = {
  nav: { products: '产品', features: '特性', about: '关于' },

  hero: {
    eyebrow: '个人 AI 实验室',
    headline: '可信的 AI,\n可托付长远。',
    subhead: '面向 API、对话与 Agent 的高性能 AI 服务,由独立开发者在 Cloudflare Edge 上构建。',
    ctaPrimary: '查看产品',
    ctaSecondary: '联系我',
  },

  products: {
    eyebrow: '产品',
    headline: '三套系统。\n一个平台。',
    subhead: '面向生产的 AI 服务,全部部署在边缘。',
    api: {
      name: 'MAGI API',
      description:
        '统一的 AI API 网关。多提供商切换、智能路由、限流、用量分析 — 全部收敛在一个 OpenAI 兼容端点之后。',
    },
    chat: {
      name: 'MAGI Chat',
      description: '干净、快速的 AI 对话助手。可在对话中途切换模型、保留上下文,并顺畅管理历史记录。',
    },
    agent: {
      name: 'MAGI Agent',
      description: '可长时运行的 AI Agent,支持工具调用、持久记忆与结构化任务分解,适合真实工作流。',
    },
  },

  features: {
    eyebrow: '特性',
    items: [
      {
        eyebrow: '性能',
        headline: '为速度而生。',
        body: '基于 Cloudflare Edge 网络,覆盖 200+ 城市,全球平均响应时间低于 50 毫秒。',
      },
      {
        eyebrow: '隐私',
        headline: '数据归你所有。',
        body: '处理过程透明,传输全程加密,敏感负载可启用本地模式。',
      },
      {
        eyebrow: '集成',
        headline: '即插即用。',
        body: '兼容 OpenAI API,提供完整 SDK 与参考实现 — 几分钟上线,不必数周。',
      },
      {
        eyebrow: '扩展',
        headline: '扩展无需返工。',
        body: '模块化架构随业务成长。增删模型、替换提供商、扩展端点,都无需重构平台。',
      },
    ],
  },

  about: {
    eyebrow: '关于',
    headline: '一人所建。\n用心维护。',
    body: '我是一名专注于 AI 产品与服务的独立开发者。MAGI 这个名字取自《新世纪福音战士》中的三核超级计算机 — 三套系统共同推理,给出最合适的答案。',
    tech: '技术',
    contact: '联系',
    emailLabel: '邮箱',
    githubLabel: 'GitHub',
  },
};

export default zh;
