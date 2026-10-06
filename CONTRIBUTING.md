# Contributing to magi-portal

Thanks for considering a contribution to `magi.website`'s source. This document covers the
local workflow and the conventions the codebase uses so your change lands cleanly.

## Quick start

```bash
# 1. Fork & clone
git clone https://github.com/<you>/magi-portal.git
cd magi-portal

# 2. Install
npm install            # runs scripts/sync-brand.mjs as postinstall — copies the
#          canonical MagiMark / lockup / wordmark SVGs from
#          @tokyo3rdhq/magi-design-system into public/

# 3. Dev
npm run dev            # http://localhost:4321

# 4. Build & preview the production output
npm run build
npm run preview
```

`npm run build` is the source of truth — if `dist/` looks right, the change is correct.

## What this repo is

A pure-static Astro 4 site that:

- Hosts the public marketing surface for `magi.website`
- Links out to four sibling products on the `magi.website` domain
  (`api.`, `chat.`, `agent.`, `start.`)
- Consumes `@tokyo3rdhq/magi-design-system` for tokens, theme, and brand SVGs
- Deploys to Cloudflare Pages via the GitHub integration (no `wrangler` token needed
  in CI — the push triggers a Pages build automatically)

It is **not** the place for product-side code, product bug fixes, product features,
or product auth. Those belong in the product repos.

## Conventions the codebase actually enforces

These are not aspirational — violating any of them will cause a CI failure or a
silent regression.

### 1. Design system is the source of truth

**Do not** introduce new hex colors, spacing values, border radii, shadows,
typography sizes, or breakpoints when an equivalent primitive is available from
`@tokyo3rdhq/magi-design-system`. The local tokens in `tailwind.config.mjs` are
just aliases for `var(--magi-*)`. Adding a one-off value is a contract violation
unless it's clearly product-owned and documented.

If you think a new primitive is genuinely needed, **first** check whether it
already exists under a different name in the DS. If it does not, **open an
issue on the design-system repo first** rather than smuggling a local primitive in.

### 2. All user-visible text goes through `data-i18n`

Every piece of user-visible copy must have a `data-i18n="<key>"` attribute, and
both `src/i18n/locales/en.ts` and `src/i18n/locales/zh.ts` must define the key.
The TypeScript `TranslationTree` type is the contract — `tsc --noEmit` will
catch missing keys.

Key paths use dots: `products.tfi.description`. Array indices count: `features
items 0 headline`.

### 3. No parallel token or component system

- **No** `bg-[#xxxxxx]` Tailwind arbitrary colors. Use `bg-bg-card`,
  `text-ink-secondary`, `border-line`, `text-accent` instead.
- **No** hand-rolled card surface, button, or badge primitives when
  `card-surface`, `btn-primary`, `btn-secondary`, `link-arrow`,
  `magi-eyebrow`, etc. already cover the use case.

### 4. Brand assets come from the design system, not vendored

`public/favicon.svg`, `public/magi-lockup.svg`, `public/og-default.svg` are
synced from `@tokyo3rdhq/magi-design-system/dist/assets/logo/` by
`scripts/sync-brand.mjs`. Do **not** edit them in place — your edit will be
overwritten on the next `npm install`. Edit the source in the design-system
repo instead.

### 5. CI runs `npm run build` only

`.github/workflows/ci.yml` ("Build & Lint") runs `npm ci` then `npm run build`.
If your change requires a deploy step, that's handled automatically by the
Cloudflare Pages GitHub integration once the commit lands on `main`.

## Commit messages

The repo uses **Conventional Commits** with an optional scope. The history is the
canonical reference:

```text
feat(products): feature Token Factory Initializr as headline MAGI product
fix(theme): close addEventListener callback with });
chore(ci): rename workflow to 'Build & Lint'
```

Rules:

- Subject ≤ 72 chars, imperative mood, lowercase first letter, no period at end
- Scope in parens — one of `theme`, `nav`, `footer`, `products`, `ci`, `i18n`, `alignment`, etc.
- Body lines ≤ 100 chars
- Body explains *why*, not *what* (the diff shows the what)

## Pull requests

Open a PR against `main`. A useful PR:

- Describes the problem and the chosen approach in 1–3 paragraphs
- Lists the design-system primitives it reuses
- Confirms `npm run build` succeeds locally
- Includes before/after screenshots if the change affects layout
- Calls out any new `data-i18n` keys (so reviewers can verify both locales)

CI must be green. Reviewers (the design-system owner) will pay extra attention to the
"F-001 / F-006" brand contract and any new file that introduces a custom hex or
breakpoint value.

## What NOT to do

- Don't edit `package-lock.json` by hand. Run `npm install <pkg>` instead.
- Don't add analytics beyond the existing `PUBLIC_GA_ID`. If you need telemetry,
  raise it as an issue first.
- Don't add CI steps without discussion — the workflow is intentionally minimal.
- Don't vendor the design system into a private copy. If you need a fix, fix it
  upstream.
- Don't open PRs against product repos from this fork — use the product repo.

## Code of conduct

See [`CODE_OF_CONDUCT.md`](./CODE_OF_CONDUCT.md). Be respectful. Disagree with
ideas, not people.

## Security

See [`SECURITY.md`](./SECURITY.md). Don't file public issues for security bugs.
Report to **hi@magi.website** privately.