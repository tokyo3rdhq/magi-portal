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