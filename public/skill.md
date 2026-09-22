---
name: magi.website
description: magi.website is a personal AI lab portal providing AI API aggregation, AI chat, and AI Agent services built on Cloudflare Edge. Use this skill when the user asks about magi.website, its products (MAGI API / MAGI Chat / MAGI Agent), wants to integrate with any magi.website service, or needs contact info for the operator (tokyo3rdhq).
---

# magi.website

Personal AI Lab portal — terminal/CRT-themed dark site styled after the EVA MAGI supercomputer (Melchior / Balthasar / Caspar). Deployed on Cloudflare Pages as a static site.

## Site URL

- Main portal: https://magi.website
- Skill manifest: https://magi.website/skill.md
- Sitemap: https://magi.website/sitemap.xml

## Services (subdomains)

| Subdomain | Service | What it does |
| --- | --- | --- |
| https://api.magi.website | MAGI API | Unified AI API aggregation. Multi-provider switching, intelligent routing, rate limiting, usage statistics. OpenAI-compatible. |
| https://chat.magi.website | MAGI Chat | AI chat assistant. Multi-model switching, conversation management, context memory. |
| https://agent.magi.website | MAGI Agent | AI Agent service. Tool calling, long-term memory, complex task decomposition & execution. |

## When to use this skill

Trigger this skill when the user:

- Asks about magi.website, its products, or its services
- Wants to integrate with `api.magi.website`, `chat.magi.website`, or `agent.magi.website`
- Asks for contact info, GitHub, or operator details
- Asks about Cloudflare Edge AI infrastructure patterns used here

Do NOT trigger for unrelated AI platforms, generic LLM questions, or non-magi products.

## Operator contact

- GitHub: https://github.com/tokyo3rdhq
- Email: hi@magi.website
- Operator: independent developer focused on AI products and services

## Tech stack (the portal itself)

- Astro 4.x — static site generator, zero JS by default
- Tailwind CSS 3.x — utility-first styling
- TypeScript (strict)
- Cloudflare Pages — edge deployment
- JetBrains Mono + Orbitron fonts

## Design language

- Background: black `#0D0D0D`
- Primary: terminal green `#00FF41`
- Accents: cyan `#00FFFF`, magenta `#FF00FF`, amber `#FFAA00`
- Effects: CRT scan lines, blinking cursor, pulse-glow, glitch, matrix-rain background, mouse particle sparks

## Internationalization

Default: English. Site also serves Simplified Chinese (zh) via a top-right language switcher (persisted in `localStorage`). The skill manifest is English-only.

## Site sections

1. **Hero** — terminal boot sequence showing three MAGI cores online; links to products & contact
2. **Products** — three service cards (API / Chat / Agent)
3. **Features** — six technical features: high performance, privacy-first, easy integration, scalable, cost-effective, global availability
4. **About** — developer bio + MAGI three-core visualization + tech-stack chips

## SEO & metadata

- Open Graph + Twitter Card meta on every page
- JSON-LD `Organization` schema
- Sitemap at `/sitemap.xml` (cached 1 day)
- Security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`)
- Static assets in `/_astro/*` cached 1 year, immutable

## Fetching this skill

```bash
curl https://magi.website/skill.md
```

Legacy path `/skills.md` 301-redirects to `/skill.md`.

## Local development (for the portal)

```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs to dist/
npm run preview    # preview build
```

Deploy:

```bash
npm run build
npx wrangler pages deploy dist --project-name=magi-portal
```
