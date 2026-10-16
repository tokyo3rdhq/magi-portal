/**
 * Site link configuration — single source of truth for every external
 * URL the portal links to, plus the UTM convention for outbound
 * product traffic (see docs discussion 2026-10-16).
 *
 * Design decisions:
 * - Base URLs stay clean here. UTM parameters are appended at render
 *   time via `withUtm()` so the config never carries tracking state
 *   and shared/copied links stay pristine.
 * - Only cross-domain product entry points get UTM. Community/social
 *   links (GitHub/Discord) point at third-party properties we don't
 *   instrument, so tagging them adds noise without a measurable
 *   counterpart.
 * - Internal anchors (#products) and internal routes (/docs) stay in
 *   their components — they are page structure, not configuration.
 */

export type ProductKey = 'api' | 'chat' | 'agent' | 'tokenFactory';

export interface ProductLink {
  key: ProductKey;
  /** Clean destination URL, no tracking params. */
  url: string;
  /** i18n key namespace under `products.*`. */
  i18nKey: string;
  status: 'active' | 'coming-soon';
}

/** Outbound product entry points rendered on the homepage. */
export const productLinks: ProductLink[] = [
  { key: 'tokenFactory', url: 'https://start.magi.website/', i18nKey: 'tfi', status: 'active' },
  { key: 'api', url: 'https://api.magi.website', i18nKey: 'api', status: 'active' },
  { key: 'chat', url: 'https://chat.magi.website', i18nKey: 'chat', status: 'active' },
  { key: 'agent', url: 'https://agent.magi.website', i18nKey: 'agent', status: 'active' },
];

/** Community / support links (footer + About). Intentionally untracked. */
export const communityLinks = {
  github: 'https://github.com/tokyo3rdhq',
  discord: 'https://discord.gg/gTGnvTdyec',
  email: 'mailto:hi@magi.website',
} as const;

/**
 * Append UTM parameters to an outbound product URL.
 *
 * Values follow the convention `utm_source=magi-portal`,
 * `utm_medium=referral`, campaign scoped per product.
 */
export function withUtm(
  url: string,
  opts: { source?: string; medium?: string; campaign?: string; content?: string } = {},
): string {
  const { source = 'magi-portal', medium = 'referral', campaign, content } = opts;
  const params = new URLSearchParams({ utm_source: source, utm_medium: medium });
  if (campaign) params.set('utm_campaign', campaign);
  if (content) params.set('utm_content', content);
  const [base, hash = ''] = url.split('#');
  const joiner = base.includes('?') ? '&' : '?';
  return `${base}${joiner}${params.toString()}${hash}`;
}

/** Convenience: homepage TFI bento card link. */
export function tfiLink(): string {
  return withUtm(productLinks[0].url, {
    campaign: 'homepage',
    content: 'products-tfi-card',
  });
}

/** Convenience: homepage product grid card link. */
export function productCardLink(key: Exclude<ProductKey, 'tokenFactory'>): string {
  const product = productLinks.find((p) => p.key === key);
  if (!product) throw new Error(`Unknown product key: ${key}`);
  return withUtm(product.url, {
    campaign: 'homepage',
    content: `products-${key}-card`,
  });
}
