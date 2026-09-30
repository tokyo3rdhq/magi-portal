export type Locale = 'zh' | 'en';

export type TranslationTree = {
  nav: {
    products: string;
    features: string;
    documents: string;
    about: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subhead: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  products: {
    eyebrow: string;
    headline: string;
    subhead: string;
    api: { name: string; description: string };
    chat: { name: string; description: string };
    agent: { name: string; description: string };
  };
  features: {
    eyebrow: string;
    headline: string;
    items: Array<{ eyebrow: string; headline: string; body: string }>;
  };
  about: {
    eyebrow: string;
    headline: string;
    body: string;
    tech: string;
    contact: string;
    emailLabel: string;
    githubLabel: string;
  };
  footer: {
    brand: string;
    tagline: string;
    community: string;
    resources: string;
    legal: string;
    docs: string;
    status: string;
    privacy: string;
    terms: string;
    copyright: string;
    brandName: string;
    rights: string;
    contact: string;
  };
};
