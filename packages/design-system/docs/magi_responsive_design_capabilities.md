# MAGI Responsive Design Capabilities

This document describes how the **MAGI Design System** supports responsive layouts, component sizing, and theme‑aware breakpoints.  All UI primitives are built on top of Tailwind CSS v3, which offers an efficient, scalable way to express responsive styles while keeping design‑system‑specific overridable tokens.

## 1. Breakpoint strategy

| Token   | Screen width |
|---------|--------------|
| `--magi-breakpoint-sm` | `≥ 640 px` |
| `--magi-breakpoint-md` | `≥ 768 px` |
| `--magi-breakpoint-lg` | `≥ 1024 px` |
| `--magi-breakpoint-xl` | `≥ 1280 px` |
| `--magi-breakpoint-2xl` | `≥ 1536 px` |

The base `--magi-breakpoint` set follows Tailwind's default breakpoints, ensuring zero CSS‑race between design‑system and application styles.

## 2. Utility class generation

The design system exposes a set of **component‑specific variant utilities** that automatically include responsive modifiers. For example:

```js
// In the React component
<MagiButton size="md" variant="primary" responsive={{ md: "lg" }} />
```

This expands to:

```html
<button class="magi-btn md:magi-btn--lg">…</button>
```

The mechanism is implemented via the `cn` helper (`../utils/classnames.ts`). It normalises any `responsive` prop into Tailwind‑prefixed class names.

## 3. Layout primitives

All layout utilities (`Grid`, `Flex`, `Container`) use CSS **grid** and **flexbox** with `minmax()` values that automatically adapt to the viewport size. For instance:

```tsx
<Container>
  <Grid cols={{ sm: 1, md: 2, lg: 3 }} gap={4} />
</Container>
```

Translates to:

```html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">…</div>
```

## 4. Adaptive typography

The design system provides **rem‑based** font‑sizes defined in `src/styles/global.css`. Scaling is controlled by the `${--magi-root-font-size}` CSS variable, which is updated via `setRootFontSize()` in `src/utils/typography.ts`. For touch devices the font‑size increments automatically based on `prefers-reduced-motion` and user‑zoom.

## 5. Image & Icon responsiveness

SVG assets ship with `viewBox` definitions, letting browsers scale them without loss of quality. The `Image` component wraps `next/image` under-the-hood and guarantees `loading="lazy"` and `sizes="(max-width: 640px) 100vw, 50vw"` by default.

## 6. Accessibility in responsive context

All components expose `aria` props that play nicely with dynamic layouts; the `useScreenSize` hook exposes `small`, `medium`, and `large` booleans, enabling screen‑sized rendering of focus traps or modal disclosures.

## 7. Testing strategy

- **Layout snapshots**: Test outputs at each breakpoint using `@testing-library/react` queries.
- **Visual regression**: Deploy `playwright-test` suite against a headless browser with multiple viewport sizes.
- **CI**: Breakpoints are flagged in the `ci.yml` to run Vue/React builds for each tile.

## 8. Extensibility

If a consumer needs a **custom breakpoint** it can extend Tailwind config by providing a `tailwind.config.js` in its own repo that exports the design‑system's config and merges additional entries.

---

> **TL;DR** – The MAGI Design System is fully responsive out‑of‑the‑box: Tailwind defaults, grid/flex helpers, adaptive typography, and scalable SVG assets ensure pixel‑perfect layouts across mobile, tablet, and desktop.
