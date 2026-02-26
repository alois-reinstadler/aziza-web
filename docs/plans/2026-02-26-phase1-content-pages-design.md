# Phase 1: Content Pages Design

## Overview

Build out the remaining content pages for Aziza using the established magazine design language. Key pages (About, Sustainability, Journal) get the full editorial treatment with scroll animations. Utility pages (Contact, Legal) get clean, functional layouts.

## Pages

### 1. About (`/about`) — Editorial treatment

**Narrative:** Manifesto-style, values-driven. No founder focus — the brand speaks for itself.

**Sections:**

1. **Hero** — Full-width image, overlay headline ("Where Home Becomes Heaven"), atmospheric subline. Parallax on image.
2. **Manifesto Block** — Centered large serif text, 2-3 paragraphs on brand beliefs. Generous whitespace.
3. **Values Grid** — 2-column grid with icons. Reuses the 5 values from MagCraftStrip (Natural Fibres, Botanical Craft, Made to Last, Quiet Luxury, Considered Design).
4. **Process Timeline** — "From Field to Home" horizontal timeline with 3 steps (Sourced, Woven, Home) and images.
5. **Press/Trust Strip** — Row of placeholder publication names. Muted, subtle credibility.
6. **Newsletter CTA** — Reuse or simplify MagNewsletter.

**Animations:** `reveal-up` on all sections, `parallax` on hero. Nothing elaborate.
**Images:** 1 hero, 2-3 process images (placeholders).

### 2. Sustainability (`/sustainability`) — Editorial treatment

**Sections:**

1. **Hero** — Craft/nature image, headline ("Made with Intention"), short subline. Parallax.
2. **Materials Showcase** — 3 cards: Organic Cotton, Belgian Linen, Silk-Cotton Blend. Image, name, origin, certification, description.
3. **By the Numbers** — Stats strip with `countUp` animation (100% organic, 3 family-run mills, 0 synthetic dyes, 100+ wash cycles).
4. **Supply Chain** — Two-column (image + text). Field-to-finish journey, mentions Portugal/Belgium/Flanders mills.
5. **Certifications** — Grid of certification badges (GOTS, OEKO-TEX, etc.). Placeholder logos.
6. **CTA** — "Explore Our Collections" linking to `/collections`.

**Animations:** `reveal-up`, `countUp` on stats, `parallax` on hero.
**Images:** 1 hero, 3 material close-ups, 1 supply chain image (placeholders).

### 3. Journal (`/journal` + `/journal/[slug]`) — Editorial treatment

**Approach:** Visual-forward feed. Low maintenance — a lookbook image with a short caption looks just as intentional as a full article.

**Index page:**

1. **Header** — "Journal" title + subline. No hero image.
2. **Featured Post** — Full-width, large image with title overlay, date, category tag.
3. **Post Grid** — 2-column grid. Cards: image, category tag, title, date. No excerpts.
4. **Newsletter CTA** at bottom.

**Article detail:**

1. **Article Header** — Category tag, title (large serif), date, optional full-width hero image.
2. **Content Body** — `max-w-prose` centered column. Supports: paragraphs, full-width images, pull quotes, image pairs.
3. **Back link** — "Back to Journal".

**Data:** Hardcoded array of 3-4 placeholder posts. Same config pattern as collections.
**Animations:** `reveal-up` on grid cards with stagger. Minimal on article pages.

### 4. Collections Index (`/collections`) — Clean

- **Header** — "Our Collections" title + subline.
- **Grid** — 2x2 desktop, 1-col mobile. Image, name, tag, description. Hover: subtle image scale. Links to `/collections/[id]`.
- Data: existing collections config.

### 5. Contact (`/contact`) — Clean

- **Header** — "Get in Touch" + one-liner.
- **Two-column:** Left: form (name, email, message, submit button — non-functional). Right: `mailto:` link, Berlin address, social links (placeholder URLs).
- **Below:** Showroom hours/note (placeholder).

### 6. Legal Pages — Clean, shared template

All four use the same layout: page title + `max-w-prose` centered column with structured placeholder text.

- **Privacy** (`/privacy`) — Data collection, cookies, third parties, rights.
- **Terms** (`/terms`) — General terms, orders, returns, liability.
- **Shipping** (`/shipping`) — Delivery times, costs, returns, regions.
- **Imprint** (`/imprint`) — Company name, address, registration, VAT (DE Impressum).

## Shared Patterns

- **Animation:** `reveal-up` (scroll-triggered opacity + translateY) is the default for all pages. `countUp` and `parallax` only on editorial pages.
- **Typography:** Cormorant Garamond serif for headings, system sans for body. Section labels: uppercase, tracking-widest, muted.
- **Dark mode:** All pages support dark mode via theme variables.
- **Images:** Unsplash placeholders throughout. All images get `aspect-*` classes for consistent layout.
- **Data:** Hardcoded config files for journal posts and page content. CMS-ready structure.

## Components to Create

- `AboutHero.svelte` — or reuse pattern inline
- `MaterialCard.svelte` — for sustainability materials showcase
- `JournalCard.svelte` — for journal grid
- `LegalPage.svelte` — shared template for all 4 legal pages
- `ContactForm.svelte` — form UI (non-functional)

## Config Files to Create

- `src/lib/config/journal.ts` — placeholder posts array
