# Phase 1: Content Pages Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build all Phase 1 content pages (About, Sustainability, Journal, Collections Index, Contact, Legal) using established design patterns.

**Architecture:** Each page is a standalone Svelte component at its route path. Editorial pages (About, Sustainability, Journal) reuse animation utilities from `$lib/components/magazine/animations.ts`. Utility pages (Contact, Legal) use shadcn-svelte components with minimal animation. Shared data lives in `$lib/config/` files.

**Tech Stack:** SvelteKit, Svelte 5 (runes), Tailwind CSS v4, shadcn-svelte UI components, Lucide icons.

---

### Task 1: Journal Config Data

**Files:**

- Create: `src/lib/config/journal.ts`

**Step 1: Create journal posts config**

```typescript
export interface JournalPost {
	slug: string;
	title: string;
	category: 'Lookbook' | 'Behind the Scenes' | 'Styling' | 'New Arrival';
	date: string;
	image: string;
	featured?: boolean;
	content?: {
		intro: string;
		body: string[];
		pullQuote?: string;
		images?: { src: string; alt: string }[];
	};
}
```

Create 4 placeholder posts with categories: 1 featured lookbook, 1 behind the scenes, 1 styling, 1 new arrival. Use existing placeholder images from `$lib/assets/placeholder/` and `$lib/assets/stock-images/`.

**Step 2: Verify imports work**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/config/journal.ts
git commit -m "feat: add journal posts config with placeholder data"
```

---

### Task 2: Legal Page Template + All 4 Legal Pages

**Files:**

- Create: `src/lib/components/marketing/LegalPage.svelte`
- Create: `src/routes/(legal)/privacy/+page.svelte`
- Create: `src/routes/(legal)/terms/+page.svelte`
- Create: `src/routes/(legal)/shipping/+page.svelte`
- Create: `src/routes/(legal)/imprint/+page.svelte`

**Step 1: Create shared LegalPage component**

A simple component accepting `title: string` and a `children` snippet. Layout:

- `data-navbar-dark` on outer section for navbar detection
- `pt-32 pb-20` padding (account for fixed navbar)
- `max-w-prose mx-auto px-6` centered content column
- Title as `h1` in serif, `text-4xl font-light`
- `children` rendered below with prose-style spacing (`space-y-6`)

**Step 2: Create all 4 legal pages**

Each page imports `LegalPage` and renders structured placeholder content:

- **Privacy** — Sections: Data We Collect, How We Use It, Cookies, Third Parties, Your Rights, Contact
- **Terms** — Sections: General, Orders & Payment, Shipping & Delivery, Returns, Liability, Governing Law
- **Shipping** — Sections: Delivery Times, Shipping Costs, International Shipping, Returns & Exchanges, Damaged Items
- **Imprint** — Sections: Company Info (Aziza Home GmbH, Berlin address), Managing Director, Registration (Amtsgericht Charlottenburg), VAT ID, Contact, Responsible for Content

Each section: `h2` heading + 1-2 short placeholder paragraphs. Mark placeholder text clearly with realistic-looking but obviously placeholder content (e.g. "Aziza Home GmbH", "Musterstraße 42, 10115 Berlin").

**Step 3: Verify**

Run: `bun check`
Expected: 0 errors

**Step 4: Commit**

```bash
git add src/lib/components/marketing/LegalPage.svelte src/routes/\(legal\)/
git commit -m "feat: add legal pages (privacy, terms, shipping, imprint) with placeholder content"
```

---

### Task 3: Contact Page

**Files:**

- Create: `src/routes/(marketing)/contact/+page.svelte`

**Step 1: Build contact page**

Structure:

- `data-navbar-dark` section, `pt-32 pb-20`
- Header: "Get in Touch" (serif h1) + one-liner subtext
- Two-column grid (`lg:grid-cols-2`):
  - **Left column:** Contact form with `Input` components (Name, Email, Subject) and a `textarea` for message. `Button` submit. Non-functional — `onsubmit` just shows a "Thank you" message via `$state`.
  - **Right column:** Contact info block:
    - Email: `hello@aziza-home.com` as `mailto:` link
    - Address: Aziza Home GmbH, Musterstraße 42, 10115 Berlin
    - Social links: Instagram, Pinterest (placeholder `#` hrefs)
    - Showroom note: "Visit our showroom by appointment" with placeholder hours
- `reveal-up` animation via `inView` on both columns
- Use `Input` and `Button` from `$lib/components/ui/`

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/\(marketing\)/contact/+page.svelte
git commit -m "feat: add contact page with form and info"
```

---

### Task 4: Collections Index Page

**Files:**

- Modify: `src/routes/(marketing)/collections/+page.svelte` (currently empty)

**Step 1: Build collections index**

Structure:

- `data-navbar-dark` section, `pt-32 pb-20`
- Header: "Our Collections" (serif h1) + subline about craftsmanship
- Grid: `grid-cols-1 sm:grid-cols-2 gap-8`
- Each collection card (from `$lib/config/collections`):
  - Link wrapping the card (`<a href={col.href}>`)
  - Image with `aspect-4/5`, `object-cover`, hover scale (`group-hover:scale-105`, `transition-transform duration-700`)
  - Below image: tag (uppercase, tracking-wide, muted), name (serif h2), description
- `reveal-up` with stagger (`transition-delay: {i * 120}ms`) via `inView`
- Import `collections` from `$lib/config/collections`
- Import `inView` from `$lib/components/magazine/animations`

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/\(marketing\)/collections/+page.svelte
git commit -m "feat: add collections index page with grid layout"
```

---

### Task 5: About Page

**Files:**

- Create: `src/routes/(marketing)/about/+page.svelte`

**Step 1: Build about page**

This is an editorial page with full animation treatment. Sections:

**Hero section:**

- `data-navbar-dark`, `relative min-h-[70vh] flex items-end pb-20`
- Background image (use existing placeholder, e.g. `craft-01.jpg`) with `absolute inset-0 object-cover`
- Parallax on image via `style="transform: translateY({scrollY * 0.15}px)"`
- Dark overlays (`bg-linear-to-t from-black/70 via-black/20 to-transparent`)
- Label: "About Aziza" (uppercase, tracking)
- Headline: "Where Home Becomes Heaven" (serif, text-5xl+)
- Subline: one sentence about brand mission

**Manifesto section:**

- Centered text (`max-w-3xl mx-auto text-center`), `py-24 lg:py-32`
- 2-3 paragraphs of manifesto copy about what Aziza believes
- Large serif text for the opening line, regular size for rest
- `reveal-up` on each paragraph

**Values Grid section:**

- `py-24 lg:py-32`, section label "Our Values"
- 2-column grid on desktop (`lg:grid-cols-2 gap-12`)
- 5 values from MagCraftStrip data (Leaf/Natural Fibres, Sparkles/Botanical Craft, Clock/Made to Last, Gem/Quiet Luxury, Heart/Considered Design)
- Each value: icon in bordered square + title + description
- `reveal-up` with stagger
- Import icons from `@lucide/svelte`

**Process Timeline section:**

- `py-24 lg:py-32 border-t border-border/30`
- Label: "From Field to Home"
- 3-column grid (`sm:grid-cols-3 gap-12`)
- Steps: 01 Sourced, 02 Woven, 03 Home — each with number, title, description, and image
- `reveal-up` with stagger

**Press Strip section:**

- `py-16 border-y border-border/30`
- Label: "As Featured In"
- Row of 4-5 placeholder publication names in muted text: "Architectural Digest", "Elle Decoration", "Wallpaper\*", "Monocle", "The New York Times"
- Centered, flex row, `text-muted-foreground/40`

**Newsletter CTA:**

- Import and use `MagNewsletter` component directly

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/\(marketing\)/about/+page.svelte
git commit -m "feat: add about page with manifesto, values, and process timeline"
```

---

### Task 6: Sustainability Page

**Files:**

- Create: `src/routes/(marketing)/sustainability/+page.svelte`

**Step 1: Build sustainability page**

Editorial page with animations. Sections:

**Hero section:**

- Same pattern as About hero but different image (use `story-01.jpg` or a stock image)
- Headline: "Made with Intention"
- Subline about sustainability commitment
- `data-navbar-dark`, parallax on image

**Materials Showcase section:**

- `py-24 lg:py-32`, label "Our Materials"
- 3-column grid (`sm:grid-cols-3 gap-8 lg:gap-12`)
- Cards for: Organic Cotton, Belgian Linen, Silk-Cotton Blend
- Each card: image (use stock images as placeholders), material name (serif h3), origin text, certification badge text, short description
- `reveal-up` with stagger

**By the Numbers section:**

- `py-16 border-y border-border/30`
- 4-column grid of stats with `countUp`:
  - 100 (suffix: "%") — "Organic materials"
  - 3 — "Family-run mills"
  - 0 — "Synthetic dyes"
  - 100 (suffix: "+") — "Wash cycles tested"
- Same pattern as MagEditorialSpread Key Facts but 4 columns
- Import `countUp` from animations

**Supply Chain section:**

- `py-24 lg:py-32`, label "Our Supply Chain"
- Two-column grid (`lg:grid-cols-2 gap-16 items-center`)
- Left: image (placeholder)
- Right: heading "From Field to Finished" + 2-3 paragraphs about Portugal/Belgium/Flanders mills
- `reveal-up` on both columns

**Certifications section:**

- `py-20 lg:py-24`, label "Certifications"
- Centered grid of 3-4 certification items
- Each: bordered box with certification name and one-line description
- GOTS, OEKO-TEX Standard 100, EU Ecolabel, Fair Trade (placeholder)

**CTA section:**

- `py-24 border-t border-border/30`
- Centered: "Explore Our Collections" heading + description + Button linking to `/collections`

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/\(marketing\)/sustainability/+page.svelte
git commit -m "feat: add sustainability page with materials, stats, and supply chain"
```

---

### Task 7: Journal Index Page

**Files:**

- Create: `src/routes/(marketing)/journal/+page.svelte`

**Step 1: Build journal index**

Structure:

**Header:**

- `data-navbar-dark`, `pt-32 pb-12`
- "Journal" (serif h1) + subline about stories from behind the loom

**Featured Post:**

- Full-width, `aspect-21/9` image with overlay
- Category tag (uppercase, tracking), title (serif, large), date
- Links to `/journal/[slug]`
- `reveal-up` animation

**Post Grid:**

- `grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-12`
- Remaining (non-featured) posts from journal config
- Each card: image (`aspect-3/4`), category tag, title, date
- Hover: image scale
- `reveal-up` with stagger
- Import posts from `$lib/config/journal`

**Newsletter CTA:**

- Reuse `MagNewsletter`

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/\(marketing\)/journal/+page.svelte
git commit -m "feat: add journal index page with featured post and grid"
```

---

### Task 8: Journal Article Page

**Files:**

- Create: `src/routes/(marketing)/journal/[slug]/+page.svelte`

**Step 1: Build journal article template**

Structure:

**Article Header:**

- `data-navbar-dark`, `pt-32 pb-12`
- Category tag (uppercase, tracking, muted)
- Title (serif, `text-4xl lg:text-5xl`, font-light)
- Date (muted, text-sm)
- Optional full-width hero image below (`aspect-21/9`)

**Content Body:**

- `max-w-prose mx-auto px-6`
- Intro paragraph (larger text, `text-lg leading-relaxed`)
- Body paragraphs (regular size, `leading-relaxed text-muted-foreground`)
- Pull quote if present (serif, italic, `text-2xl`, border-left)
- Content images: break out of prose column to full width when present

**Back Link:**

- `max-w-prose mx-auto px-6 py-12`
- "← Back to Journal" link to `/journal`

**Data:** Look up post by `page.params.slug` from journal config. Fallback to first post if not found.

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/\(marketing\)/journal/\[slug\]/+page.svelte
git commit -m "feat: add journal article detail page"
```

---

### Task 9: Final Check + Format

**Step 1: Run full type check**

Run: `bun check`
Expected: 0 errors

**Step 2: Format all files**

Run: `bun format`

**Step 3: Verify dev server builds**

Run: `bun build`
Expected: clean build

**Step 4: Commit any formatting changes**

```bash
git add -A
git commit -m "chore: format all phase 1 content pages"
```
