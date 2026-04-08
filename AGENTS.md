# Project Overview
Single-page Thai advertorial landing for **CBD Vigasil** (male enhancement supplement).
Deployed as a Cloudflare Worker via `wrangler.jsonc`. The page is embedded inside an iframe on a parent domain (`sabai.wrldtops.site`).

# Project Structure
```
index.html              ← entire page: HTML + CSS + vanilla JS (single file)
wrangler.jsonc          ← Cloudflare Workers config (static asset serving)
assets/
  img/
    logo-5.png          ← brand logo
    photo_*.jpg         ← user feedback photos (4 files)
    products/           ← product box, jar, decor images
    documents/          ← FDA certificate, product spec images
  video/
    *.mp4               ← product demo video
.gitignore
AGENTS.md               ← this file
PROJECT_NOTES.md        ← operational notes for developers
```

# Stack
- **HTML5 + CSS3 + vanilla JS only** — no frameworks, no jQuery, no build step.
- CSS tokens live in `:root`. Glass surfaces use `.glass` and `.glass-strong` classes.
- Scroll-reveal animations use `IntersectionObserver` with `.will-reveal` / `.revealed` classes.

# Conventions
- Keep all markup, styles, and scripts inside `index.html`. Do not split into separate CSS/JS files.
- Use CSS custom properties from `:root` for all colors — never use one-off hex values for theme surfaces.
- Use imperative Thai sales copy. Direct size claims are allowed ("ขนาดเพิ่มขึ้น", "เพิ่มขนาด").
- Core size claim: up to 120% during erection; permanently +5–6 cm at rest with continued use. Always state both parts.
- Thai FDA ID: `11-1-13958-5-0571` — keep with regulatory details wherever they appear.
- Prefer small, local edits over replacing large HTML blocks.
- Before adding any `src` or `url()` reference, confirm the file exists under `assets/`.

# Form Configuration
- `FORM_CONFIG` reads endpoints from `data-*` attributes on `<body>` and URL query params.
- Form submission: `fetch()` POST to endpoint, hidden `<form>` iframe fallback, then redirect to `successUrl`.
- Do not change `data-form-endpoint`, `data-form-method`, `data-form-id`, `data-success-url` values without explicit instruction.

# Iframe Embedding
- The page loads `@iframe-resizer/child@5.5.9` for automatic height sync with the parent iframe.
- No custom JS scroll or resize logic — the child script handles resizing autonomously.
- CTA buttons are plain `<a href="#section">` anchors — they work natively in standalone mode.
- Do not add `scrollIntoView`, `postMessage` scroll commands, or modal overlays to work around iframe scroll issues.

# Deploy
- Static deploy via Cloudflare Workers: `wrangler.jsonc` serves the repo root as assets.
- Push to `main` triggers CI deploy (GitHub Actions).
- Do not hardcode Cloudflare account IDs or API tokens in repo files.

# Boundaries
- MUST: confirm asset paths exist before referencing them.
- MUST: commit changes at the end of each task with a clear message.
- MUST: update this AGENTS.md when changing project structure.
- MUST NOT: add runtime libraries (jQuery, Bootstrap, React, etc.).
- MUST NOT: commit `.cursor/`, `.playwright-mcp/`, `node_modules/`, or QA screenshots.
- MUST NOT: add JS-based scroll-to-section logic for CTA buttons (proven unreliable in iframe context).
- MUST NOT: modify form endpoint URLs without explicit instruction.
- ASK: before removing or restructuring existing HTML sections.
- ASK: before changing claims copy or regulatory information.
