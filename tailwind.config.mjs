/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: 'var(--magi-bg-base)',
          raised: 'var(--magi-bg-raised)',
          card: 'var(--magi-bg-card)',
          'card-hover': 'var(--magi-bg-card-hover)',
        },
        ink: {
          primary: 'var(--magi-text-primary)',
          secondary: 'var(--magi-text-secondary)',
          tertiary: 'var(--magi-text-tertiary)',
        },
        accent: {
          DEFAULT: 'var(--magi-accent)',
          hover: 'var(--magi-accent-hover)',
          soft: 'var(--magi-accent-soft)',
        },
        line: {
          DEFAULT: 'var(--magi-border)',
          strong: 'var(--magi-border-strong)',
        },
      },
      fontFamily: {
        sans: [
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          'system-ui',
          'sans-serif',
        ],
      },
      letterSpacing: {
        tightest: '-0.045em',
        tighter: '-0.03em',
      },
      /* Apple-style radius scale (audit F-010, option (b) — document).
 *
 * magi-portal uses Apple's tighter radii (14 / 20 / 28) for the product
 * surface language, distinct from --magi-radius-{md,lg,xl,full} in the
 * design system (6 / 10 / 16 / 9999). The values were intentionally
 * chosen to match the Apple aesthetic and are product-specific.
 *
 * Sites that currently use these classes:
 *   rounded-full  — buttons + chips (matches --magi-radius-full)
 *   rounded-xl    — lang dropdown (Layout.astro) + contact cards (About)
 *   rounded-2xl   — card-surface (.card-surface global utility) +
 *                   feature visual tiles (Features.astro)
 *
 * If the design system ever adds an "Apple radius" tier, migrate.
 * Otherwise keep this scale product-owned per docs/plan.md. */
borderRadius: {
  xl: '14px',
  '2xl': '20px',
  '3xl': '28px',
},
      maxWidth: {
        prose: '720px',
        wide: '980px',
        page: '1200px',
      },
    },
  },
  plugins: [],
};