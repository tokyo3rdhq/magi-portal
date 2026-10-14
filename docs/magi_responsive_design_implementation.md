# Task: Implement Production-Ready Responsive Design for magi.website

## 1. Project Context

Target repository: `magi.website` main site.

Shared design system: `@tokyo3rdhq/magi-design-system`

The main website has already been upgraded to a version of `magi-design-system` that introduces responsive design support, including:

- `Grid` component (`src/layout/Grid.tsx`), supporting responsive column counts through Tailwind-style breakpoint utilities.
- Responsive `Button` prop, accepting a breakpoint-to-size mapping, for example:

  ```tsx
  <Button size="md" responsive={{ md: "lg" }}>
    Get Started
  </Button>
  ```

  The exact supported sizes and breakpoint keys must be verified against the installed package version.

- Public exports for `Grid` and the `Breakpoint` type.

MAGI's visual identity is dark, minimal, Apple-inspired, and product-oriented. The website is the main entry point for a family of products hosted under `*.magi.website`, including `models.magi.website` / Token Factory Initializr.

The goal is to make the main website genuinely responsive across mobile phones, tablets, narrow desktop windows, standard desktop screens, and wide monitors.

This is a production implementation task, not a proposal or mockup.

## 2. Primary Objective

Audit and refactor the existing main website so that its layout, navigation, typography, spacing, product cards, buttons, content sections, and footer adapt intentionally to different viewport widths.

The implementation must:

1. Reuse `@tokyo3rdhq/magi-design-system` as the shared source of visual and component conventions.
2. Use the new responsive capabilities where they fit existing design-system contracts.
3. Preserve the established MAGI brand and desktop visual identity.
4. Prevent accidental horizontal overflow, overlapping text, cramped controls, and unusable navigation.
5. Provide an appropriate mobile information hierarchy rather than merely shrinking the desktop layout.
6. Preserve existing routes, links, product functionality, localization, analytics, and accessibility behavior.

Do not redesign the brand or introduce an unrelated visual style.

## 3. Phase 1: Audit the Existing Implementation

Before modifying code, inspect the repository.

Read:

- `package.json` and lockfile.
- Existing application entry points and route definitions.
- All main-site page components.
- Shared header, navigation, footer, and layout components.
- Product cards and product listing sections.
- Existing CSS, Tailwind configuration, and global styles.
- i18n implementation and translated content.
- Existing analytics instrumentation and event handlers.
- Current tests and build scripts.
- Installed `@tokyo3rdhq/magi-design-system` version and actual exported APIs.

Do not assume the package supports every Tailwind breakpoint or size mentioned in this prompt. Inspect the installed implementation and public type definitions.

Determine:

- Which pages and shared components need responsive changes.
- Whether the current Tailwind configuration can recognize the design system's generated class names.
- Whether the main site's content width, padding, grid columns, and typography are fixed.
- Whether navigation items or language selectors cause horizontal overflow.
- Whether long translations or product descriptions break layouts.
- Whether responsive behavior is currently scattered across page-specific styles.
- Whether desktop layouts rely on hardcoded widths or inflexible flex containers.

Produce a concise audit and implementation plan, then proceed with the implementation.

Do not stop after reporting findings.

## 4. Responsive Design Strategy

Use a mobile-first implementation.

The base layout must be usable at narrow widths. Larger breakpoints should progressively introduce more columns, horizontal navigation, wider content, and larger visual treatments.

Use the design system's supported breakpoint conventions where possible. If the project already has a breakpoint scale, reconcile it with the design system rather than creating a competing scale.

Validate at these representative viewport sizes:

- 320px: very narrow mobile.
- 375px: common mobile width.
- 430px: larger mobile.
- 640px: compact-to-expanded transition.
- 768px: tablet.
- 1024px: narrow desktop.
- 1280px: standard desktop.
- 1440px: wide desktop.

These are test widths, not a requirement to add a media query at every value.

Prefer responsive layout primitives and existing design-system tokens over duplicated one-off CSS.

## 5. Header and Navigation

Treat the site header as a high-priority component.

### Desktop

- Preserve the existing desktop navigation hierarchy and visual alignment.
- Keep the logo, primary navigation, language selector, and key actions aligned.
- Ensure the navigation remains usable when the browser window narrows below the typical desktop width.
- Do not allow navigation labels to collide or force unrelated elements off-screen.

### Mobile

Implement an appropriate compact navigation pattern based on the existing site architecture.

Possible behavior:

- Keep the MAGI logo visible.
- Collapse primary navigation into an accessible menu when horizontal space is insufficient.
- Keep the most important entry point or call to action accessible.
- Place language selection and secondary links inside the menu if necessary.
- Ensure the menu can open and close using keyboard and touch.
- Use a semantic button with an accessible name and appropriate `aria-expanded` / `aria-controls` state.
- Close the menu after navigation when appropriate.
- Avoid introducing a new navigation dependency unless justified.

Do not implement a mobile menu that only looks correct but has no functional open/close behavior.

Preserve the existing language-switching behavior and route destinations.

## 6. Main Hero Section

Refactor the hero section to adapt naturally to different widths.

### Narrow screens

- Stack hero content vertically.
- Keep the headline readable and prevent oversized text from clipping.
- Allow text to wrap naturally.
- Keep the primary call to action visible without excessive scrolling.
- Stack or wrap action buttons where necessary.
- Prevent decorative elements from covering text or intercepting pointer events.
- Reduce excessive vertical padding while preserving visual breathing room.

### Medium and wide screens

- Preserve the current intended desktop composition.
- Use fluid typography with sensible minimum and maximum sizes where appropriate.
- Constrain text width to maintain readability.
- Keep the main call to action visually prominent without forcing every button to the same width.

Do not solve wrapping problems by inserting manual line breaks that break translations or smaller viewport layouts.

## 7. Product Cards and Product Grid

Audit every product or feature card on the homepage.

Use the new `Grid` component when it provides the appropriate layout.

Typical responsive behavior should be:

- Narrow mobile: one column.
- Larger mobile and tablet: one or two columns depending on actual card content and available width.
- Desktop: two or more columns when the design and card minimum width allow it.
- Wide desktop: preserve a readable maximum content width rather than expanding cards indefinitely.

Example, adjusted to the actual installed API:

```tsx
<Grid
  columns={1}
  responsive={{
    sm: 2,
    lg: 3,
  }}
  gap="..."
>
  ...
</Grid>
```

This is illustrative only. Verify the real component props and supported responsive API before using it. Do not invent a `responsive` prop for `Grid` if the installed implementation uses a different contract.

Requirements:

- Cards must remain readable at 320px.
- Titles and descriptions must wrap.
- Long URLs and technical identifiers must not force the page wider.
- Card actions must remain visible and operable.
- Card heights should remain visually balanced without clipping content.
- Use consistent gaps and responsive container padding.
- Do not force a three-column layout on screens where the cards become cramped.

If the existing Grid component cannot express a required pattern, extend the implementation only when appropriate, or use CSS Grid with the project's established conventions.

## 8. Typography and Content

Audit typography throughout the site.

Apply responsive sizing selectively to:

- Hero title.
- Section headings.
- Product titles.
- Body text.
- Supporting descriptions.
- Navigation labels.
- Buttons and metadata.

Requirements:

- Avoid fixed font sizes that cause clipping on narrow screens.
- Use `clamp()` or existing responsive typography tokens when appropriate.
- Preserve line-height and typographic hierarchy.
- Limit heading line lengths where helpful.
- Keep body text comfortably readable.
- Handle translated strings that are longer than English.
- Avoid hardcoded line breaks that only work at one viewport width.

Do not uniformly scale every text element. Typography must remain hierarchical.

## 9. Buttons and Action Groups

Use the new responsive `Button` size prop where it improves usability.

For example:

```tsx
<Button size="md" responsive={{ md: "lg" }}>
  Explore Models
</Button>
```

Before implementation, verify:

- The exact `Button` prop contract.
- Supported breakpoint keys.
- Supported size values.
- Whether responsive classes are generated and included in the built CSS.

Requirements:

- Preserve existing button variants, sizes, links, callbacks, and analytics events.
- Allow adjacent actions to wrap or stack on narrow screens.
- Prevent button text and icons from overlapping.
- Avoid making every button full-width by default.
- Use full-width actions only where they improve the mobile experience.
- Keep primary and secondary actions visually distinguishable.
- Preserve accessible focus states and adequate touch targets.

## 10. Content Width, Spacing, and Overflow

Review the site's shared page containers and sections.

Requirements:

- Use a consistent responsive horizontal gutter.
- Keep content centered on wide screens.
- Apply sensible maximum widths to text-heavy sections.
- Remove unintended fixed widths that cause overflow.
- Ensure flex and grid children can shrink appropriately with `min-width: 0` where needed.
- Use intentional wrapping for navigation, badges, and action groups.
- Handle long URLs, identifiers, and translated strings deliberately.
- Avoid global `overflow-x: hidden` as a blanket workaround for broken layouts.

If decorative backgrounds extend beyond the viewport, fix their positioning and clipping without hiding meaningful content or keyboard focus indicators.

## 11. Footer and Secondary Sections

Make the footer and all lower-page sections responsive.

- Stack footer groups on narrow screens.
- Allow legal, documentation, social, and product links to wrap.
- Keep sufficient spacing between interactive elements.
- Preserve link destinations and external-link behavior.
- Ensure no text or icon overlaps occur.
- Maintain a consistent visual hierarchy between primary and secondary content.

Do not focus only on the hero and leave the bottom half of the site broken.

## 12. Shared Design System Integration

The design system is the shared foundation for MAGI products.

Use the installed `@tokyo3rdhq/magi-design-system` APIs and tokens consistently.

Requirements:

- Reuse `Grid` where appropriate.
- Reuse the responsive `Button` prop where appropriate.
- Reuse existing `Container`, `Section`, `Stack`, typography, spacing, and color conventions.
- Avoid recreating components already available in the package.
- Avoid hardcoding the same breakpoint values in multiple unrelated stylesheets.
- Do not modify the design-system package as part of this task unless a concrete missing capability prevents correct implementation.
- If a missing capability is discovered, document it separately and propose the smallest reusable change rather than silently implementing a main-site-only workaround as a shared abstraction.

Verify the final production build includes the relevant responsive CSS.

If Tailwind is involved, check the actual class-generation and content-scanning configuration. Do not assume dynamically constructed class names will be emitted correctly. Prefer statically recognizable class mappings or the design system's existing supported approach.

## 13. Preserve Existing Product and Analytics Behavior

Responsive refactoring must not break functionality.

Preserve:

- Existing URLs and routing.
- Product entry points and CTAs.
- Language selection.
- Documentation and GitHub links.
- Google Analytics / GA4 instrumentation.
- Existing event names and event semantics.
- External-link behavior.
- Any existing mobile-specific interactions.

Do not rename or remove analytics events merely because components are reorganized.

Where event handlers are moved, verify that the same user actions still produce the intended events, without introducing duplicate tracking.

## 14. Accessibility Requirements

Ensure the responsive site remains accessible.

- Use semantic HTML elements.
- Maintain visible keyboard focus.
- Support keyboard navigation in mobile menus.
- Provide accessible names for icon-only buttons.
- Keep menu state exposed to assistive technology.
- Respect reduced-motion preferences for responsive transitions.
- Avoid hover-only interactions.
- Ensure text and controls remain legible at browser zoom.
- Do not rely solely on color to convey interaction or state.

## 15. Validation and Testing

Do not consider the task complete merely because the build passes.

Run the repository's existing:

- Lint.
- Typecheck.
- Unit tests.
- Production build.

Use the existing browser or screenshot tooling if available to inspect the actual site at the representative viewport widths defined above.

At minimum, inspect:

1. The initial viewport and hero.
2. The header and navigation.
3. The complete product grid.
4. Every secondary content section.
5. The footer.
6. Long or translated text where available.

If browser automation is available, use it to check document-level horizontal overflow and capture screenshots.

A basic automated overflow check can be:

```js
const result = await page.evaluate(() => ({
  viewportWidth: document.documentElement.clientWidth,
  documentWidth: document.documentElement.scrollWidth,
  hasHorizontalOverflow:
    document.documentElement.scrollWidth >
    document.documentElement.clientWidth,
}));

console.log(result);
```

Adapt this to the repository's actual browser-testing setup. Do not add a new browser automation framework unless it provides clear value.

Verify actual behavior at narrow widths rather than relying only on CSS inspection.

If browser-based visual validation cannot be performed, explicitly report that limitation and provide the build/test evidence that is available.

## 16. Definition of Done

The task is complete only when:

- The main site is usable at 320px and above.
- Navigation adapts appropriately to narrow widths.
- Hero content wraps without clipping.
- Product cards reflow instead of becoming cramped.
- Buttons and action groups remain usable.
- Footer and secondary sections are responsive.
- No accidental horizontal page overflow remains at the tested widths.
- Desktop appearance remains consistent with the established MAGI design.
- Existing routes, localization, product links, and analytics behavior are preserved.
- Existing build, lint, typecheck, and tests pass.
- Actual responsive validation has been performed, or limitations are explicitly documented.
- The implementation uses the shared design system rather than introducing unnecessary parallel styling conventions.

## 17. Execution Instructions

Work directly in the main-site repository.

1. Inspect the current code and installed design-system version.
2. Summarize the main responsive issues and implementation plan.
3. Implement the changes across shared components and all relevant homepage sections.
4. Run the available automated checks.
5. Validate the actual responsive layouts at representative viewport sizes.
6. Fix issues discovered during validation.
7. Summarize changed files, responsive behavior, tests, and remaining limitations.

Do not stop after producing recommendations. Implement the changes.

Do not claim tests or visual inspections were performed unless they actually were.

Do not publish packages or deploy production changes unless explicitly authorized.
