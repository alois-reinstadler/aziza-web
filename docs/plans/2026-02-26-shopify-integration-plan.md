# Shopify Integration Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate Shopify Storefront API for product browsing, product detail pages, and cart functionality with a drawer UI.

**Architecture:** Raw `fetch` wrapper for Shopify Storefront GraphQL API. All product data loaded server-side via SvelteKit `+page.server.ts`. Cart managed by Shopify Cart API with cart ID persisted in a cookie. Cart UI uses the Drawer component (bottom sheet).

**Tech Stack:** SvelteKit, Svelte 5, Tailwind CSS v4, Shopify Storefront API (2026-01), vaul-svelte Drawer component.

---

### Task 1: Shopify Types

**Files:**

- Create: `src/lib/types/shopify.ts`

**Step 1: Create Shopify type definitions**

```typescript
// Money type used across all Shopify responses
export interface ShopifyMoney {
	amount: string;
	currencyCode: string;
}

export interface ShopifyImage {
	url: string;
	altText: string | null;
	width: number;
	height: number;
}

export interface ShopifyProductVariant {
	id: string;
	title: string;
	availableForSale: boolean;
	price: ShopifyMoney;
	compareAtPrice: ShopifyMoney | null;
	selectedOptions: { name: string; value: string }[];
	image: ShopifyImage | null;
}

export interface ShopifyProduct {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	featuredImage: ShopifyImage | null;
	images: { nodes: ShopifyImage[] };
	variants: { nodes: ShopifyProductVariant[] };
	priceRange: {
		minVariantPrice: ShopifyMoney;
		maxVariantPrice: ShopifyMoney;
	};
	tags: string[];
	availableForSale: boolean;
	createdAt: string;
}

export interface ShopifyCollection {
	id: string;
	handle: string;
	title: string;
	description: string;
	image: ShopifyImage | null;
	products: { nodes: ShopifyProduct[] };
}

export interface ShopifyCartLine {
	id: string;
	quantity: number;
	merchandise: {
		id: string;
		title: string;
		product: {
			handle: string;
			title: string;
			featuredImage: ShopifyImage | null;
		};
		price: ShopifyMoney;
		selectedOptions: { name: string; value: string }[];
	};
	cost: {
		totalAmount: ShopifyMoney;
	};
}

export interface ShopifyCart {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	cost: {
		subtotalAmount: ShopifyMoney;
		totalAmount: ShopifyMoney;
		totalTaxAmount: ShopifyMoney | null;
	};
	lines: { nodes: ShopifyCartLine[] };
}
```

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/types/shopify.ts
git commit -m "feat: add Shopify type definitions"
```

---

### Task 2: Storefront API Client

**Files:**

- Modify: `src/lib/server/shopify.ts` (replace commented-out content)

**Step 1: Implement the storefront fetch wrapper**

Replace the entire file content with:

```typescript
import { PUBLIC_SHOPIFY_STORE_DOMAIN, PUBLIC_SHOPIFY_API_VERSION } from '$env/static/public';
import { PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN } from '$env/static/private';

const API_URL = `https://${PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${PUBLIC_SHOPIFY_API_VERSION}/graphql.json`;

interface StorefrontResponse<T> {
	data: T;
	errors?: { message: string }[];
}

export async function storefront<T>(
	query: string,
	variables: Record<string, unknown> = {}
): Promise<T> {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
	}

	const json: StorefrontResponse<T> = await response.json();

	if (json.errors?.length) {
		throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join(', ')}`);
	}

	return json.data;
}
```

Also delete `src/lib/shopify.ts` (the client-side placeholder — we're doing server-only).

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/server/shopify.ts
git rm src/lib/shopify.ts
git commit -m "feat: implement Storefront API fetch wrapper"
```

---

### Task 3: GraphQL Queries — Products

**Files:**

- Create: `src/lib/server/shopify-queries.ts`

**Step 1: Create product query functions**

```typescript
import { storefront } from './shopify';
import type { ShopifyProduct } from '$lib/types/shopify';

// Shared fragment for product fields
const PRODUCT_FIELDS = `
	id
	handle
	title
	description
	descriptionHtml
	availableForSale
	createdAt
	tags
	featuredImage {
		url
		altText
		width
		height
	}
	images(first: 10) {
		nodes {
			url
			altText
			width
			height
		}
	}
	priceRange {
		minVariantPrice {
			amount
			currencyCode
		}
		maxVariantPrice {
			amount
			currencyCode
		}
	}
	variants(first: 50) {
		nodes {
			id
			title
			availableForSale
			price {
				amount
				currencyCode
			}
			compareAtPrice {
				amount
				currencyCode
			}
			selectedOptions {
				name
				value
			}
			image {
				url
				altText
				width
				height
			}
		}
	}
`;

export type ProductSortKey = 'CREATED_AT' | 'PRICE' | 'TITLE' | 'BEST_SELLING';

export async function getProducts(
	first = 24,
	sortKey: ProductSortKey = 'CREATED_AT',
	reverse = true
): Promise<ShopifyProduct[]> {
	const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
		`query Products($first: Int!, $sortKey: ProductSortKey!, $reverse: Boolean!) {
			products(first: $first, sortKey: $sortKey, reverse: $reverse) {
				nodes {
					${PRODUCT_FIELDS}
				}
			}
		}`,
		{ first, sortKey, reverse }
	);
	return data.products.nodes;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
	const data = await storefront<{ product: ShopifyProduct | null }>(
		`query Product($handle: String!) {
			product(handle: $handle) {
				${PRODUCT_FIELDS}
			}
		}`,
		{ handle }
	);
	return data.product;
}
```

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/server/shopify-queries.ts
git commit -m "feat: add product GraphQL queries"
```

---

### Task 4: GraphQL Queries — Cart

**Files:**

- Modify: `src/lib/server/shopify-queries.ts` (append cart queries)

**Step 1: Add cart query functions**

Append to the existing file:

```typescript
import type { ShopifyCart } from '$lib/types/shopify';

const CART_FIELDS = `
	id
	checkoutUrl
	totalQuantity
	cost {
		subtotalAmount {
			amount
			currencyCode
		}
		totalAmount {
			amount
			currencyCode
		}
		totalTaxAmount {
			amount
			currencyCode
		}
	}
	lines(first: 100) {
		nodes {
			id
			quantity
			merchandise {
				... on ProductVariant {
					id
					title
					product {
						handle
						title
						featuredImage {
							url
							altText
							width
							height
						}
					}
					price {
						amount
						currencyCode
					}
					selectedOptions {
						name
						value
					}
				}
			}
			cost {
				totalAmount {
					amount
					currencyCode
				}
			}
		}
	}
`;

export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
	const data = await storefront<{ cartCreate: { cart: ShopifyCart } }>(
		`mutation CartCreate($input: CartInput!) {
			cartCreate(input: $input) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			input: {
				lines: [{ merchandiseId: variantId, quantity }]
			}
		}
	);
	return data.cartCreate.cart;
}

export async function addToCart(
	cartId: string,
	variantId: string,
	quantity = 1
): Promise<ShopifyCart> {
	const data = await storefront<{ cartLinesAdd: { cart: ShopifyCart } }>(
		`mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
			cartLinesAdd(cartId: $cartId, lines: $lines) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			cartId,
			lines: [{ merchandiseId: variantId, quantity }]
		}
	);
	return data.cartLinesAdd.cart;
}

export async function updateCartLine(
	cartId: string,
	lineId: string,
	quantity: number
): Promise<ShopifyCart> {
	const data = await storefront<{ cartLinesUpdate: { cart: ShopifyCart } }>(
		`mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
			cartLinesUpdate(cartId: $cartId, lines: $lines) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			cartId,
			lines: [{ id: lineId, quantity }]
		}
	);
	return data.cartLinesUpdate.cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
	const data = await storefront<{ cartLinesRemove: { cart: ShopifyCart } }>(
		`mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
			cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			cartId,
			lineIds: [lineId]
		}
	);
	return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
	const data = await storefront<{ cart: ShopifyCart | null }>(
		`query Cart($cartId: ID!) {
			cart(id: $cartId) {
				${CART_FIELDS}
			}
		}`,
		{ cartId }
	);
	return data.cart;
}
```

Also add the `ShopifyCart` import to the existing imports at the top of the file.

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/server/shopify-queries.ts
git commit -m "feat: add cart GraphQL queries and mutations"
```

---

### Task 5: Root Layout Server — Cart Loading

**Files:**

- Create: `src/routes/+layout.server.ts`

**Step 1: Create root layout server load**

```typescript
import type { LayoutServerLoad } from './$types';
import { getCart } from '$lib/server/shopify-queries';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const cartId = cookies.get('aziza-cart');

	if (!cartId) {
		return { cart: null };
	}

	try {
		const cart = await getCart(cartId);
		if (!cart) {
			// Cart expired or completed — clear cookie
			cookies.delete('aziza-cart', { path: '/' });
			return { cart: null };
		}
		return { cart };
	} catch {
		// API error — don't break the page, just return no cart
		return { cart: null };
	}
};
```

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/+layout.server.ts
git commit -m "feat: load cart from cookie in root layout"
```

---

### Task 6: Cart API Route

**Files:**

- Create: `src/routes/api/cart/+server.ts`

**Step 1: Create cart API endpoint**

```typescript
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import {
	createCart,
	addToCart,
	updateCartLine,
	removeCartLine,
	getCart
} from '$lib/server/shopify-queries';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const { action, variantId, quantity, lineId } = body;
	let cartId = cookies.get('aziza-cart');

	try {
		let cart;

		switch (action) {
			case 'add': {
				if (!variantId) return json({ error: 'variantId required' }, { status: 400 });
				if (cartId) {
					cart = await addToCart(cartId, variantId, quantity ?? 1);
				} else {
					cart = await createCart(variantId, quantity ?? 1);
				}
				break;
			}
			case 'update': {
				if (!cartId || !lineId)
					return json({ error: 'cartId and lineId required' }, { status: 400 });
				cart = await updateCartLine(cartId, lineId, quantity ?? 1);
				break;
			}
			case 'remove': {
				if (!cartId || !lineId)
					return json({ error: 'cartId and lineId required' }, { status: 400 });
				cart = await removeCartLine(cartId, lineId);
				break;
			}
			default:
				return json({ error: 'Invalid action' }, { status: 400 });
		}

		// Persist cart ID in cookie
		cookies.set('aziza-cart', cart.id, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 14 // 14 days
		});

		return json({ cart });
	} catch (error) {
		console.error('Cart API error:', error);
		return json({ error: 'Cart operation failed' }, { status: 500 });
	}
};
```

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/api/cart/+server.ts
git commit -m "feat: add cart API route for add/update/remove"
```

---

### Task 7: Cart Drawer Component

**Files:**

- Create: `src/lib/components/shop/CartDrawer.svelte`

**Step 1: Create the cart drawer**

Uses the Drawer component from `$lib/components/ui/drawer`. Receives cart data as a prop. Shows line items with quantity controls. Checkout button redirects to Shopify checkout URL.

The component should:

- Import `Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter, DrawerClose` from `$lib/components/ui/drawer`
- Import `Button` from `$lib/components/ui/button`
- Import `Minus, Plus, X, ShoppingBag` from `@lucide/svelte`
- Accept props: `open: boolean` (bindable), `cart: ShopifyCart | null`
- Show empty state when no items
- For each line item: small image, product title, variant title, quantity +/- buttons, line price, remove button
- Quantity changes call `fetch('/api/cart', { method: 'POST', body: ... })` then `invalidateAll()` from `$app/navigation`
- Footer: subtotal + "Checkout" button linking to `cart.checkoutUrl`
- Format money with a helper: `€{parseFloat(amount).toFixed(2)}`

Styling: match the brand aesthetic — serif headings, muted text, clean layout, `rounded-none` buttons.

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/components/shop/CartDrawer.svelte
git commit -m "feat: add cart drawer component"
```

---

### Task 8: Navbar Cart Integration

**Files:**

- Modify: `src/lib/components/marketing/Navbar.svelte`
- Modify: `src/routes/+layout.svelte`

**Step 1: Update Navbar to accept cart data and control drawer**

Changes to Navbar:

- Add props: `cartCount: number`, `onCartClick: () => void`
- Replace the cart `Button` with one that calls `onCartClick`
- Show a small badge on the cart icon when `cartCount > 0` — a small `absolute` positioned circle with the count

Changes to `+layout.svelte`:

- Import `CartDrawer`
- Get cart data from `$page.data.cart` (from layout server load)
- Add `cartOpen` state
- Pass `cartCount` and `onCartClick` to Navbar
- Render `CartDrawer` with `bind:open={cartOpen}` and `cart={$page.data.cart}`

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/lib/components/marketing/Navbar.svelte src/routes/+layout.svelte
git commit -m "feat: wire cart drawer into navbar and layout"
```

---

### Task 9: Shop Product Listing Page

**Files:**

- Create: `src/routes/(shop)/shop/+page.server.ts`
- Create: `src/routes/(shop)/shop/+page.svelte`

**Step 1: Create server load function**

```typescript
import type { PageServerLoad } from './$types';
import { getProducts, type ProductSortKey } from '$lib/server/shopify-queries';

export const load: PageServerLoad = async ({ url }) => {
	const sortParam = url.searchParams.get('sort') ?? 'newest';

	let sortKey: ProductSortKey = 'CREATED_AT';
	let reverse = true;

	switch (sortParam) {
		case 'price-asc':
			sortKey = 'PRICE';
			reverse = false;
			break;
		case 'price-desc':
			sortKey = 'PRICE';
			reverse = true;
			break;
		case 'newest':
		default:
			sortKey = 'CREATED_AT';
			reverse = true;
			break;
	}

	const products = await getProducts(24, sortKey, reverse);
	return { products, sort: sortParam };
};
```

**Step 2: Create the shop page**

Structure:

- `<svelte:head>` with title "Shop — Aziza"
- `data-navbar-dark` section, `pt-32 pb-20`
- Header: "Shop" label + heading + subline
- Sort: `Select` component from `$lib/components/ui/select` — "Newest", "Price: Low to High", "Price: High to Low". On change, navigate to `/shop?sort={value}` using `goto` from `$app/navigation`.
- Grid: `grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8`
- Each product card: link to `/shop/{handle}`, image (`aspect-3/4`, hover scale), title (serif), price (`€{amount}`)
- `reveal-up` with stagger via `inView`
- Empty state if no products: "No products found"

**Step 3: Verify**

Run: `bun check`
Expected: 0 errors

**Step 4: Commit**

```bash
git add src/routes/\(shop\)/shop/
git commit -m "feat: add shop product listing page with sort"
```

---

### Task 10: Product Detail Page

**Files:**

- Create: `src/routes/(shop)/shop/[handle]/+page.server.ts`
- Create: `src/routes/(shop)/shop/[handle]/+page.svelte`

**Step 1: Create server load function**

```typescript
import type { PageServerLoad } from './$types';
import { getProductByHandle } from '$lib/server/shopify-queries';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductByHandle(params.handle);
	if (!product) throw error(404, 'Product not found');
	return { product };
};
```

**Step 2: Create the product detail page**

Structure:

- `<svelte:head>` with product title
- `data-navbar-dark` section, `pt-32 pb-20`
- Breadcrumb: Shop > Product Title (using simple text links)
- Two-column grid (`lg:grid-cols-2 gap-12 lg:gap-16`):
  - **Left — Image gallery:**
    - Main image (large, `aspect-3/4`)
    - Thumbnail row below (if multiple images) — clicking swaps main image
    - Use `$state` for `selectedImageIndex`
  - **Right — Product info:**
    - Title: serif, `text-3xl lg:text-4xl`
    - Price: `text-xl`
    - Description: rendered as HTML from `descriptionHtml` (use `{@html}`)
    - Variant selector: if product has variants with options (size, color), show option buttons. Use `$state` for `selectedVariant`.
    - Quantity: simple +/- with number display
    - "Add to Cart" button: calls `fetch('/api/cart', { method: 'POST', body: { action: 'add', variantId, quantity } })`, then opens cart drawer (use `invalidateAll` + dispatch a custom event or use a store)
- `reveal-up` animations

**Step 3: Verify**

Run: `bun check`
Expected: 0 errors

**Step 4: Commit**

```bash
git add src/routes/\(shop\)/shop/\[handle\]/
git commit -m "feat: add product detail page with variant selection and add-to-cart"
```

---

### Task 11: Cart Full Page

**Files:**

- Create: `src/routes/(shop)/cart/+page.svelte`

**Step 1: Create cart page**

Structure:

- `<svelte:head>` with title "Cart — Aziza"
- `data-navbar-dark` section, `pt-32 pb-20`
- Header: "Your Cart"
- If cart is empty: empty state with "Your cart is empty" + link to `/shop`
- If cart has items: table-like layout
  - Each line: image (small), product title + variant, quantity +/-, line total, remove button
  - Quantity/remove actions same as drawer (POST to `/api/cart` + `invalidateAll`)
- Below items: subtotal, shipping note ("Shipping calculated at checkout"), checkout button
- Uses `$page.data.cart` from layout load

**Step 2: Verify**

Run: `bun check`
Expected: 0 errors

**Step 3: Commit**

```bash
git add src/routes/\(shop\)/cart/+page.svelte
git commit -m "feat: add full cart page"
```

---

### Task 12: Final Check, Format & Smoke Test

**Step 1: Run type check**

Run: `bun check`
Expected: 0 errors

**Step 2: Format**

Run: `bun format`

**Step 3: Start dev server and smoke test**

Run: `bun dev`

Test manually:

- `/shop` loads products from Shopify
- `/shop/[handle]` shows product detail
- "Add to Cart" works and opens drawer
- Cart drawer shows items, quantity +/- works
- `/cart` page shows items
- Checkout button goes to Shopify checkout

**Step 4: Commit formatting changes**

```bash
git add -A
git commit -m "chore: format shopify integration files"
```
