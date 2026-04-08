# Project Notes: CBD Vigasil Landing

## Purpose
- Single-page Thai advertorial landing for `CBD Vigasil`.
- Focus: trust-first tone, "Double Action" positioning (physical support + calm/confidence), and high-converting CTA flow.

## Stack and Structure
- Static stack only: `HTML + CSS + vanilla JS` in one main file: `index.html`.
- Primary visual style: glassmorphism (`.glass`, `.glass-strong`) and tokenized colors in `:root`.
- Main sections are vertical blocks with IDs used for CTA anchors (e.g. `#mechanism`, `#order-form`).

## Iframe Embedding
- The page is embedded inside an iframe on the parent domain (`sabai.wrldtops.site`).
- Height auto-resize is handled by `@iframe-resizer/child@5.5.9` — a self-initializing script with no custom wrapper.
- No custom JS scroll logic — CTA buttons use plain `<a href="#section">` anchors.

## Form Flow
- `FORM_CONFIG` reads `formEndpoint`, `formMethod`, `formId`, `successUrl` from `<body>` data attributes and URL query params.
- Visual form in `#order-form` (name + phone + submit button).
- Hidden fallback form: `#constructor-fallback-form`, method `POST`, target hidden iframe.
- Submit logic: validates name/phone, sends to configured endpoint, supports success redirect.

## Comments Block
- Comments area is in `#real-comments`.
- Uses a bounded viewport (`#comments-scroll`) with internal scrolling.
- Runtime comments appended by `addRandomComment`; oldest removed when over `MAX_VISIBLE_COMMENTS`.

## Assets
- Images: `assets/img/` (logo, product photos, FDA documents, feedback photos)
- Video: `assets/video/`
- Only web-optimised files belong in git — no `.psd`, `.mov`, raw footage, or design source files.

## Deploy
- Cloudflare Workers via `wrangler.jsonc` (static asset serving).
- Push to `main` triggers CI deploy (GitHub Actions).
