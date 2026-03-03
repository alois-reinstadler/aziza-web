# Shop Buildout Design

**Date:** 2026-03-03

## Overview

Polish the existing shop pages, add collection filtering, search, and related products. Keep the editorial `/collections/[id]` story pages as-is — they link into the shop. The shop gets a hybrid style: clean product grids with editorial touches (serif typography, spacing, transitions).

## 1. Shopify API — New Queries

Add to `shopify-queries.ts`:

- **`getCollections(first)`** — fetch all collections (handle, title, image)
- **`getCollectionProducts(handle, first, sortKey, after)`** — fetch products within a collection
- **`searchProducts(query, first)`** — product search via Shopify's `query` param
- **Update `getProducts`** — add optional `after` cursor param for pagination

## 2. Shared Product Card Component

Extract product card from shop listing into `$lib/components/shop/ProductCard.svelte`.

**Props:** `product`, `index` (stagger delay), `onQuickAdd`

**Features:**
- Serif product title (`font-serif`)
- Compare-at-price with strikethrough when `compareAtPrice` exists
- Quick-add button (slide up on hover, always visible on mobile)
- "Select Options" for multi-variant products

Used by: shop listing, search results, related products on PDP.

## 3. Shop Listing (`/shop`) — Polish + Collection Filtering

**Collection filter pills:**
- "All" + each Shopify collection name
- Active pill: `border-foreground bg-foreground text-background`
- URL: `/shop?collection=handle`
- Server load fetches collections list for pills

**Pagination:**
- "Load More" button at bottom
- Cursor-based via Shopify `pageInfo.hasNextPage` + `endCursor`
- URL param: `?after=cursor`

**Server load changes:**
- Fetch collections list (always)
- If `?collection=handle`, use `getCollectionProducts`; otherwise `getProducts`
- Pass `after` cursor for pagination

## 4. Product Detail (`/shop/[handle]`) — Polish

**Image gallery:**
- Desktop: sticky image column (`sticky top-32`)
- Larger thumbnail click targets
- Horizontal scroll thumbnails on mobile

**Pricing:**
- Show `compareAtPrice` struck through next to real price when applicable

**Related products:**
- Section below main product
- Fetch 4 products from same tags or random
- Uses shared `ProductCard` component
- New `getRelatedProducts` query (exclude current product ID)

## 5. Search (`/shop/search`)

**Page structure:**
- Large search input with debounced URL update (300ms)
- URL: `/shop/search?q=term`
- Server load uses `searchProducts(query)`
- Results in same 2x3 product grid using `ProductCard`
- Empty state: "No results for [query]"
- Initial state (no query): "Search our collection"

## 6. Unchanged

- `/collections/[id]` editorial story pages — untouched
- Cart page, cart drawer, cart API, cart toast — already solid
