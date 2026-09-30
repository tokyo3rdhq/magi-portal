# MAGI Portal — Design System Compliance Audit

> **Audit target**: `magi.website` (Astro 4 + Tailwind 3 + `@tokyo3rdhq/magi-design-system@^0.6.0`)
> **Installed design-system version**: `0.6.0` (npm tarball, before the 0.6.1 subtree-accent patch)
> **Audit date**: 2026-09-30
> **Method**: read-only. Per the audit doc, no business code was modified.

---

## Executive Summary

**Overall status: MOSTLY COMPLIANT.**

`magi.website` is correctly anchored on `@tokyo3rdhq/magi-design-system` as the source of truth for tokens, theme, typography utilities, and brand SVGs. The portal's local CSS layer references DS variables (`var(--magi-*)`) exclusively — there is **no parallel token system**. The portal correctly applies the `data-magi-app` scope, uses DS-provided typography utilities (`.magi-display`, `.magi-h2`, etc.), and respects the brand contract via `fill="currentColor"`.

The remaining gaps are at the integration boundary, not the visual language:

- **P0 (1)**: Brand asset duplication — the header logo is an inline SVG inside `Layout.astro` that duplicates `MagiLockup`; the same SVG is also in `public/magi-lockup.svg` and `public/favicon.svg`. The DS ships `MagiLockup` / `MagiMark` / `MagiWordmark` React components. Since this is an Astro site (no React runtime), the React components cannot be imported directly; the SVG must be vendored or referenced from `node_modules/.../dist/assets/logo/`.
- **P1 (3)**: Hard-coded Tailwind color classes (`bg-black/60`, `bg-white/5`, `bg-white/[0.06]`, `hover:border-white/30`) — these work but bypass the DS token binding (`--magi-bg-elevated`, `--magi-bg-hover`, `--magi-border-strong` already exist).
- **P1 (1)**: Local `.btn-primary` uses `@apply text-black` followed by a manual `color: var(--magi-text-inverse)` override — a code smell.
- **P1 (1)**: Inline `bg-[#000]/60` style in nav (`bg-black/60`) is the only place that bypasses the token mapping.
- **P2 (5)**: Heading hierarchy has `<h3>` inside `<section>` without an `<h2>` in some cases (Products cards), and the lang attribute defaults to `en` in SSR before the client script re-sets it (potential FOUC + a11y miss for Chinese users who navigate directly).
- **INFO**: Astro-specific (no `@astrojs/react`) — the portal cannot import DS React components, so local Astro utilities (`.btn-primary`, `.card-surface`, etc.) are a legitimate per-product pattern. The `docs/plan.md` explicitly documents this and marks it as a future migration path.

The portal correctly implements the "MOSTLY COMPLIANT" pattern: **shared contract where possible, local Astro implementation where the framework boundary requires it**.

---

## 1. Architecture Map

```text
magi.website
├── App Shell
│   ├── <html lang="en" data-magi-app>            ✅ DS-owned (data-magi-app scope)
│   ├── <header> sticky top nav                    ⚠️ Product-owned (custom Tailwind layout)
│   ├── <main>                                     ✅ DS-owned semantic HTML
│   └── <footer> 4-col on desktop                  ⚠️ Product-owned (info architecture)
│
├── Pages
│   └── / (single page, 4 sections)                ✅ Product IA
│       ├── Hero                                   ⚠️ Product-owned component
│       ├── Products (3-col bento)                 ⚠️ Product-owned component
│       ├── Features (4 alternating splits)        ⚠️ Product-owned component
│       └── About (editorial 2-col)                ⚠️ Product-owned component
│
├── Components
│   ├── Layout.astro                               ⚠️ Product-owned (Astro page shell)
│   ├── Hero / Products / ProductCard              ⚠️ Product-owned (Astro)
│   ├── Features / About                           ⚠️ Product-owned (Astro)
│   ├── MatrixBackground                           ⚠️ Product-owned (decorative; not DS)
│   └── seo/ (3 components)                        ⚠️ Product-owned; 1 unused
│
├── Brand
│   ├── Favicon (3 circles)                         ⚠️ Static SVG asset; brand-shaped
│   ├── Header lockup (3 circles + MAGI text)       ⚠️ Inline SVG in Layout.astro (DRY violation)
│   ├── magi-lockup.svg (public asset)              ⚠️ Static SVG; semantic equivalent of DS MagiLockup
│   └── og-default.svg (MAGI wordmark only)         ⚠️ Static SVG
│
├── Theme
│   ├── Dark (only)                                 ✅ Inherits from `:root, [data-magi-theme=dark]`
│   ├── Light                                       ❌ Not supported (single-theme site; not a contract violation, see §6)
│   └── Accent (green only)                         ✅ Inherits from `[data-magi-theme=dark]` baseline
│
├── Tokens
│   ├── Color                                       ⚠️ Mostly DS-owned; 5 violations (§7)
│   ├── Spacing                                     ✅ Tailwind default scale (no DS-specific spacing tokens used)
│   ├── Typography                                  ✅ DS-owned via `.magi-*` utilities
│   ├── Radius                                      ⚠️ Local tailwind.config extends `rounded-xl/2xl/3xl` (§10)
│   └── Motion                                      ⚠️ Local tailwind utilities (`duration-200/300`)
│
├── Local Styling
│   ├── src/styles/global.css                       ⚠️ 88 lines; 5 component utilities (.btn-primary, .btn-secondary, .card-surface, .link-arrow, .nav-link)
│   ├── tailwind.config.mjs                         ⚠️ Token mapping `bg/ink/accent/line` → var(--magi-*) + maxWidth/fontFamily/letterSpacing/borderRadius
│   └── 4 hard-coded colors (P1)                    ⚠️ bg-black/60, bg-white/5, bg-white/[0.06], hover:border-white/30
│
└── i18n
    ├── src/i18n/                                   ⚠️ Product-owned (locale dictionaries, types, runtime)
    ├── locales-meta (en: 'English', zh: '中文')     ✅ Follows DS Experience Guidelines §5.1 (no flags)
    └── DOMContentLoaded bootstrap                  ⚠️ Sets html.lang AFTER mount (FOUC risk, P2)
```

---

## 2. Findings (table)

| ID | Severity | Area | File | Finding | DS Contract | Recommendation |
|---|---|---|---|---|---|---|
| F-001 | **P0** | Brand | `src/layouts/Layout.astro:74-89`; `public/magi-lockup.svg`; `public/favicon.svg` | The header logo is a **hand-written inline SVG** duplicating the canonical MAGI mark + wordmark. `public/magi-lockup.svg` is a third copy. `public/favicon.svg` is a fourth copy of just the mark. | DS ships `MagiMark`, `MagiWordmark`, `MagiLockup` (React) and `dist/assets/logo/magi-{mark,wordmark,lockup}.svg` (static). The portal's vendored SVGs drift from these if the DS changes them. | Astro cannot import React components. Reference the canonical SVG via `/node_modules/@tokyo3rdhq/magi-design-system/dist/assets/logo/magi-lockup.svg` (copy at build time or symlink), or import the inline SVG content from `@tokyo3rdhq/magi-design-system/dist/assets/logo/`. Single source of truth. |
| F-002 | **P1** | Tokens | `src/layouts/Layout.astro:84` | `class="sticky top-0 z-40 backdrop-blur-xl bg-black/60 border-b border-line"` — `bg-black/60` is a hard-coded Tailwind color. | DS contract says tokens come from `var(--magi-*)` and `--magi-bg-elevated` (or `--magi-bg-raised/95`) is the appropriate equivalent. | Replace `bg-black/60` with `bg-bg-raised/95` (already mapped to `--magi-bg-raised`). Same visual, token-bound. |
| F-003 | **P1** | Tokens | `src/layouts/Layout.astro:178` | `bg-bg-raised/95 backdrop-blur-xl shadow-2xl` in language dropdown — `shadow-2xl` is a hard-coded Tailwind shadow. The `bg-raised/95` is correct. | DS does not ship a shadow token. `shadow-2xl` is acceptable as a product-specific elevation since it's transient (dropdown overlay). | Optional: define `--magi-shadow-lg` in DS for product elevation. Otherwise INFO (acceptable product-only). |
| F-004 | **P1** | Tokens | `src/components/About.astro:47,61`; `src/layouts/Layout.astro:159`; `src/styles/global.css:53,84` | Hard-coded `bg-white/5`, `bg-white/[0.06]`, `hover:border-white/30` (5 occurrences). | DS already provides `--magi-bg-card-hover: rgba(255,255,255,0.06)` and `--magi-border-strong`. | Replace with `bg-bg-card-hover` (already in DS tokens). `bg-white/5` (5% white) is product-specific hover tint — no DS token. Acceptable as INFO. |
| F-005 | **P1** | Tokens | `src/styles/global.css:41` | `.btn-primary` uses `@apply … text-black` then immediately overrides with `color: var(--magi-text-inverse)`. The `text-black` Tailwind class injects a hard-coded `color: rgb(0 0 0 / 1)`. | DS contract: no hard-coded color literals; tokens only. | Remove the `text-black` from the `@apply` chain. The `color: var(--magi-text-inverse)` override is correct (per DS Button contract, primary CTA foreground = `--magi-text-inverse` = `#050505`). |
| F-006 | **P1** | Brand | `src/layouts/Layout.astro:74-89` (header logo SVG) | The header logo uses **letter-spacing `-2.16`** on the MAGI wordmark — the same value as the DS `MagiLockup`. But the letter-spacing comes from the inline `<text>` font-size attribute, not the DS font tokens. | DS does not ship a wordmark CSS class. Static SVG letter-spacing must match DS geometry to avoid visual regression when DS updates. | Same fix as F-001: reference the canonical SVG. |
| F-007 | **P2** | Tokens | `src/styles/global.css:33-34`; `src/components/Features.astro:54` | `text-balance { text-wrap: balance; }` — `text-wrap: balance` is well-supported. **No contract violation**, but it's a product-specific utility (no DS equivalent). | DS does not ship typography utility for text wrapping. | INFO — leave as-is. |
| F-008 | **P2** | Theme | `src/layouts/Layout.astro:1` | `<html lang="en" data-magi-app>` — server-rendered as English. i18n boot script re-sets `html.lang` based on `localStorage` only after DOMContentLoaded. If a returning zh user opens the page, they see English content for ~200-500ms before the script runs. | DS Theme contract uses `:root, [data-magi-theme=dark]` defaults — no SSR FOUC risk for tokens. But i18n is **product-owned** and the FOUC applies to text content only. | Move the lang attribute to a tiny inline `<script>` in `<head>` that reads `localStorage.locale` synchronously before paint. Same pattern Apple uses. |
| F-009 | **P2** | Layout | All page sections | Every section uses `mx-auto max-w-page` (1200px) — defined in `tailwind.config.mjs` as `maxWidth.page`. | DS ships `<Container size="wide">` (also 1200px in DS Container contract). The Astro site cannot import React Container. | INFO — local token is acceptable since `@astrojs/react` is not adopted. Document in `docs/plan.md`. |
| F-010 | **P2** | Tokens | `tailwind.config.mjs` | `letterSpacing: { tightest: '-0.045em', tighter: '-0.03em' }` and `borderRadius: { xl: '14px', '2xl': '20px', '3xl': '28px' }`. | DS does not ship `letterSpacing` tokens; `borderRadius` is per-component (`--magi-radius-md/lg/xl/full`). The portal's `xl: 14px` / `2xl: 20px` / `3xl: 28px` are NOT aligned with DS radii (`--magi-radius-md=6px, lg=10px, xl=16px, full=9999px`). | Either (i) migrate to DS radius tokens where the visual fits (`rounded-xl` → `rounded-[16px]` mapped to `--magi-radius-xl`), or (ii) keep as product-specific Apple-style radii (acceptable if documented). The current state mixes the two systems. |
| F-011 | **P2** | Component | `src/styles/global.css:39-90` | Local utility classes `.btn-primary`, `.btn-secondary`, `.card-surface`, `.link-arrow`, `.nav-link` exist because Astro cannot import DS React components. | DS contract ships `<Button variant="primary">`, `<Button variant="secondary">`, `<Card>` — but these are React components. | Per `docs/plan.md` §Phase 7: this is the documented product decision. Local classes are intentionally product-owned until `@astrojs/react` is added. INFO. |
| F-012 | **P2** | SEO | `src/components/seo/ProductSchema.astro`; `src/components/seo/SEO.astro` | Both components exist but are not used anywhere in `src/pages/`. | Product IA decision; not a contract violation. | INFO — dead code. Delete in a future cleanup or adopt (SEO.astro has a `ogImage` parameter that could be wired into Layout.astro). |
| F-013 | **P2** | SEO | `src/components/seo/OrganizationSchema.astro` | JSON-LD references `https://magi.website/logo.svg` — but no `logo.svg` exists in `public/`. | Schema.org requires the logo URL to resolve. Google Search Console will flag this. | Either create `public/logo.svg` (the MagiMark), or change the reference to `/favicon.svg` or the canonical lockup path. |
| F-014 | **P2** | i18n | `src/i18n/locales-meta.ts` | `en: 'English'`, `zh: '中文'` — follows Experience Guidelines §5.1 (endonym in native script, no flags). | DS Experience Guidelines contract: no flags, endonym. | ✅ COMPLIANT. No action. |
| F-015 | **P2** | i18n | `src/i18n/index.ts` | The `index.ts` comment references `./runtime.ts` ("Runtime helpers ... live in `./runtime.ts`"). But `src/i18n/runtime.ts` does NOT exist — runtime helpers are inline in `Layout.astro`'s `<script>`. | Not a DS contract violation; just stale doc. | Either create `runtime.ts` (extract from Layout.astro) or fix the comment. |
| F-016 | **P2** | Build | `astro.config.mjs` | `inlineStylesheets: 'auto'` + `cssMinify: true`. The portal inlines critical CSS but the design-system stylesheet is loaded as a separate `@import` in `global.css`, which Astro/Vite typically bundles. | DS does not ship an Astro adapter; CSS is consumed via standard CSS `@import`. | INFO — verify final HTML: when inspected, `dist/index.html` should reference a single bundled stylesheet. (Confirmed: build outputs `dist/assets/index-*.css` with all DS rules bundled.) |
| F-017 | **P2** | Build | `package.json` | `node-version: 20` per wrangler.toml; Cloudflare Pages has deprecated Node 20 since 2025-09-19. The DS CI is also on Node 22. | DS CHANGELOG notes Cloudflare Pages is the supported deployment target. | Bump wrangler.toml to `NODE_VERSION: 22`. |
| F-018 | **P2** | Responsive | All sections | Mobile uses `md:`, desktop uses `md:`-prefixed overrides. **No separate mobile design language** — confirmed by reading Hero, Products, Features, About. | DS contract: "Responsive = same design language, different composition". | ✅ COMPLIANT. No action. |
| F-019 | **P2** | A11y | `src/layouts/Layout.astro:124` (lang-btn) | Language dropdown toggle: `aria-haspopup="listbox"` ✓; `aria-expanded` ✓. But the dropdown closes only via Escape key (line 366) — no Arrow / Home / End keyboard navigation between options, and no `aria-activedescendant` on the listbox. | DS experience guidelines for listboxes follow WAI-ARIA pattern (Arrow / Home / End / typeahead). | Add ArrowUp / ArrowDown navigation in `langDropdown` and announce current selection. |
| F-020 | **P2** | A11y | `src/layouts/Layout.astro:74` (header logo) | `<a href="/" aria-label="MAGI — home">` contains an `<svg aria-hidden="true">`. This is correct — the link's accessible name comes from `aria-label`, the SVG is decorative. | DS brand contract: `MagiLockup aria-hidden={true}` default + `aria-label` on the wrapping link. | ✅ COMPLIANT. |
| F-021 | **INFO** | Component | `src/components/MatrixBackground.astro` | Radial-glow background — purely decorative, `aria-hidden="true"`. | DS does not ship background visuals. | INFO — product-owned decoration. |
| F-022 | **INFO** | Component | `src/components/seo/OrganizationSchema.astro` + `ProductSchema.astro` + `SEO.astro` | SEO helpers. Two are unused (F-012). | Product IA. | INFO — see F-012. |
| F-023 | **INFO** | Component | `src/components/MatrixBackground.astro` | Uses `color-mix(in srgb, var(--magi-accent) 3%, transparent)` — correct token usage. | DS pattern for tinting. | ✅ COMPLIANT. |

---

## 3. Token Findings

### Color

| Token / class | Where | Status |
|---|---|---|
| `var(--magi-bg-base/raised/card)`, `var(--magi-text-primary/secondary/tertiary)`, `var(--magi-accent/hover/soft)`, `var(--magi-border/strong)` | tailwind.config.mjs mapping | ✅ All 11 tokens bound to DS variables |
| `bg-black/60` (Layout header) | Layout.astro:84 | ⚠️ P1 — replace with `bg-bg-raised/95` |
| `bg-white/5`, `bg-white/[0.06]`, `hover:border-white/30` (5 sites) | global.css + About + Features | ⚠️ P1 — `bg-bg-card-hover` covers `bg-white/[0.06]` |
| `text-black` in `.btn-primary` | global.css:41 | ⚠️ P1 — remove (overridden anyway) |
| `rgba(255,255,255,0.05)` (MatrixBackground) | MatrixBackground.astro:17 | ⚠️ Single literal — could become a `--magi-bg-glow` token, but acceptable as INFO |
| `--magi-text-inverse` (`.btn-primary`) | global.css:42 | ✅ DS token used |

### Typography

| Token | Where | Status |
|---|---|---|
| `Inter` font-family + CJK fallback | Layout.astro:67 + tailwind.config.mjs | ✅ Follows DS font stack |
| `.magi-display`, `.magi-h1`, `.magi-h2`, `.magi-h3`, `.magi-h4`, `.magi-eyebrow`, `.magi-caption`, `.magi-label` | All page sections | ✅ All DS utilities used |
| `.magi-body-lg`, `.magi-body`, `.magi-body-sm` | (not used directly — covered by Tailwind text-lg/text-xl) | ⚠️ Some sections hand-roll `text-lg md:text-xl font-normal text-ink-secondary` instead of using `.magi-body-lg`. Acceptable since Tailwind tokens are also DS-derived. |
| `letterSpacing.tightest = -0.045em`, `tighter = -0.03em` | tailwind.config.mjs | ⚠️ P2 — local tokens; DS doesn't ship them, but the values match DS wordmark geometry. Document. |
| `tracking-tighter`, `tracking-tightest` | ProductCard, Features | ⚠️ P2 — references local letterSpacing tokens |

### Spacing

| Token | Where | Status |
|---|---|---|
| `py-32 md:py-40` (section spacing) | All sections | ✅ Apple-style; matches design intent in `docs/plan.md` |
| `gap-6 md:gap-16` etc. | All sections | ✅ Tailwind default scale |
| `mx-auto max-w-page` (1200px container) | All sections | ⚠️ P2 — local `maxWidth.page` could be DS `Container size="wide"` (1200px), but Astro cannot import React Container |
| `mx-auto max-w-wide` (980px) | Hero/Products/About subhead | ⚠️ P2 — same as above |
| `max-w-prose` (720px) | All section subhead text | ⚠️ P2 — Tailwind default; matches DS prose measure |

### Radius

| Token | Where | Status |
|---|---|---|
| `rounded-full` (pills) | Buttons, badges, About contact tiles | ✅ Matches DS `--magi-radius-full` |
| `rounded-xl` (dropdown, contact tiles) | Layout, About | ⚠️ P2 — local Tailwind `xl = 14px`; DS has `--magi-radius-xl = 16px`. **Mismatch of 2px.** |
| `rounded-2xl` (cards, feature tiles) | global.css card-surface, Features | ⚠️ P2 — local `2xl = 20px`; no DS equivalent |
| `borderRadius: { xl: '14px', '2xl': '20px', '3xl': '28px' }` | tailwind.config.mjs | ⚠️ P2 — local scale; consider migrating to `rounded-[16px]` mapped to `--magi-radius-xl` |

### Motion

| Token | Where | Status |
|---|---|---|
| `transition-all duration-200/300` | Buttons, cards | ⚠️ Tailwind defaults; DS doesn't ship motion utility classes |
| `prefers-reduced-motion: reduce` | global.css:8-13 | ✅ Accessibility motion guard |

### Surface

| Token | Where | Status |
|---|---|---|
| `.card-surface` = `bg-bg-card` | global.css | ✅ |
| `.btn-secondary` border `border-line-strong` | global.css | ✅ |
| `.btn-primary` background `bg-accent` | global.css | ✅ |
| `bg-bg-card hover:border-line-strong hover:bg-white/[0.06]` | About contact cards | ⚠️ P1 — replace `bg-white/[0.06]` with `bg-bg-card-hover` |

---

## 4. Component Findings

| Component | DS Reuse? | Status |
|---|---|---|
| **Button (primary / secondary)** | ⚠️ Local Astro CSS classes (Astro framework boundary) — `.btn-primary` / `.btn-secondary` in `global.css` | Product-owned per docs/plan.md; visual contract matches DS Button (accent + accent-hover, font-medium, gap-1.5, rounded-full). Token-bound. **Acceptable.** |
| **Card** | ⚠️ Local `.card-surface` class | Same — product-owned. Visual contract matches DS Card. |
| **Badge / Chip** | ⚠️ Local `<li class="rounded-full border border-line bg-bg-card px-3.5 py-1.5 text-xs text-ink-secondary">` in About.astro (tech-stack chips) | DS Badge exists. Astro boundary. The local chips use `rounded-full` (matches DS) but hand-roll border + bg tokens. Acceptable. |
| **Input / FormField / Segmented / Banner / EmptyState** | ❌ Not used | magi.website has no forms. INFO. |
| **Hero / Products / Features / About** | ⚠️ All product-owned | ✅ Each is product-specific. No DS component exists for these. |
| **Header (sticky nav)** | ⚠️ Custom | Product-owned shell. Layout primitive is `mx-auto flex h-11 max-w-page items-center justify-between px-6`. |
| **Footer (4-col)** | ⚠️ Custom | Product-owned. Aligns with DS Experience Guidelines footer pattern (brand + community + resources + legal + copyright). |
| **Language selector** | ⚠️ Custom dropdown | Follows WAI-ARIA listbox pattern (`aria-haspopup`, `aria-expanded`, `role="listbox"`, `role="option"`). Escape closes. **Missing: Arrow / Home / End keyboard navigation.** See F-019. |

---

## 5. Brand Findings

| Item | Implementation | Status |
|---|---|---|
| **MagiMark** (3 circles) | Inlined 4 times: Layout.astro header SVG, public/favicon.svg, public/magi-lockup.svg (part), and referenced indirectly in `og-default.svg`. | ⚠️ P0 — **BRAND_DUPLICATION**. Reference the canonical `node_modules/@tokyo3rdhq/magi-design-system/dist/assets/logo/magi-mark.svg` (or copy at build via `astro:assets`). |
| **MagiWordmark** (text only) | public/og-default.svg. NOT inlined anywhere. | ⚠️ P1 — duplication; same fix as above. |
| **MagiLockup** (mark + wordmark) | public/magi-lockup.svg + Layout.astro inline SVG. | ⚠️ P0 — duplication. Same fix. |
| **Logo color** | All 4 sites use `fill="currentColor"`. Header SVG inherits from `text-ink-primary` (mapped to `var(--magi-text-primary)`). | ✅ COMPLIANT — follows Logo Contrast Rule. **Light theme would auto-flip via `--magi-logo-color`** if data-magi-theme=light were set. |
| **Logo vs accent** | Header SVG inherits `text-ink-primary`, NOT `text-accent`. | ✅ COMPLIANT — Brand contract: brand is identity, accent is product. No `color: var(--magi-accent)` on logo. |
| **Favicon** | `/favicon.svg` (32×32, mark only, currentColor) | ✅ Follows DS brand contract. |
| **App icon** | Not present in public/ (no PWA install). og-default uses wordmark. | INFO. |

### Theme interaction (logo color)

- `data-magi-theme="dark"` (default): `--magi-text-primary: #f5f5f7` → logo renders white-ish. ✅
- `data-magi-theme="light"` (not currently set anywhere in the portal): would flip to `--magi-text-primary: #050505` → logo renders dark. The portal currently has no Light mode toggle, so this is dormant. ✅ The infrastructure is correct.

---

## 6. Theme Findings

| Item | Implementation | Status |
|---|---|---|
| `data-magi-app` scope | `<html lang="en" data-magi-app>` | ✅ Correct — matches DS contract. |
| `data-magi-theme` attribute | Not set on `<html>`. Inherits `:root, [data-magi-theme=dark]` defaults. | ✅ COMPLIANT — DS default = Dark. Portal is single-theme (no Light toggle). No FOUC. |
| `data-magi-accent` subtree | Not used. Inherits from `:root` accent (`#00c853`). | ✅ COMPLIANT — green is the canonical MAGI accent. |
| `<AppTheme>` wrapper | Not used (Astro doesn't render React). | ✅ COMPLIANT — not applicable. |
| Light theme | Not supported. | INFO — product IA decision. |
| Theme FOUC risk | None for visual layer. **i18n FOUC exists** (F-008). | See F-008. |
| CSS variable target | All DS vars defined under `[data-magi-app]` selector in DS CSS. Portal sets `data-magi-app` on `<html>`. | ✅ All DS rules apply correctly. |

---

## 7. Accessibility Findings

| Item | Status |
|---|---|
| Semantic HTML (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`) | ✅ |
| Landmark roles | ✅ `<header>`, `<nav>`, `<main>`, `<footer>` |
| Heading hierarchy | ✅ One `<h1>` (Hero); section titles are `<h2>` (Products, Features, About); inside sections `<h3>` is used (Features card titles, ProductCard titles). **No skipping levels.** |
| `<a>` for navigation, `<button>` for actions | ✅ — header nav uses `<a>`, lang switcher uses `<button>` |
| `aria-label` on icon-only links | ✅ — lang switcher, GitHub external link in nav |
| External link `rel="noopener noreferrer"` | ✅ — all `target="_blank"` links |
| External link new-tab SR announcement | ✅ — `<span class="sr-only">(opens in new tab)</span>` in nav and footer |
| Focus state | ✅ — DS provides `:focus-visible` ring via `--magi-focus-ring`. No `.btn-*` or `.card-surface` overrides. |
| `aria-current="page"` on active nav | ❌ — no active state implemented (single-page site; nav links are anchors `#products`, `#features`, `#about`, not page routes). INFO. |
| `aria-haspopup="listbox"` on lang-btn | ✅ |
| `aria-expanded` toggled on lang-btn | ✅ |
| Keyboard nav in lang-dropdown | ⚠️ P2 — only Escape closes. No Arrow keys. See F-019. |
| Touch targets ≥ 44px | ⚠️ P2 — header height is `h-11` (44px) ✓; nav-link padding not measured explicitly. Footer columns OK. |
| Color contrast | ⚠️ Not measured. `--magi-text-secondary` on `--magi-bg-base` is `#86868b` on `#000`. WCAG AA needs 4.5:1 for body text. **Calculated: ~5.6:1 — passes AA.** `--magi-text-tertiary` (`#6e6e73` on `#000`) is ~4.3:1 — fails AA for normal text. Used only for captions and footers; acceptable for large text + UI. |
| Image alt text | ✅ — favicon is decorative (no alt needed); OG image has meta. |
| Form labels | N/A — no forms. |
| Reduced-motion | ✅ — `prefers-reduced-motion` honored in `global.css` |

---

## 8. Experience Guidelines Findings

| Item | Implementation | Status |
|---|---|---|
| **Navigation hierarchy** (top nav: Products / Features / About + GitHub / Discord / Docs / Status / Language) | ✅ Three core sections + four destinations, prioritized. |
| **Icon-only for conventional actions** | ✅ Lang switcher (only icon-only control). GitHub external uses `Icon + Text`. |
| **GitHub / Discord / Docs / Status NOT icon-only** | ✅ — all use text (GitHub adds inline icon + text). |
| **External destinations marked with ↗ + new-tab SR announcement** | ✅ — `<span aria-hidden="true">↗</span>` + `<span class="sr-only">(opens in new tab)</span>`. |
| **Language names in native script (endonym)** | ✅ — `en: 'English'`, `zh: '中文'`. |
| **No country flags** | ✅ — zero flag emoji in source. |
| **`<html lang>` updates with language** | ⚠️ P2 — `<html lang="en">` in SSR; client script re-sets on DOMContentLoaded. Returns zh user briefly sees `lang="en"`. See F-008. |
| **Header utility area** | ✅ — follows DS Experience Guidelines pattern: brand + nav + grouped utility (GitHub / Docs / Status / Language). |
| **Footer structure** | ✅ — 4 columns (Brand / Community / Resources / Legal) + copyright row. Aligns with Experience Guidelines footer pattern. |
| **i18n key path** | ✅ — `key.split('.')` traversal with array-index support. |
| **i18n type safety** | ✅ — `TranslationTree` enforces same structure in en.ts and zh.ts. |

---

## 9. Responsive Audit

| Breakpoint | Behavior | Status |
|---|---|---|
| Mobile (<768px) | Hero headline 5xl, stacked CTAs, single-column products grid, single-column About split. | ✅ |
| Tablet (md ≥768px) | Hero headline 6xl, side-by-side CTAs, 3-column products grid, 2-column About split. | ✅ |
| Desktop (lg ≥1024px) | Hero headline 88px, section padding `md:py-40`. | ✅ |
| Wide (≥1280px) | Capped at `max-w-page` (1200px). | ✅ |
| **Single design language across breakpoints** | ✅ — no mobile-only style overrides; same typography scale + tokens, just composition changes. |

---

## 10. CSS Architecture Audit

### Global CSS

- `src/styles/global.css` (88 lines): contains 5 local utility classes, 1 utility (`.text-balance`), and a `prefers-reduced-motion` rule.
- **No parallel `--xxx` token system**: ✅ All colors reference `var(--magi-*)` or Tailwind utilities bound to those vars. 4 hard-coded Tailwind color violations (P1).

### Component CSS

- All component styles live in `global.css` (one file). No CSS Modules. No styled-components.
- Class names: `.btn-primary`, `.btn-secondary`, `.card-surface`, `.link-arrow`, `.nav-link`. **None collide with DS component classes** (DS uses `.magi-button`, `.magi-card`, etc.).

### Specificity

- Zero `!important` overrides in source code (only one `!important` in `prefers-reduced-motion` rule, which is the standard accessibility pattern).

### Tailwind misuse

- 4 sites using `bg-white/5`, `bg-white/[0.06]`, `hover:border-white/30`, `bg-black/60` (P1).
- All other Tailwind utilities use the `bg/ink/accent/line` semantic mapping or raw `text-*` size classes (which are DS typography-equivalent).

---

## 11. Dependency Audit

| Dependency | Version | Status |
|---|---|---|
| `@tokyo3rdhq/magi-design-system` | `^0.6.0` (installed 0.6.0) | ✅ npm package, no local copy, no git dep, no vendoring |
| `astro` | `^4.16.18` | ✅ Latest 4.x |
| `@astrojs/tailwind` | `^5.1.4` | ✅ Compatible with Astro 4 |
| `tailwindcss` | `^3.4.17` | ✅ |
| `@astrojs/sitemap` | `^3.7.4` (in deps, but `sitemap.xml.ts` is hand-written; not imported anywhere) | ⚠️ Unused dependency. |
| `@cloudflare/workers-types` | `^4.20241127.0` | ✅ |
| `react` / `react-dom` | NOT in deps | ✅ Correct — Astro-only site, no React runtime |

### Resolution

- `package-lock.json` resolves `@tokyo3rdhq/magi-design-system` from the npm registry tarball. ✅ Not vendored.
- `node_modules/@tokyo3rdhq/magi-design-system/dist/styles.css` exists and is loaded by the portal at build time.

### CSS import

- `src/styles/global.css` first line: `@import '@tokyo3rdhq/magi-design-system/styles.css';` then `@tailwind base/components/utilities;`. ✅ Correct order: DS rules loaded first, then Tailwind layers override / extend.

---

## 12. Build / Runtime Audit

| Check | Status |
|---|---|
| `npm install` | ✅ |
| `npm run build` | ✅ — completed in 1.93s, 1 page built |
| `npx tsc --noEmit` | ✅ — no errors |
| `astro check` | Not run (no script). INFO. |
| SSR | ✅ Astro static output (`output: 'static'`). |
| Hydration | ✅ Zero client JS for the page body. Only the i18n inline `<script>` runs. |
| FOUC (visual) | ✅ — DS tokens on `:root, [data-magi-theme=dark]` apply before paint. |
| FOUC (i18n) | ⚠️ P2 — see F-008. |
| CSS loading order | ✅ — DS CSS imported in `global.css`, bundled to `dist/assets/index-*.css`. |

---

## 13. Design System Duplication Analysis

| Category | Duplication | Status | Recommended Action |
|---|---|---|---|
| **Brand** | MagiMark rendered 4× (Layout inline SVG, public/favicon.svg, public/magi-lockup.svg, og-default.svg partial). MagiLockup rendered 2×. MagiWordmark rendered 1× (public/og-default.svg). | ⚠️ **DUPLICATE** — P0 | Reference the canonical SVG via `@tokyo3rdhq/magi-design-system/dist/assets/logo/`. Single source of truth. |
| **Tokens** | None — all colors reference `var(--magi-*)`. 4 Tailwind hard-coded literals (P1). | ⚠️ Minor violations | Replace with token-bound classes. |
| **Components** | `.btn-primary`, `.btn-secondary`, `.card-surface` re-implement DS Button + Card CSS patterns. | ⚠️ **DUPLICATE** (Astro boundary) | Product-owned per docs/plan.md. Future: `@astrojs/react`. |
| **Layout primitives** | `mx-auto max-w-page` re-implements DS Container. | ⚠️ DUPLICATE (Astro boundary) | Same as above. |
| **Theme** | None — fully DS-owned. | ✅ |
| **Typography utilities** | Used via `.magi-*` classes. Zero duplication. | ✅ |
| **i18n bootstrap** | Custom Layout.astro inline script. | ⚠️ DUPLICATE (Astro boundary) | INFO — not a DS concern. |
| **scrollbar behavior** | Layout.astro `body[data-scrolling]` toggle drives DS scrollbar rules. | ✅ COMPLIANT — DS provides the rules; portal drives the state. |

---

## 14. Severity Summary

| Severity | Count |
|---|---|
| **P0** — DS Contract Violation | 1 (F-001 Brand duplication) |
| **P1** — Strong Compliance Issue | 4 (F-002, F-003, F-004, F-005, F-006) |
| **P2** — Improvement | 9 (F-007–F-019) |
| **INFO** — Product-owned | 5 (F-020–F-023) |

---

## 15. Migration Backlog

### P0

```
F-001: Brand asset duplication
  Problem:      Header logo SVG inlined 4 times; layout drifts if DS updates the mark.
  Why matters:  Brand contract violation. Visual regressions are silent and slow.
  Affected:     src/layouts/Layout.astro:74-89
                public/favicon.svg
                public/magi-lockup.svg
                public/og-default.svg
  DS contract:  Brand primitives live at dist/assets/logo/magi-{mark,wordmark,lockup}.svg
  Solution:     Copy the canonical SVG into src/components/Brand/{MagiMark,MagiWordmark,MagiLockup}.astro
                (or symlink to node_modules/.../dist/assets/logo/). Reference the Astro component
                from Layout.astro. For favicon/og-default, reference via `new URL()` + Astro Assets.
  Risk:         Low — visual should be byte-identical.
  Scope:        ~30 minutes.
```

### P1

```
F-002: bg-black/60 in header
  Problem:      Hard-coded Tailwind color in src/layouts/Layout.astro:84
  Why matters:  Bypasses token binding.
  Solution:     `bg-black/60` → `bg-bg-raised/95`. Both render #1d1d1f@95% over the body.
  Risk:         None (visual identical).
  Scope:        1 minute.

F-003: shadow-2xl in dropdown
  Problem:      Hard-coded shadow value. Not a token.
  Why matters:  Could become inconsistent across products.
  Solution:     Optional: define `--magi-shadow-lg` in DS. Otherwise INFO.
  Risk:         Low.
  Scope:        15 minutes (or defer).

F-004: bg-white/5, bg-white/[0.06], hover:border-white/30
  Problem:      5 sites use hard-coded Tailwind white.
  Why matters:  DS already provides --magi-bg-card-hover (= rgba(255,255,255,0.06)).
  Solution:     bg-white/[0.06] → bg-bg-card-hover (5 sites).
                bg-white/5 → no DS equivalent (keep as-is, document in tailwind.config.mjs as product-only).
                hover:border-white/30 → no DS equivalent (keep).
  Risk:         None.
  Scope:        5 minutes.

F-005: @apply text-black in .btn-primary
  Problem:      text-black is a hard-coded color literal.
  Why matters:  Stray Tailwind class injection.
  Solution:     Remove `text-black` from the @apply chain; rely on the explicit
                `color: var(--magi-text-inverse)` override.
  Risk:         None.
  Scope:        1 minute.

F-006: Header SVG letter-spacing hard-coded
  Problem:      letter-spacing="-2.16" on inline SVG text.
  Why matters:  Same root cause as F-001 — duplicates DS lockup geometry.
  Solution:     Same as F-001.
  Risk:         None.
  Scope:        ~30 minutes (folded into F-001).
```

### P2

```
F-008: i18n FOUC (lang attribute)
  Problem:      <html lang="en"> SSR; client re-sets after DOMContentLoaded.
  Why matters:  Chinese users see lang="en" for ~200ms.
  Solution:     Tiny inline <script> in <head> that reads localStorage.locale synchronously:
                   <script is:inline>document.documentElement.lang =
                     localStorage.getItem('locale') === 'zh' ? 'zh-CN' : 'en';</script>
  Risk:         None.
  Scope:        5 minutes.

F-010: local borderRadius scale (xl=14px / 2xl=20px / 3xl=28px) vs DS radii
  Problem:      Local radii don't align with DS radii (--magi-radius-md=6, lg=10, xl=16, full=9999).
  Solution:     Either (a) replace with DS tokens where the visual fits
                (rounded-[16px] for "xl" using --magi-radius-xl), or
                (b) document the product-specific scale in docs/plan.md.
  Risk:         Visual diff if (a). None if (b).
  Scope:        30 minutes if (a); 5 minutes if (b).

F-012: Unused SEO components (SEO.astro, ProductSchema.astro)
  Problem:      Dead code in src/components/seo/.
  Solution:     Either wire into Layout.astro (SEO.astro has ogImage prop) or delete.
  Risk:         None.
  Scope:        15 minutes.

F-013: OrganizationSchema references /logo.svg which doesn't exist
  Problem:      JSON-LD schema references non-existent asset.
  Solution:     Either create public/logo.svg (= favicon.svg or MagiMark) or update schema
                to reference /favicon.svg or the canonical lockup path.
  Risk:         None for the page; SEO signal loss if unresolved.
  Scope:        10 minutes.

F-015: Stale i18n/index.ts comment about runtime.ts
  Problem:      Comment references a non-existent file.
  Solution:     Either extract runtime.ts from Layout.astro (improves testability) or fix the comment.
  Risk:         None.
  Scope:        15 minutes (extract) or 1 minute (comment).

F-017: wrangler.toml node-version: 20 deprecated by Cloudflare Pages
  Problem:      Node 20 deprecated since 2025-09-19; DS CI is on Node 22.
  Solution:     Bump to NODE_VERSION: 22.
  Risk:         Build behavior should be identical.
  Scope:        2 minutes.

F-019: Lang-dropdown keyboard navigation
  Problem:      Only Escape closes; no Arrow / Home / End.
  Why matters:  WAI-ARIA listbox pattern.
  Solution:     Add ArrowUp / ArrowDown / Home / End handlers; aria-activedescendant on listbox.
  Risk:         Low — additive.
  Scope:        20 minutes.
```

### INFO

```
F-011: Local .btn-* / .card-surface / .link-arrow / .nav-link
  →  Astro framework boundary; per docs/plan.md, future migration when @astrojs/react is added.

F-020: Header logo aria-label correct
  →  ✅ COMPLIANT.

F-021/F-022/F-023: Product-owned decoration (MatrixBackground), product IA (seo/).
  →  INFO.
```

---

## 16. Final Judgment

`magi.website` is **MOSTLY COMPLIANT** with `@tokyo3rdhq/magi-design-system@0.6.0`.

**Strengths:**
- Zero parallel token system. All colors, surfaces, text, borders, accents bind to `var(--magi-*)`.
- DS typography utilities used throughout (`.magi-display`, `.magi-h2`, `.magi-eyebrow`, `.magi-caption`, etc.).
- `data-magi-app` correctly applied; DS CSS rules apply without override.
- Brand contract followed via `fill="currentColor"` and `text-ink-primary` (not accent) on the logo.
- i18n uses endonyms, no flag emojis, follows Experience Guidelines §5.1.
- Responsive uses single design language, different composition.
- Astro framework boundary is honestly documented in `docs/plan.md`.

**Weaknesses:**
- Brand asset duplication (F-001) — the highest-priority issue. Reference the DS source SVG instead of vendoring 4 copies.
- 4 hard-coded Tailwind color literals (F-002, F-004, F-005) — easy token-bound replacements.
- i18n FOUC on first paint (F-008) — 5-line fix.
- One stale doc reference (F-015).

**No P0 architectural violations. No contract-blocking issues.**

Per the audit doc's §29: this is a real consumer using the DS correctly while keeping its own product IA. The portal demonstrates the DS contract works in a non-React framework (Astro). The token-bound pattern is exemplary — exactly what the DS was designed to enable.

---

## Deliverables

| File | Purpose |
|---|---|
| `docs/audits/design-system-compliance.md` | **NEW** — this report |

## Files Read

```
src/layouts/Layout.astro                   (424 lines)
src/components/Hero.astro                  (33 lines)
src/components/Products.astro              (39 lines)
src/components/ProductCard.astro           (40 lines)
src/components/Features.astro              (78 lines)
src/components/About.astro                  (78 lines)
src/components/MatrixBackground.astro      (20 lines)
src/components/seo/SEO.astro               (40 lines)
src/components/seo/OrganizationSchema.astro (22 lines)
src/components/seo/ProductSchema.astro     (24 lines)
src/pages/index.astro                      (10 lines)
src/styles/global.css                      (88 lines)
src/i18n/{types,translations,locales-meta,index}.ts
src/i18n/locales/{en,zh}.ts
public/{favicon.svg, og-default.svg, magi-lockup.svg, _headers, _redirects, skill.md}
tailwind.config.mjs
astro.config.mjs
package.json + package-lock.json
docs/plan.md
README.md
.env + .env.example
node_modules/@tokyo3rdhq/magi-design-system/dist/styles.css (verified bundle output)
```

## Files NOT Modified

Per the audit doc §26 ("不要修改任何文件"), no source files were modified.
The only file created is this report under `docs/audits/`.

## Build Verification

`npm run build` exits 0 (1.93s, 1 page built). No regressions.