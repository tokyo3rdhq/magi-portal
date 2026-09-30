你现在负责对 MAGI 主站项目执行一次完整的 Design System Compliance Audit。

目标项目：

`magi.website`

Design System：

`@tokyo3rdhq/magi-design-system`

Design System Repository：

`https://github.com/tokyo3rdhq/magi-design-system`

---

# 1. Audit 目标

这不是一次普通的 UI Code Review。

你的目标是回答：

> `magi.website` 当前实现是否真正遵循 `@tokyo3rdhq/magi-design-system` 的 Brand、Token、Theme、Component、Accessibility 和 Experience Guidelines？

重点检查：

```text
MAGI Design System
        │
        ▼
   magi.website
        │
        ├── Brand
        ├── Theme
        ├── Tokens
        ├── Typography
        ├── Components
        ├── Layout
        ├── Interaction
        ├── Accessibility
        ├── Responsive
        └── Experience Guidelines
```

不要因为发现问题就立即修改代码。

**第一阶段只做 Audit，不修改业务代码。**

---

# 2. Design System 是 Source of Truth

必须先读取并理解当前安装版本的：

`@tokyo3rdhq/magi-design-system`

同时阅读仓库中的：

* README.md
* packages/design-system/README.md
* docs/brand.md
* docs/guidelines.md
* docs/component-contracts.md
* docs/architecture-review-framework-agnostic.md
* docs/ADR/*
* CHANGELOG.md

以及实际源码：

* tokens
* foundation
* brand
* components
* layout
* theme
* public exports

**不要使用旧版本 Design System 的记忆。**

以当前安装版本和当前 repository 为准。

---

# 3. 首先建立 Consumer Inventory

在审计之前，先扫描 `magi.website`。

识别：

## 页面

例如：

* Home
* About
* Products
* Models
* Start
* Docs
* Blog
* Contact
* 其他页面

不要假设上述页面一定存在。

以代码实际情况为准。

## Layout

识别：

* root layout
* header
* navigation
* footer
* page container
* section
* grid
* stack
* responsive layout

## UI Components

建立实际组件列表。

特别识别：

* Button
* Card
* Badge
* Input
* Form
* Checkbox
* Segmented
* Banner
* EmptyState
* Link
* Navigation
* Hero
* CTA
* Product card
* Feature card

## Brand

识别：

* logo
* mark
* wordmark
* lockup
* favicon
* app icon

## Styling

识别：

* CSS
* CSS Modules
* Tailwind
* styled-components
* inline styles
* CSS variables
* hard-coded colors
* hard-coded spacing
* hard-coded typography

---

# 4. 输出 Consumer Architecture Map

先建立：

```text
magi.website
├── App Shell
│   ├── Header
│   ├── Navigation
│   └── Footer
│
├── Pages
│
├── Product Sections
│
├── Components
│
├── Brand
│
├── Theme
│
├── Tokens
│
└── Local Styling
```

为每一层标记：

* Design System owned
* Product owned
* Shared contract
* Local implementation

---

# 5. Brand Compliance Audit

检查 MAGI Website 是否正确使用 Brand Foundation。

## 必须检查

### Logo

检查是否使用：

* MagiMark
* MagiWordmark
* MagiLockup

或者是否自行复制 SVG。

如果发现：

```text
<svg>...</svg>
```

而 Design System 已经提供对应 Brand primitive：

标记为：

`BRAND_DUPLICATION`

但不要直接认定所有复制都是错误。

判断是否存在真实需求。

---

# 6. Logo Color Compliance

重点检查：

* logo color
* currentColor
* --magi-logo-color
* dark theme
* light theme

禁止：

```css
fill: #000;
fill: #fff;
```

这种 hard-coded logo color，除非存在明确的 Brand exception。

检查：

```text
Theme
  ↓
--magi-logo-color
  ↓
MagiMark / MagiWordmark / MagiLockup
```

验证：

### Dark

Logo 必须具有足够 contrast。

### Light

Logo 必须具有足够 contrast。

同时检查：

> Product accent 是否错误地用于 Logo。

如果存在：

```css
color: var(--magi-accent)
```

应用在 logo 上：

标记：

`BRAND_CONTRACT_VIOLATION`

---

# 7. Theme Compliance

检查 MAGI Website 是否使用 Design System 的 Theme contract。

重点检查：

```text
data-magi-app
data-magi-theme
data-magi-accent
AppTheme
```

确认 Theme 的 ownership。

---

## Dark Theme

检查：

* background
* surface
* text
* border
* selection
* scrollbar
* logo

是否来自 Design System semantic tokens。

---

## Light Theme

如果网站支持 Light：

验证是否真正使用 Design System Light theme。

禁止 consumer 自己重新定义一套：

```text
--background
--foreground
--border
```

然后与 MAGI token 平行存在。

如果确实需要 product-specific token：

必须判断它是否属于：

* semantic product token
* component token
* local implementation detail

---

# 8. Token Compliance

这是本次 Audit 的核心之一。

扫描整个项目中的：

### Colors

搜索：

```text
#000
#000000
#fff
#ffffff
rgb(
rgba(
hsl(
hsla(
```

以及 Tailwind / CSS 中的：

```text
black
white
gray
neutral
zinc
slate
```

逐个判断：

> 是否应该使用 MAGI Design System semantic token？

---

# 9. Spacing Compliance

搜索 hard-coded：

```text
margin
padding
gap
space
inset
top
right
bottom
left
```

例如：

```css
padding: 24px;
gap: 16px;
margin-top: 48px;
```

不要机械地把所有 px 判定为错误。

判断：

### Shared design-system spacing

应该使用 MAGI token。

### Product-specific layout requirement

可以保留。

输出：

```text
spacing value
↓
MAGI token exists?
↓
Yes → should migrate
No  → product-specific / legitimate
```

---

# 10. Typography Compliance

检查：

* font-family
* font-size
* font-weight
* line-height
* letter-spacing

确认是否遵循 Design System typography tokens。

重点检查：

* body
* heading
* display
* caption
* label
* button
* navigation

特别检查是否存在大量：

```css
font-size: 14px;
font-size: 16px;
font-size: 20px;
font-size: 32px;
```

然后判断是否应该绑定 Design System typography token。

---

# 11. Radius Compliance

扫描：

```css
border-radius
```

判断是否使用：

* Design System radius token
* legitimate product-specific radius

特别关注：

```text
card
button
input
badge
modal
image
```

不要允许每个 component 自己定义完全不同的 radius language。

---

# 12. Shadow / Effect Compliance

检查：

* box-shadow
* text-shadow
* filter
* backdrop-filter
* blur
* glow

MAGI Design System 的视觉方向是：

> dark-first / restrained / precise / minimal

因此不要简单禁止所有 shadow。

判断：

* 是否符合 Design System visual language
* 是否属于 product-specific effect
* 是否形成独立的视觉语言

特别标记：

```text
neon glow
AI gradient
excessive glassmorphism
excessive blur
decorative glow
```

但不要因为存在这些效果就直接判定错误。

必须说明：

> 哪一条 Design System guideline 被违反。

---

# 13. Component Compliance

这是第二个核心。

对于每个 MAGI Design System 已提供的 component：

检查 Website 是否：

### A. 正确使用 Design System component

例如：

```tsx
import { Button } from '@tokyo3rdhq/magi-design-system'
```

### B. 自己重新实现

例如：

```tsx
<button className="...">
```

如果存在重复实现：

判断：

```text
Is semantic contract shared?
        │
   ┌────┴────┐
   │         │
  Yes       No
   │         │
Reuse DS   Product-owned
```

---

# 14. Component Contract Compliance

对于每个已使用的 Design System component：

对照：

`docs/component-contracts.md`

检查：

### Semantic structure

### Accessibility

### Visual states

### Token binding

例如 Button：

```text
default
hover
active
focus
disabled
```

Input：

```text
default
focus
error
disabled
```

Badge：

```text
semantic variants
```

Checkbox：

```text
keyboard
checked
disabled
focus
```

---

# 15. Product Component Boundary

不要追求：

> 所有组件都必须来自 Design System。

MAGI Design System 不是 Product Component Library。

允许：

```text
MAGI Design System
       │
       ├── Button
       ├── Card
       ├── Badge
       └── Input

magi.website
       │
       ├── Hero
       ├── ProductShowcase
       ├── ProductCard
       ├── ProductGrid
       └── LandingPageSection
```

判断标准：

> semantic contract 是否跨 MAGI products 稳定共享？

而不是：

> JSX 是否长得类似？

---

# 16. Layout Compliance

检查是否正确使用：

* Container
* Section
* Stack

如果项目中存在自己的：

```css
.container
.section
.stack
```

检查是否与 Design System 重复。

但是不要机械替换。

判断：

* 是否真的重复 semantic contract
* 是否存在 product-specific behavior
* 是否存在 responsive behavior 差异

---

# 17. Experience Guidelines Audit

重点阅读：

`docs/guidelines.md`

然后逐条检查 MAGI Website。

---

## Navigation

检查：

* navigation hierarchy
* max levels
* active state
* grouping
* terminology

---

## External links

检查：

* GitHub
* Discord
* Docs
* Models
* API
* Status

是否符合：

> text or icon + text

不要机械地把所有 destination 变成 icon-only。

---

## Icon-only

检查：

是否仅用于 conventional actions：

* Search
* Menu
* Close
* More
* Back
* Forward
* Theme
* Expand

如果 GitHub / Docs / Discord 被做成 icon-only：

标记为：

`EXPERIENCE_GUIDELINE_VIOLATION`

---

# 18. i18n Audit

如果网站支持多语言：

检查：

* language selector
* language names
* locale
* html lang
* content switching

特别检查：

是否使用 country flags 表示 language。

如果存在：

```text
🇺🇸 English
🇨🇳 中文
```

判断是否违反 Experience Guidelines。

不要直接修改。

先记录。

---

# 19. Accessibility Audit

检查：

* semantic HTML
* heading hierarchy
* button/link semantics
* keyboard navigation
* focus state
* contrast
* aria
* alt
* form labels
* landmark

重点：

```text
header
nav
main
section
footer
```

以及：

```text
h1 → h2 → h3
```

检查是否存在跳级。

---

# 20. Responsive Audit

至少检查：

* mobile
* tablet
* desktop
* wide desktop

关注：

* header
* navigation
* hero
* cards
* typography
* spacing
* CTA
* footer

特别检查：

是否为了 mobile 单独创造了一套完全不同的 visual language。

Responsive 应该是：

> same design language, different composition

而不是：

> separate mobile design system

---

# 21. CSS Architecture Audit

检查：

### Global CSS

是否存在大量：

```css
:root {
  --xxx
}
```

与 MAGI Design System token 平行。

### Component CSS

是否存在：

```css
.button
.card
.input
```

等与 Design System component 重名的 global class。

### Specificity

检查是否通过：

```css
!important
```

覆盖 Design System。

### Tailwind

如果使用 Tailwind：

检查是否存在大量：

```text
bg-black
text-white
border-white/10
rounded-xl
```

导致第二套 design token system。

---

# 22. Dependency Audit

检查：

```json
"@tokyo3rdhq/magi-design-system"
```

确认：

* version
* package manager
* lockfile
* import path
* CSS import
* React compatibility

确认没有：

* local copy
* git dependency
* duplicated package
* vendored Design System

---

# 23. Build / Runtime Audit

确认：

```text
install
build
typecheck
lint
test
```

全部正常。

同时检查：

* SSR
* hydration
* FOUC
* theme initialization
* CSS loading order

尤其检查 Theme 是否出现：

```text
First Paint
   ↓
wrong theme
   ↓
React mount
   ↓
correct theme
```

如果存在：

标记为：

`THEME_FOUC`

---

# 24. Design System Duplication Analysis

建立最终重复项列表：

```text
magi.website
      │
      ├── duplicate token
      ├── duplicate component
      ├── duplicate brand
      ├── duplicate layout primitive
      ├── duplicate theme
      └── legitimate product-specific implementation
```

每一个 duplicate 必须回答：

1. 是否真的重复？
2. Design System 是否已经提供？
3. 是否应该迁移？
4. 如果不迁移，为什么？
5. 是否应该反向推动 Design System 增加 contract？

---

# 25. Audit Severity

不要使用主观评分。

每个问题只使用：

### P0 — Design System Contract Violation

例如：

* wrong logo
* wrong theme architecture
* duplicated global token system
* accessibility blocker
* breaking Design System contract

### P1 — Strong Compliance Issue

例如：

* Design System component 被重复实现
* token 没有复用
* typography 不一致
* navigation guideline violation
* responsive inconsistency

### P2 — Improvement

例如：

* minor spacing inconsistency
* local CSS cleanup
* naming cleanup

### INFO

合理的 product-specific implementation。

---

# 26. 不允许的行为

本 Audit 阶段：

**不要修改代码。**

不要：

* refactor
* install dependencies
* add components
* change visual design
* change product IA
* rewrite CSS
* migrate components
* modify Design System

如果发现问题，只记录。

---

# 27. 最终输出格式

最终生成：

## 1. Executive Summary

回答：

> magi.website 是否符合 MAGI Design System？

不要给一个简单的分数。

使用：

```text
Overall status:
- COMPLIANT
- MOSTLY COMPLIANT
- PARTIALLY COMPLIANT
- NON-COMPLIANT
```

并解释原因。

---

## 2. Architecture Map

```text
Layer
Current implementation
Design System relationship
Status
```

---

## 3. Findings

表格：

| ID | Severity | Area | File | Finding | Design System Contract | Recommendation |
| -- | -------- | ---- | ---- | ------- | ---------------------- | -------------- |

---

## 4. Token Findings

单独列出：

* color
* typography
* spacing
* radius
* motion
* surface

---

## 5. Component Findings

单独列出：

* duplicated component
* correct reuse
* legitimate product component
* missing Design System primitive

---

## 6. Brand Findings

单独列出：

* Logo
* Wordmark
* Lockup
* Favicon
* App icon
* Logo color
* Theme interaction

---

## 7. Theme Findings

单独列出：

* Dark
* Light
* Accent
* data-magi-app
* data-magi-theme
* FOUC
* CSS variables

---

## 8. Accessibility Findings

列出：

* semantic
* keyboard
* focus
* ARIA
* contrast
* heading hierarchy
* landmarks
* forms

---

## 9. Experience Guidelines Findings

列出：

* navigation
* iconography
* external links
* i18n
* responsive
* header
* footer

---

# 28. 最终 Migration Backlog

最后不要直接改代码。

输出：

```text
P0
├── Issue
├── Issue
└── Issue

P1
├── Issue
└── Issue

P2
└── Issue

INFO
├── Product-owned
└── Product-owned
```

对于每个 P0/P1：

给出：

```text
Problem
Why it matters
Affected files
Design System contract
Recommended solution
Risk
Estimated scope
```

---

# 29. 最重要的判断原则

整个 Audit 必须遵循：

> MAGI Design System owns the visual and interaction language.
>
> Product owns the product experience.

因此：

**不要把 Product-specific UI 当成 Design System violation。**

同时：

**不要因为一个 UI 看起来“差不多”，就认为它符合 Design System。**

判断依据必须是：

```text
Brand Contract
Token Contract
Component Contract
Theme Contract
Accessibility Contract
Experience Guidelines
```

最终目的不是让 `magi.website` 变成一个 Design System Demo。

最终目的：

> `magi.website` 使用 MAGI Design System，但仍然保持自己的产品体验和信息架构。

Audit 完成后停止。

不要修改任何文件。

