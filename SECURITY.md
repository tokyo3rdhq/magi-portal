# Security Policy

## Supported Versions

| Version | Supported          |
|---------|--------------------|
| `main`  | :white_check_mark: |
| older   | :x:                |

Only the `main` branch receives security fixes. The live site at <https://magi.website> always runs the latest commit on `main`.

## Reporting a Vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities.

Report privately via email to **hi@magi.website** with:

- A clear description of the issue and its impact
- Reproduction steps (a minimal HTML / curl snippet is fine)
- The commit hash or release tag you observed the issue on
- Your name / handle if you'd like to be credited in the fix

You can expect:

- An acknowledgement within **3 business days**
- A status update every **7 days** until resolution
- Credit in the commit message that closes the report (unless you ask to remain anonymous)

## Scope

This repository hosts the **portal** (`magi.website` static site, Astro + Tailwind + the
`@tokyo3rdhq/magi-design-system` CSS tokens). It does not host any backend services.

Security reports should focus on the portal itself:

- Content Security Policy / `_headers` policy in `public/_headers`
- Cross-origin trust assumptions in the inline `<script>` blocks (FOUC, i18n, theme toggle)
- Build-time secrets (the portal takes only `PUBLIC_SITE_URL`, `PUBLIC_SITE_NAME`,
  `PUBLIC_CONTACT_EMAIL`, `PUBLIC_GITHUB_URL`, `PUBLIC_GA_ID` — all designed to be public)
- The `scripts/sync-brand.mjs` postinstall hook (writes only to `public/`)

Reports about the **products** linked from the portal
(`api.magi.website`, `chat.magi.website`, `agent.magi.website`,
`start.magi.website`) should go to the relevant upstream repo instead.

## Disclosure Policy

We follow coordinated disclosure. Once a fix ships, we publish:

- A CVE-style entry in `CHANGELOG.md` (commit-level credit; no CVE numbering yet)
- The patch commit
- A postmortem in `docs/` if the issue warranted one