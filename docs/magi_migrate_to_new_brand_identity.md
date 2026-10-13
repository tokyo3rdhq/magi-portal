# Task: Migrate magi.website to the New MAGI Brand Identity

## 1. Objective

Update the existing `magi.website` project to adopt the new MAGI logo design and align all relevant brand assets, brand documentation, and logo usage with `@tokyo3rdhq/magi-design-system`.

This is a brand asset migration, not a full website redesign.

The new logo is inspired by the Three Wise Men in the MAGI story: Melchior, Balthasar, and Caspar. Three geometric triangular forms create a distinctive mark whose negative space suggests the letter **M**, connecting the symbolism of the three sages with the MAGI brand.

Preserve this geometric concept and its recognizable silhouette throughout the migration.

## 2. Required Logo Variants

Implement and organize three official logo variants.

### A. Icon Logo

* Aspect ratio: 1:1.
* Contains only the geometric symbol, without text.
* Intended for favicon, app icon, compact navigation, browser tabs, and other square contexts.
* Must remain recognizable at small sizes.
* Provide a version suitable for light backgrounds and a version suitable for dark backgrounds where necessary.
* Prefer clean, flat vector geometry over gradients, metallic effects, shadows, or other presentation-only effects.
* Preserve the original proportions and negative-space construction of the mark.

### B. Text Logo

* Contains the MAGI wordmark without the symbol.
* Use the existing brand typography where appropriate; inspect the current brand documentation and design-system conventions before selecting or introducing a typeface.
* Preserve the clean, minimal, geometric character of the new identity.
* Use consistent letter spacing and optical alignment.
* Provide suitable variants for light and dark backgrounds if needed.

### C. Combine Logo

Provide two lockups using the icon and wordmark together:

**Horizontal Combine**

* Symbol on the left, MAGI wordmark on the right.
* Intended for website navigation, footer branding, documentation headers, and other horizontal layouts.

**Vertical Combine**

* Symbol centered above the MAGI wordmark.
* Intended for brand presentations, standalone landing-page branding, and other vertically oriented layouts.

Both lockups must maintain consistent proportions, spacing, and alignment. Do not redraw the symbol independently for each variant.

## 3. First: Audit the Existing Repository

Before editing files, inspect the actual repository and identify:

* Current logo assets, including SVG, PNG, favicon, touch icon, and other brand-related images.
* Every component and page that references the existing logo.
* Existing logo variants, including dark-mode and light-mode versions.
* Brand documentation, such as `brand.md`, README files, design-system documentation, and relevant asset guidelines.
* Existing usage of `@tokyo3rdhq/magi-design-system`.
* Existing metadata, Open Graph images, manifest icons, and SEO-related brand references.
* Existing tests and build scripts relevant to these assets.

Search the entire repository for logo filenames, image imports, brand names, and hard-coded logo references. Follow the actual dependency and rendering paths rather than assuming all references are visible in the main navigation component.

Produce a concise inventory before making changes.

## 4. Establish a Canonical Brand Asset Structure

Follow the existing repository's conventions where possible. Do not introduce a new asset architecture unnecessarily.

Organize the official logo assets so that their purpose is clear. For example, adapt the following structure to the existing project:

* `icon.svg` — square symbol, 1:1.
* `text.svg` — MAGI wordmark.
* `combine-horizontal.svg` — horizontal symbol + wordmark.
* `combine-vertical.svg` — vertical symbol + wordmark.
* Appropriate light/dark variants only where necessary.

Prefer SVG for primary logo assets because it preserves vector sharpness, scales cleanly, and supports reliable color adaptation.

If the repository already has an established brand asset directory, retain it instead of creating a duplicate directory.

### SVG Requirements

* Use clean, valid SVG markup.
* Use a consistent `viewBox` and geometry across relevant variants.
* Avoid embedding unnecessary raster images or editor metadata.
* Avoid unnecessary filters, masks, gradients, and clipping paths.
* Use `currentColor` only where it is compatible with the actual rendering context.
* Otherwise, use explicit brand colors or separate theme-specific assets.
* Ensure the symbol retains its intended appearance against both light and dark backgrounds.
* Preserve adequate whitespace around the mark without changing its underlying geometry.
* Optimize SVGs without altering the visual identity.

Do not simply export the entire brand presentation board as a logo asset. Extract or reconstruct the individual logo variants as clean standalone vector assets.

## 5. Replace Existing Logo Usage

Update all existing references to use the appropriate new logo variant.

### Website Navigation

* Use the horizontal combine logo where the existing layout has sufficient space.
* Use the icon logo in compact layouts where the full wordmark would be too small or crowded.
* Preserve existing navigation behavior, responsive breakpoints, and accessibility.
* Avoid changing unrelated navigation layout or interactions.

### Footer

* Use the appropriate combine logo or icon-and-wordmark treatment based on the existing footer layout.
* Ensure the logo is legible against the footer background.
* Preserve existing footer links and functionality unless a separate change is explicitly required.

### Favicon and Browser Metadata

Update applicable references, including:

* Favicon.
* SVG favicon, if supported by the current project.
* Apple touch icon.
* Web app manifest icons, if present.
* Open Graph and social sharing images where the logo is embedded.
* Site metadata or theme colors where appropriate.

Do not assume every asset exists. Update the actual assets and metadata found in the repository.

Keep square icon assets at a 1:1 ratio. Generate raster variants at appropriate resolutions from the canonical vector source when required by existing platform conventions.

### Other Brand Surfaces

Check other existing locations, including:

* Homepage hero or brand sections.
* Authentication or account screens, if present.
* Documentation pages.
* Empty states and loading screens.
* Email templates or other generated content, if present.
* Any shared header or footer components used by subdomains or applications in this repository.

Only modify surfaces that actually exist and are part of this project.

## 6. Align Brand Documentation

Update the existing brand documentation rather than creating competing sources of truth.

Document:

### Brand Concept

* The three triangular forms represent the Three Wise Men: Melchior, Balthasar, and Caspar.
* The negative space suggests an M, connecting the symbol to MAGI.
* The logo communicates a minimal, geometric, and contemporary identity.

Treat this as the intended brand story, not as a requirement to add explanatory text to the public website.

### Logo Variants

Document the intended use of:

* Icon Logo.
* Text Logo.
* Horizontal Combine Logo.
* Vertical Combine Logo.

Include practical recommendations for navigation, footers, favicons, compact contexts, and brand presentations.

### Background and Color Usage

* Specify which variants should be used on light and dark backgrounds.
* Keep contrast sufficient for reliable visibility.
* Avoid using a black logo on a black background or a white logo on a white background.
* Follow existing MAGI design tokens and the conventions of `@tokyo3rdhq/magi-design-system`.

### Clear Space and Minimum Size

Establish sensible clear-space and minimum-size recommendations based on the actual geometry and tested rendering. Do not invent claims about official standards or trademark registration.

### Incorrect Usage

Document a small set of practical restrictions:

* Do not distort the symbol.
* Do not change the relative proportions of the three triangular forms.
* Do not independently alter the negative-space M.
* Do not apply arbitrary gradients, shadows, outlines, or perspective effects.
* Do not stretch the wordmark or change its spacing inconsistently.
* Do not recreate the logo with arbitrary text characters or unrelated icons.

## 7. MAGI Design System Integration

Inspect the actual APIs and documentation of `@tokyo3rdhq/magi-design-system`.

* Reuse existing tokens, typography conventions, and layout primitives.
* Follow existing component and styling patterns.
* If a reusable Logo component already exists, extend it only if doing so is appropriate.
* If no suitable component exists and multiple surfaces need consistent variants, introduce a small reusable component following the existing framework and component conventions.
* Keep asset definitions separate from presentation logic.
* Avoid introducing a second, conflicting set of brand colors or typography tokens.
* Do not modify the design-system package itself unless the repository architecture makes that necessary.

Do not assume the package exports particular components, tokens, or APIs without checking the installed version and source.

## 8. Technical and Scope Constraints

* Preserve the existing framework, build system, routing, and deployment configuration.
* Do not add a dependency merely to render SVG assets.
* Do not redesign the homepage, navigation, footer, or unrelated product functionality.
* Do not replace the logo with emoji, a generic icon-library symbol, or a CSS approximation.
* Do not use the generated presentation board as a production asset.
* Do not introduce external image URLs or runtime dependencies for the logo.
* Do not duplicate assets unnecessarily across applications.
* Keep the implementation maintainable and consistent with the existing codebase.

## 9. Verification

After implementation:

1. Run the relevant existing tests, lint checks, type checks, and production build.
2. Verify all updated asset paths and metadata references.
3. Check that the navigation and footer render the intended variants.
4. Verify the icon at small sizes and at a 1:1 ratio.
5. Inspect both light and dark backgrounds where supported.
6. Verify that the horizontal and vertical combine logos retain consistent symbol geometry.
7. Check responsive layouts for clipping, distortion, or excessive whitespace.
8. Confirm that no unrelated page behavior has changed.
9. If browser-based visual testing is available, inspect the actual rendered pages rather than relying solely on source inspection.

Report checks that actually ran and their results. Clearly identify any checks that could not be performed.

## 10. Completion Report

When finished, provide:

* Summary of the existing logo assets and references discovered.
* List of new, replaced, and removed assets.
* List of pages and components updated.
* Summary of brand documentation changes.
* Description of light/dark logo handling.
* Test, type-check, lint, and build results.
* Any remaining visual or technical issues.

The final result should be a coherent, production-ready MAGI brand migration: one canonical geometric symbol, consistent wordmark and combine lockups, and correct usage across the existing `magi.website` surfaces.

