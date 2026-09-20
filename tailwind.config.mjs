/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        terminal: {
          green: '#00ff41',
          dim: '#00aa2a',
          cyan: '#00ffff',
          magenta: '#ff00ff',
          yellow: '#ffaa00',
          red: '#ff0055',
        },
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'monospace'],
        display: ['Orbitron', 'sans-serif'],
      },
      animation: {
        'glow': 'pulse-glow 2s ease-in-out infinite',
        'blink': 'blink 1s step-end infinite',
        'glitch': 'glitch 3s infinite',
        'scan': 'scan 4s linear infinite',
      },
    },
  },
  plugins: [],
};
