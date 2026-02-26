# Phase 2: Shopify Integration Design

## Overview

Integrate Shopify Storefront API using raw `fetch` (no SDK). Server-side data loading via SvelteKit load functions. Cart state managed entirely by Shopify Cart API with a cookie for cart ID persistence.

## Architecture Decisions

- **Raw fetch** over Shopify SDK — simple GraphQL POST wrapper, zero dependencies
- **Server-side only** data loading (`+page.server.ts`) — good SEO, private token stays server-side
- **Shopify-managed cart** — every cart action is a server mutation, cart ID in cookie, no client-side cart state
- **Drawer component** (bottom sheet) for cart UI — slides up from bottom
- **No filters** on product listing — just a grid with basic sorting (newest, price asc/desc)

## Data Layer

### Storefront API Client (`src/lib/server/shopify.ts`)

Thin typed wrapper around `fetch`:
- Single `storefront(query, variables)` function
- Uses `PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN` server-side
- Endpoint: `https://{domain}/api/2026-01/graphql.json`
- Throws on non-200 or GraphQL errors

### GraphQL Queries (`src/lib/server/shopify-queries.ts`)

- `getProducts(first, sortKey)` — all products with sort
- `getProductByHandle(handle)` — single product with variants, images, description
- `getCollections()` — all collections
- `getCollectionByHandle(handle)` — collection with its products
- `createCart()` — new empty cart
- `addToCart(cartId, variantId, quantity)` — add line item
- `updateCartLine(cartId, lineId, quantity)` — update quantity (0 removes)
- `getCart(cartId)` — full cart with lines, totals, checkout URL

### Cart Cookie

- Cookie name: `aziza-cart`
- Stores Shopify cart ID
- Read/written in server load functions and API routes
- Cleared if cart is expired or completed

## Pages

### Product Listing (`/shop`)

- Server-loaded, fetches all products with optional `?sort=` param
- Header: "Shop" + subline (editorial pattern)
- Sort: Select component — Newest, Price Low→High, Price High→Low
- Grid: `grid-cols-2 lg:grid-cols-3` — image (aspect-3/4), title, price
- Cards link to `/shop/[handle]`
- `reveal-up` animations with stagger

### Product Detail (`/shop/[handle]`)

- Server-loaded, fetches product by handle
- Two-column: image gallery (left) + product info (right)
- Image gallery: main image + clickable thumbnails
- Info: title, price, description (HTML), variant selector (buttons), quantity, "Add to Cart"
- "Add to Cart" is a form action → Shopify Cart API → sets cookie → returns cart

### Cart Drawer (`src/lib/components/shop/CartDrawer.svelte`)

- Uses Drawer from `$lib/components/ui/drawer` (slides up from bottom)
- Triggered by cart icon in Navbar
- Shows: line items (image, title, variant, quantity ±, price, remove), subtotal, checkout button
- Quantity/remove via POST to `/api/cart`
- Checkout redirects to Shopify `checkoutUrl`
- Empty state: "Your cart is empty" + link to /shop

### Cart Page (`/cart`)

- Full page version of cart contents
- Same data as drawer but more space for details
- Shipping info note, promo code placeholder
- Checkout button

## Integration Points

### Root Layout (`+layout.server.ts`)

- Reads `aziza-cart` cookie, fetches cart if exists
- Passes cart data (item count, lines) to all pages
- Clears cookie if cart is invalid

### Navbar

- Cart icon shows badge with item count (from layout data)
- Click opens CartDrawer

### API Route (`/api/cart/+server.ts`)

- POST for cart mutations (add, update, remove)
- Used by drawer and PDP
- Creates cart if none exists
- Returns updated cart JSON

## Types

All Shopify response types defined in `src/lib/types/shopify.ts`:
- `ShopifyProduct`, `ShopifyVariant`, `ShopifyImage`
- `ShopifyCollection`
- `ShopifyCart`, `ShopifyCartLine`
- `ShopifyMoney` (amount + currencyCode)
