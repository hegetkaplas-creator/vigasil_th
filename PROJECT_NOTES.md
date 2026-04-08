# Project Notes: CBD Vigasil Landing

## Purpose
- Single-page Thai advertorial landing for `CBD Vigasil`.
- Focus: trust-first tone, "Double Action" positioning (physical support + calm/confidence), and high-converting CTA flow.

## Stack and Structure
- Static stack only: `HTML + CSS + vanilla JS` in one main file: `index.html`.
- Primary visual style: glassmorphism (`.glass`, `.glass-strong`) and tokenized colors in `:root`.
- Main sections are vertical blocks with IDs used for CTA scrolling (for example: `#mechanism`, `#order-form`).

## Embedded Mode (Important)
- The page is used inside an iframe on the parent domain.
- `INTEGRATION_CONFIG` is read from query params and `data-*` attributes on `<body>`.
- Key embed values currently used:
  - `data-parent-origin`
  - `data-parent-path`
  - `data-form-endpoint`
  - `data-form-method`
  - `data-form-id`
  - `data-success-url`
- Sticky bar behavior:
  - hidden in embedded mode by default (`body.embed-iframe .sticky-bar { display: none; }`)
  - optional with `embedSticky=1`.

## Scroll / CTA Behavior
- CTA buttons call:
  - `scrollToForm()` -> `#order-form`
  - `scrollToSection('mechanism')`
- Allowed section IDs are controlled by `SECTION_ALLOWLIST`.
- Current embedded scroll strategy: scroll to section start (`el.scrollIntoView({ block: "start" })`) to avoid mid-block jumps on desktop.

## Form Flow
- Visual form in `#order-form` (name + phone + submit button).
- Hidden fallback form: `#constructor-fallback-form`, method `POST`, target hidden iframe.
- Submit logic:
  - validates name/phone
  - sends to configured endpoint (`formEndpoint`)
  - supports success redirect if configured.

## Comments Block and Layout Stability
- Comments area is in `#real-comments`.
- Dynamic auto-append comments (`addRandomComment`) are now enabled only in standalone mode:
  - active when `window === window.parent`
  - disabled in embedded iframe mode to prevent runtime height growth and footer drift.

## Assets and Docs
- Images: `assets/img/...`
- Video: `assets/video/...`
- Product/compliance source files: `docs/product/...`
- Do not commit temporary QA screenshots or debug artifacts from local Playwright checks.

## Operational Notes
- When testing scroll/layout regressions, verify both:
  - desktop iframe behavior
  - mobile iframe behavior
- If layout "drifts" near bottom sections, first check:
  - dynamic DOM growth (comments/timers)
  - iframe resize notifications
  - section height changes after delayed scripts.
