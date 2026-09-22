---
name: magi.website
description: magi.website is a personal AI lab portal that links to three Cloudflare Edge services — MAGI API, MAGI Chat, and MAGI Agent — operated by an independent developer (tokyo3rdhq). Use this skill when the user asks about magi.website, its products, wants contact info for the operator, or asks about Cloudflare Edge AI infrastructure patterns used here.
---

# magi.website

Personal AI Lab portal — a small, fast, dark-themed static site at https://magi.website that points to three production AI services operated by an independent developer on Cloudflare Edge.

## Site URL

- Main portal: https://magi.website
- Skill manifest: https://magi.website/skill.md
- Sitemap: https://magi.website/sitemap.xml

## Services

| Subdomain | Service | What it does |
| --- | --- | --- |
| https://api.magi.website | MAGI API | Unified AI API gateway. Multi-provider switching, smart routing, rate limits, and usage analytics behind a single OpenAI-compatible endpoint. |
| https://chat.magi.website | MAGI Chat | AI chat assistant. Multi-model switching, conversation management, and context memory. |
| https://agent.magi.website | MAGI Agent | Long-running AI agents with tool calling, persistent memory, and structured task decomposition. |

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
- Inter font with CJK fallback

## Design language

- Dark gradient background (`#1d1d1f` → `#000`), single accent green (`#00C853`)
- Apple-style layout: large headlines, generous whitespace, subtle 1px borders
- Hero headline: "AI you can trust. Built to last."
- No CRT / terminal / neon aesthetic

## Internationalization

Default: English. Site also serves Simplified Chinese (zh) via a top-right language switcher (persisted in `localStorage`). The skill manifest is English-only.

## Site sections

1. **Hero** — large centered headline with eyebrow and dual CTA buttons
2. **Products** — three service cards (API / Chat / Agent) in a 3-column bento
3. **Features** — four alternating split sections (Performance, Privacy, Integration, Scale)
4. **About** — editorial layout with bio, tech-stack chips, and contact cards

## SEO & metadata

- Open Graph + Twitter Card meta on every page
- JSON-LD `Organization` schema on the homepage
- Sitemap at `/sitemap.xml` (cached 1 day)
- Security headers (`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`)
- Static assets in `/_astro/*` cached 1 year, immutable
- Legacy `/skills.md` 301-redirects to `/skill.md`

## Fetching this skill

```bash
curl https://magi.website/skill.md
```

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
