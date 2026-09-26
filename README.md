# MAGI Portal

Personal AI Lab portal — static site at https://magi.website that links to three Cloudflare Edge services (API, Chat, Agent) operated by an independent developer.

## Stack

- [Astro 4](https://astro.build) — static site generator, zero JS by default
- [Tailwind CSS 3](https://tailwindcss.com) — utility-first styling with Apple-style design tokens (`bg-*`, `ink-*`, `accent`, `line-*`)
- [`@tokyo3rdhq/magi-design-system`](https://github.com/tokyo3rdhq/magi-design-system) — shared MAGI design system (CSS tokens + utility classes; consumed via `var(--magi-*)`)
- [TypeScript](https://www.typescriptlang.org) (strict)
- [Cloudflare Pages](https://pages.cloudflare.com) — edge deployment
- Inter (Google Fonts) with CJK fallback

## Develop

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run preview    # preview the build
```

## Deploy

Manual deploy via Wrangler:

```bash
npm run build
npx wrangler pages deploy dist --project-name=magi-portal
```

Cloudflare Pages build settings:
- Build command: `npm run build`
- Build output: `dist`
- Node version: 20

## Project layout

```
magi-portal/
├── public/                    static assets, copied verbatim to dist/
│   ├── skill.md               SKILL.md manifest for AI agents
│   ├── _headers               Cloudflare security headers + cache policy
│   ├── _redirects             Cloudflare route redirects
│   ├── favicon.svg, og-default.svg, robots.txt
├── src/
│   ├── layouts/Layout.astro   shell (head, sticky nav, footer, inline i18n)
│   ├── components/            Hero / Products / ProductCard / Features / About / MatrixBackground + seo/
│   ├── i18n/                  types.ts + locales/{en,zh}.ts + translations + locales-meta + index
│   ├── pages/                 index.astro + sitemap.xml.ts
│   └── styles/global.css      Tailwind layers + Apple-style component utilities
├── docs/plan.md               architecture and history
├── AGENTS.md                  AI assistant conventions (auto-loaded)
└── wrangler.toml              Cloudflare Pages config
```

## Services

| Subdomain | Service |
| --- | --- |
| https://api.magi.website | MAGI API — unified AI API gateway |
| https://chat.magi.website | MAGI Chat — AI chat assistant |
| https://agent.magi.website | MAGI Agent — long-running AI agents |

## Links

- [Astro docs](https://docs.astro.build)
- [Tailwind docs](https://tailwindcss.com/docs)
- [Cloudflare Pages docs](https://developers.cloudflare.com/pages/)

## License

MIT
