import type { TranslationTree } from '../types';

const en: TranslationTree = {
  nav: {
    products: 'Products',
    features: 'Features',
    documents: 'Documents',
    about: 'About',
  },

  hero: {
    eyebrow: 'Personal AI Lab',
    headline: 'AI you can trust.\nBuilt to last.',
    subhead:
      'High-performance AI services for API, chat, and agents — built by an independent developer on Cloudflare Edge.',
    ctaPrimary: 'View Products',
    ctaSecondary: 'Contact Me',
  },

  products: {
    eyebrow: 'Products',
    headline: 'Three systems.\nOne platform.',
    subhead: 'Production-grade AI services, deployed at the edge.',
    api: {
      name: 'MAGI API',
      description:
        'A unified AI API gateway. Multi-provider switching, smart routing, rate limits, and usage analytics — all behind a single OpenAI-compatible endpoint.',
    },
    chat: {
      name: 'MAGI Chat',
      description:
        'A clean, fast AI chat assistant. Switch models mid-conversation, keep context, and manage history without friction.',
    },
    agent: {
      name: 'MAGI Agent',
      description:
        'Long-running AI agents with tool calling, persistent memory, and structured task decomposition for real workflows.',
    },
  },

  features: {
    eyebrow: 'Features',
    items: [
      {
        eyebrow: 'Performance',
        headline: 'Built for speed.',
        body: 'Cloudflare Edge network with 200+ cities. Average response time under 50ms anywhere on Earth.',
      },
      {
        eyebrow: 'Privacy',
        headline: 'Your data stays yours.',
        body: 'Transparent processing, full encryption in transit, and local-only modes for sensitive workloads.',
      },
      {
        eyebrow: 'Integration',
        headline: 'Plug into anything.',
        body: 'OpenAI-compatible API, first-class SDKs, and reference integrations — go live in minutes, not weeks.',
      },
      {
        eyebrow: 'Scale',
        headline: 'Scales without surprises.',
        body: 'Modular architecture that grows with you. Add a model, swap a provider, or extend with new endpoints without re-platforming.',
      },
    ],
  },

  about: {
    eyebrow: 'About',
    headline: 'Built by one.\nMaintained with care.',
    body: 'I am an independent developer focused on AI products and services. MAGI is named after the three-core supercomputer in Neon Genesis Evangelion — three systems reasoning together to reach the right answer.',
    tech: 'Tech',
    contact: 'Get in touch',
    emailLabel: 'Email',
    githubLabel: 'GitHub',
  },

  footer: {
    brand: 'MAGI',
    tagline: 'Personal AI Lab.',
    community: 'Community',
    resources: 'Resources',
    legal: 'Legal',
    docs: 'Documentation',
    status: 'Status',
    privacy: 'Privacy',
    terms: 'Terms',
    copyright: 'Copyright',
    brandName: 'MAGI',
    rights: 'All rights reserved.',
    contact: 'hi@magi.website',
  },
};

export default en;
