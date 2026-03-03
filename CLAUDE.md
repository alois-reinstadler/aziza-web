# Claude Code — Aziza Web

## Stack

- SvelteKit + Svelte 5 (runes), TypeScript, Tailwind CSS v4, Bun
- i18n: Paraglide (EN/DE), wired into hooks and layout
- Deployment: `@sveltejs/adapter-node`

## Commands

```
bun dev       # dev server
bun build     # production build
bun check     # svelte-check (type errors)
bun lint      # prettier + eslint
bun format    # prettier --write
```

## Component Rules

- **Always check `$lib/components/ui/` first** — 40+ shadcn-svelte components available
- Custom components go in `$lib/components/<group>/` (e.g. `shop/`, `marketing/`)
- Only touch `$lib/components/ui/` to add base style changes or new variants
- Use `class` prop for one-off overrides

## Styling

- Tailwind v4 — `@import "tailwindcss"` (no config file, configured in `vite.config.ts`)
- Theme vars in `src/routes/layout.css`: `--primary`, `--secondary`, `--muted`, `--accent`, etc. (OKLCH)
- Dark mode via `.dark` class
- `cn()` from `$lib/utils` for conditional/merged class names

## Routes

- `src/routes/(marketing)/` — marketing pages
- `src/routes/` will also have shop routes
- Route groups don't affect URLs

## Shopify

- Packages installed, integration code is placeholder/commented
- Build frontend first; API integration comes later
