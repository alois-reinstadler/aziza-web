# Fullscreen Nav Redesign

## Summary

Replace the current inline nav links + mobile dropdown with a fullscreen overlay menu on all screen sizes. Hamburger icon triggers a clip-path reveal animation; links are large Cormorant Garamond serif, stacked and centered.

## Top Bar

- Logo (left), hamburger toggle (right) — always visible
- Cart/search icons only on `/shop` routes (not marketing pages)
- Existing `data-navbar-dark` color adaptation stays
- Scrolled state: subtle backdrop-blur (existing behavior)

## Fullscreen Overlay

- **Trigger:** hamburger click toggles `menuOpen` state
- **Reveal:** `clip-path: inset()` transition — clips from top-right (hamburger position) to `inset(0)`. ~500ms cubic-bezier ease.
- **Background:** solid `#060608`
- **Links:** Shop, Collections, About, Journal — stacked vertically, centered. Cormorant Garamond, `clamp(2.5rem, 6vw, 5rem)`, weight 300.
- **Link stagger:** each link has `translateY(20px) + opacity: 0` → `translateY(0) + opacity: 1`, with incremental `transition-delay` (50ms apart). Only when opening.
- **Close:** same hamburger button morphs to X icon. Reverse clip animation on close.
- **Navigation:** overlay auto-closes on `afterNavigate`.
- **Body scroll:** locked when overlay is open.

## Link Hover

Subtle opacity shift (0.5 → 1) or slight translateX nudge.

## Implementation

- Pure CSS transitions (clip-path, transform, opacity, transition-delay)
- Svelte 5 runes for state (`$state`, `$derived`)
- No GSAP dependency needed
- Conditional cart/search via a `showCartControls` prop or route check
