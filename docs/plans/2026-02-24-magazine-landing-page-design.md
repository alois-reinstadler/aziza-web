# Magazine Landing Page — "The Issue"

## Overview

Alternative landing page for Aziza with an editorial/high-fashion magazine aesthetic. Features cinematic hero animations, asymmetric layouts, scroll-driven reveals, and a bento grid. Lives on a separate feature branch (`feature/magazine-landing`).

## Design Principles

- **Editorial typography**: Cormorant Garamond at dramatic sizes (6-12vw for headlines)
- **Asymmetric layouts**: No uniform grids — intentional visual tension
- **Cinematic animations**: Curtain reveals, letter-by-letter staggers, scroll-driven transforms
- **Whitespace as design element**: Generous spacing, especially in newsletter section
- **No heavy animation libraries**: Pure CSS + IntersectionObserver + Svelte transitions

## Sections

### 1. Cover (Hero) — Cinematic Reveal

**Layout:**
- Full viewport (100vh), full-bleed hero image
- Oversized serif headline offset: "SPRING" top-left, "COLLECTION" bottom-right
- Issue label top-right: "Issue 01 — Spring 2025"
- Subtext + CTA bottom-left

**Animation sequence (page load):**
1. `0ms` — Black screen
2. `300ms` — Horizontal curtain splits from center (clip-path)
3. `600ms` — Hero image revealed, subtle scale 1.05 → 1.0
4. `800ms` — Headline letters fly in staggered (from below)
5. `1100ms` — Subtext and CTA fade in
6. `scroll` — Parallax: image moves slower than text layer

**Tech:** CSS `@keyframes` + `clip-path`, Svelte `transition:fly` with stagger, scroll listener for parallax.

### 2. Editorial Spread (Brand Story + Collections merged)

**Layout:**
- Asymmetric grid: 40% left / 60% right (desktop), stacked on mobile
- Left column: Large serif headline + brand text, `position: sticky`
- Right column: Alternating large/small images with text blocks. Features 2 collections (Imperial Bloom, Maison Jardin)
- Thin vertical divider line between columns

**Scroll animations:**
- Left headline: wipe reveal (left to right)
- Right images: fade + slide (alternating from left/right)
- Text blocks: line-by-line staggered fade-in
- Vertical line: "draws itself" top-to-bottom on scroll

**Tech:** IntersectionObserver, CSS translate + opacity, `position: sticky`.

### 3. The Collections — Bento Grid

**Layout:**
- Bento/masonry grid with 4 collections:
  - 1 large tile (2col x 2row) — feature collection
  - 2 medium tiles (1col x 1row each)
  - 1 wide tile (2col x 1row)
- Each tile: background image, title overlay, tag badge
- Hover: image zoom (1.05), darker overlay, description text appears

**Scroll animations:**
- Tiles appear staggered (100ms per tile)
- Scale 0.95 → 1.0 + opacity 0 → 1

### 4. Craft & Values — Horizontal Filmstrip

**Layout:**
- Full-width, dark background
- Section headline centered: "The Aziza Craft"
- Horizontal scroll container with 3 cards:
  - Each: large icon left, title + text right
  - Natural Fibres | Botanical Craft | Made to Last
- Desktop: scroll-triggered horizontal sliding (vertical scroll drives horizontal translate)
- Mobile: normal vertical stack

**Scroll animation:**
- Container `translateX()` driven by scroll position
- Cards have subtle rotation + scale on entry

### 5. The Circle (Newsletter) — Typography Focus

**Layout:**
- Light background, maximum whitespace
- Large centered serif headline: "Join the Circle" (6-8vw)
- Short subtext
- Single elegant email input + submit button
- No background image — pure typography

**Animation:**
- Headline letters fade in individually (subtler than hero)
- Input field slides in from below

## Animation Technical Strategy

All animations use native browser APIs — no GSAP, Framer Motion, or similar:

| Technique | Used For |
|-----------|----------|
| CSS `@keyframes` + `clip-path` | Hero curtain reveal |
| Svelte `transition:fly/fade` | Element entrances |
| `IntersectionObserver` | Scroll-triggered reveals |
| CSS `transform` + scroll listener | Parallax, horizontal scroll |
| `position: sticky` | Editorial spread left column |
| CSS `transition` | Hover effects |

## File Structure

New/modified files (all in feature branch):

```
src/routes/(marketing)/+page.svelte          — new section imports
src/lib/components/magazine/
  MagHero.svelte                              — cinematic hero
  MagEditorialSpread.svelte                   — brand story + collections
  MagBentoGrid.svelte                         — bento collection grid
  MagCraftStrip.svelte                        — horizontal values strip
  MagNewsletter.svelte                        — typography newsletter
  animations.ts                               — shared animation utilities
```

Existing Navbar and Footer remain unchanged. New components prefixed with `Mag` to avoid conflicts with existing marketing components.

## Responsive Strategy

- **Desktop (1024px+):** Full editorial layout with all animations
- **Tablet (768-1023px):** Simplified grid ratios, sticky disabled
- **Mobile (<768px):** Single column, horizontal strip becomes vertical, reduced animation complexity (no parallax, simpler staggers)
