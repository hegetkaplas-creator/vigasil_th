# Project Overview
Single-page Thai advertorial landing for **CBD Vigasil** (male enhancement supplement).
Built with Astro (static output), deployed as a Cloudflare Worker via `wrangler.jsonc`. The page is embedded inside an iframe on a parent domain (`sabai.wrldtops.site`).

# Project Structure
```
src/
  layouts/
    Base.astro            ← html/head/body shell, fonts, global scripts (FORM_CONFIG, observer, iframe-resizer)
  components/
    Topline.astro         ← logo bar + FDA line
    Hero.astro            ← headline, proof cards, promo price, CTAs, product images
    BlackGalangalResearch.astro ← post-hero evidence section with Kaempferia parviflora study links
    TrustStrip.astro      ← trust badge row
    Problems.astro        ← "ปัญหาที่พบได้บ่อย" section (dark)
    Mechanism.astro       ← #mechanism double-action chain
    Ingredients.astro     ← 4 extracts grid + stats ribbon
    Comparison.astro      ← #comparison featured vs alternatives (dark)
    Offer.astro           ← #offer facts grid + course card
    Timeline.astro        ← timeline section
    Regulatory.astro      ← อย. cards + document cards
    VideoFeedback.astro   ← video block + photo feedback
    ClientResults.astro   ← gated results vault after video feedback, auto-loads media from public/assets/result
    Comments.astro        ← #real-comments + comment simulator script
    OrderForm.astro       ← #order-form lead form + fallback form + handleOrder script
    DeliveryFaq.astro     ← delivery grid + FAQ + toggleFaq script
    Footer.astro          ← minimal footer
    StickyBar.astro       ← fixed bottom CTA
  pages/
    index.astro           ← imports Base layout + all components in order
  styles/
    global.css            ← :root tokens, body bg, glass classes, keyframes, shared utilities
public/
  assets/
    img/                  ← logo, product photos, FDA documents, feedback photos
    video/                ← product demo video
astro.config.mjs          ← static output, inline stylesheets, HTML compression
package.json
wrangler.jsonc            ← Cloudflare Workers config (serves dist/ as assets)
.github/workflows/
  deploy-worker.yml       ← CI: npm ci → astro build → wrangler deploy
AGENTS.md                 ← this file
PROJECT_NOTES.md          ← operational notes
.gitignore
```

# Stack
- **Astro** (static output) — components split into `.astro` files with scoped CSS.
- **CSS tokens** in `:root` via `src/styles/global.css`. Glass surfaces use `.glass` and `.glass-strong`.
- **Vanilla JS** via `<script is:inline>` — no client-side framework. Scripts are split per component.
- **Scroll-reveal animations** use `IntersectionObserver` with `.will-reveal` / `.revealed` classes.
- Build output: single `dist/index.html` with all CSS inlined and HTML compressed.

# Conventions
- Each section is a separate `.astro` component. Global/shared CSS stays in `global.css`; component-specific CSS is scoped via `<style>` in each `.astro` file.
- Use CSS custom properties from `:root` for all colors — never one-off hex values for theme surfaces.
- Use imperative Thai sales copy. Direct size claims are allowed ("ขนาดเพิ่มขึ้น", "เพิ่มขนาด").
- Core size claim: up to 120% during erection; permanently +5–6 cm at rest with continued use. Always state both parts.
- Thai FDA ID: `11-1-13958-5-0571` — keep with regulatory details wherever they appear.
- Before adding any `src` or `url()` reference, confirm the file exists under `public/assets/`.

# Form Configuration
- `FORM_CONFIG` (in `Base.astro`) reads endpoints from `data-*` attributes on `<body>` and URL query params.
- Form submission: `fetch()` POST to endpoint, hidden `<form>` iframe fallback, then redirect to `successUrl`.
- Do not change `data-form-endpoint`, `data-form-method`, `data-form-id`, `data-success-url` values without explicit instruction.

# Iframe Embedding (non-standard architecture)
This is NOT a standalone page — it runs inside an iframe on a parent domain.
Understanding this is critical for any UI/scroll/CTA work.

- **Parent site:** `sabai.wrldtops.site` (Vite SPA). Loads `@iframe-resizer/parent` with `inPageLinks: false`.
- **This page (child):** loads `@iframe-resizer/child@5.5.9` for automatic height sync.
- iframe-resizer stretches the iframe to full content height — no scrollbar inside the iframe. All scrolling happens on the parent page.
- **Known limitation:** `<a href="#order-form">` and `scrollIntoView()` do NOT visually scroll the page when viewed inside the iframe.
- CTA buttons currently use plain `<a href="#section">` anchors. They work in standalone mode but **do not scroll in iframe mode** until the parent enables `inPageLinks: true`.
- Do not attempt to fix iframe scrolling purely from the child side — it requires parent-side changes.

# Build & Deploy
- **Dev:** `npm run dev` (Astro dev server with HMR)
- **Build:** `npm run build` (outputs to `dist/`)
- **Deploy:** Push to `main` triggers CI (`.github/workflows/deploy-worker.yml`): `npm ci → npm run build → npm run deploy` (Wrangler is a pinned `devDependency`; `package-lock.json` is committed for reproducible installs)
- Do not hardcode Cloudflare account IDs or API tokens in repo files.
- **Raster/video under `public/assets/`** (png, jpg, webp, gif, mp4, webm) are **`.gitignore`d** — they stay on your machine only. GitHub Actions builds **without** those binaries unless you add another step (e.g. download from R2, `actions/download-artifact`, or stop ignoring for CI-only). For a full prod deploy from CI, either commit those assets again, host them on a CDN and change URLs, or inject them in the workflow.

# Boundaries
- MUST: confirm asset paths exist before referencing them (under `public/assets/`).
- MUST: commit changes at the end of each task with a clear message.
- MUST: update this AGENTS.md when changing project structure.
- MUST NOT: add runtime libraries (jQuery, Bootstrap, React, etc.) as client-side dependencies.
- MUST NOT: commit `.cursor/`, `.playwright-mcp/`, `node_modules/`, `dist/`, `.astro/`, or QA screenshots.
- MUST NOT: add JS-based scroll-to-section logic for CTA buttons (proven unreliable in iframe context).
- MUST NOT: modify form endpoint URLs without explicit instruction.
- ASK: before removing or restructuring existing components.
- ASK: before changing claims copy or regulatory information.
