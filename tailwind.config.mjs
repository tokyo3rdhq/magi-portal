/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#000000',
          raised: '#1d1d1f',
          card: 'rgba(255, 255, 255, 0.04)',
        },
        ink: {
          primary: '#f5f5f7',
          secondary: '#86868b',
          tertiary: '#6e6e73',
        },
        accent: {
          DEFAULT: '#00c853',
          hover: '#00e676',
          soft: 'rgba(0, 200, 83, 0.08)',
        },
        line: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.14)',
        },
      },
      fontFamily: {
        sans: ['Inter', '"SF Pro Display"', '"PingFang SC"', '"Hiragino Sans GB"', 'system-ui', 'sans-serif'],
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
