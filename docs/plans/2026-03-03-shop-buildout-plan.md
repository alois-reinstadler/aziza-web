# Shop Buildout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Polish existing shop pages, add collection filtering + pagination, build search, extract shared product card, add related products to PDP.

**Architecture:** Extend `shopify-queries.ts` with new queries (collections, search, pagination). Extract a shared `ProductCard.svelte`. Enhance `/shop` with collection pills + load-more. Add `/shop/search` route. Add related products to PDP with sticky image gallery.

**Tech Stack:** SvelteKit, Svelte 5 (runes), Tailwind CSS v4, Shopify Storefront API (GraphQL)

---

### Task 1: Add New Shopify Queries

**Files:**
- Modify: `src/lib/server/shopify-queries.ts`
- Modify: `src/lib/types/shopify.ts`

**Step 1: Add PageInfo type and update ShopifyCollection**

In `src/lib/types/shopify.ts`, add:

```typescript
export interface ShopifyPageInfo {
	hasNextPage: boolean;
	endCursor: string | null;
}
```

Update `ShopifyCollection` to not require `products` (we fetch those separately):

```typescript
export interface ShopifyCollectionSummary {
	id: string;
	handle: string;
	title: string;
}
```

**Step 2: Add getCollections query**

In `src/lib/server/shopify-queries.ts`, add:

```typescript
export async function getCollections(first = 20): Promise<ShopifyCollectionSummary[]> {
	const data = await storefront<{ collections: { nodes: ShopifyCollectionSummary[] } }>(
		`query Collections($first: Int!) {
			collections(first: $first) {
				nodes {
					id
					handle
					title
				}
			}
		}`,
		{ first }
	);
	return data.collections.nodes;
}
```

**Step 3: Update getProducts to support pagination**

Change the existing `getProducts` signature and return type:

```typescript
interface ProductsResult {
	products: ShopifyProduct[];
	pageInfo: ShopifyPageInfo;
}

export async function getProducts(
	first = 24,
	sortKey: ProductSortKey = 'CREATED_AT',
	reverse = true,
	after?: string
): Promise<ProductsResult> {
	const data = await storefront<{
		products: { nodes: ShopifyProduct[]; pageInfo: ShopifyPageInfo };
	}>(
		`query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $after: String) {
			products(first: $first, sortKey: $sortKey, reverse: $reverse, after: $after) {
				nodes {
					${PRODUCT_FIELDS}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{ first, sortKey, reverse, after }
	);
	return { products: data.products.nodes, pageInfo: data.products.pageInfo };
}
```

**Step 4: Add getCollectionProducts query**

```typescript
export async function getCollectionProducts(
	handle: string,
	first = 24,
	sortKey: ProductSortKey = 'CREATED_AT',
	reverse = true,
	after?: string
): Promise<ProductsResult> {
	const data = await storefront<{
		collection: { products: { nodes: ShopifyProduct[]; pageInfo: ShopifyPageInfo } } | null;
	}>(
		`query CollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, $after: String) {
			collection(handle: $handle) {
				products(first: $first, sortKey: $sortKey, reverse: $reverse, after: $after) {
					nodes {
						${PRODUCT_FIELDS}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}`,
		{ handle, first, sortKey, reverse, after }
	);
	if (!data.collection) return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
	return { products: data.collection.products.nodes, pageInfo: data.collection.products.pageInfo };
}
```

Note: Shopify uses `ProductCollectionSortKeys` (not `ProductSortKeys`) when sorting within a collection. The enum values are the same ones we use: `CREATED_AT`, `PRICE`, `TITLE`, `BEST_SELLING`.

**Step 5: Add searchProducts query**

```typescript
export async function searchProducts(
	query: string,
	first = 24
): Promise<ShopifyProduct[]> {
	const data = await storefront<{
		products: { nodes: ShopifyProduct[] };
	}>(
		`query SearchProducts($query: String!, $first: Int!) {
			products(first: $first, query: $query) {
				nodes {
					${PRODUCT_FIELDS}
				}
			}
		}`,
		{ query, first }
	);
	return data.products.nodes;
}
```

**Step 6: Add getRelatedProducts query**

```typescript
export async function getRelatedProducts(
	productId: string,
	first = 4
): Promise<ShopifyProduct[]> {
	const data = await storefront<{
		productRecommendations: ShopifyProduct[];
	}>(
		`query RelatedProducts($productId: ID!) {
			productRecommendations(productId: $productId) {
				${PRODUCT_FIELDS}
			}
		}`,
		{ productId }
	);
	return (data.productRecommendations ?? []).slice(0, first);
}
```

**Step 7: Commit**

```
feat: add Shopify queries for collections, search, pagination, and related products
```

---

### Task 2: Extract ProductCard Component

**Files:**
- Create: `src/lib/components/shop/ProductCard.svelte`
- Modify: `src/routes/(shop)/shop/+page.svelte` (use new component)

**Step 1: Create ProductCard.svelte**

```svelte
<script lang="ts">
	import type { ShopifyProduct } from '$lib/types/shopify';
	import { inView } from '$lib/components/magazine/animations';

	type Props = {
		product: ShopifyProduct;
		index?: number;
		onQuickAdd?: (e: MouseEvent, product: ShopifyProduct) => void;
		adding?: boolean;
	};

	let { product, index = 0, onQuickAdd, adding = false }: Props = $props();

	function formatMoney(amount: string) {
		return `€${parseFloat(amount).toFixed(2)}`;
	}

	function hasMultipleVariants(p: ShopifyProduct) {
		const v = p.variants.nodes;
		return v.length > 1 && v[0].title !== 'Default Title';
	}

	const compareAtPrice = $derived(product.variants.nodes[0]?.compareAtPrice);
	const isOnSale = $derived(
		compareAtPrice && parseFloat(compareAtPrice.amount) > parseFloat(product.priceRange.minVariantPrice.amount)
	);
</script>

<a href="/shop/{product.handle}" class="group block">
	<div use:inView class="reveal-up" style="transition-delay: {index * 80}ms">
		<div class="relative mb-3 overflow-hidden">
			{#if product.featuredImage}
				<img
					src={product.featuredImage.url}
					alt={product.featuredImage.altText ?? product.title}
					class="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
				/>
			{:else}
				<div class="aspect-3/4 w-full bg-muted"></div>
			{/if}
			{#if product.availableForSale}
				<button
					onclick={(e) => {
						if (hasMultipleVariants(product)) return;
						onQuickAdd?.(e, product);
					}}
					class="quick-add absolute bottom-0 left-0 w-full bg-foreground/90 py-2.5 text-center text-xs tracking-wide text-background backdrop-blur-sm transition-all hover:bg-foreground disabled:opacity-50"
					disabled={adding}
				>
					{#if adding}
						Adding...
					{:else if hasMultipleVariants(product)}
						Select Options
					{:else}
						Add to Cart
					{/if}
				</button>
			{:else}
				<div
					class="absolute bottom-0 left-0 w-full bg-muted/90 py-2.5 text-center text-xs tracking-wide text-muted-foreground backdrop-blur-sm"
				>
					Sold Out
				</div>
			{/if}
		</div>
		<h3 class="font-serif text-sm">{product.title}</h3>
		<div class="mt-1 flex items-center gap-2">
			<p class="text-sm text-muted-foreground">
				{formatMoney(product.priceRange.minVariantPrice.amount)}
			</p>
			{#if isOnSale}
				<p class="text-sm text-muted-foreground/50 line-through">
					{formatMoney(compareAtPrice.amount)}
				</p>
			{/if}
		</div>
	</div>
</a>

<style>
	.reveal-up {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 700ms ease-out,
			transform 700ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}
	.quick-add {
		opacity: 1;
		transform: translateY(0);
	}
	@media (hover: hover) {
		.quick-add {
			opacity: 0;
			transform: translateY(100%);
			transition:
				opacity 300ms ease,
				transform 300ms ease;
		}
		:global(.group:hover) .quick-add {
			opacity: 1;
			transform: translateY(0);
		}
	}
</style>
```

**Step 2: Refactor shop listing to use ProductCard**

In `src/routes/(shop)/shop/+page.svelte`, replace the inline product card markup with:

```svelte
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { inView } from '$lib/components/magazine/animations';
	import * as Select from '$lib/components/ui/select';
	import { toast } from 'svelte-sonner';
	import CartToast from '$lib/components/shop/CartToast.svelte';
	import ProductCard from '$lib/components/shop/ProductCard.svelte';

	let { data } = $props();

	let addingId = $state<string | null>(null);

	function onSortChange(value: string | undefined) {
		if (value) {
			const params = new URLSearchParams(window.location.search);
			params.set('sort', value);
			goto(`/shop?${params.toString()}`);
		}
	}

	async function quickAdd(e: MouseEvent, product: (typeof data.products)[0]) {
		e.preventDefault();
		e.stopPropagation();
		const defaultVariant = product.variants.nodes[0];
		if (!defaultVariant?.availableForSale) return;
		addingId = product.id;
		try {
			await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'add',
					variantId: defaultVariant.id,
					quantity: 1
				})
			});
			await invalidateAll();
			toast(product.title, {
				unstyled: true,
				component: CartToast,
				componentProps: {
					title: product.title,
					image: product.featuredImage?.url ?? null
				}
			});
		} finally {
			addingId = null;
		}
	}
</script>
```

The grid section becomes:

```svelte
<div class="grid grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-8">
	{#each data.products as product, i (product.id)}
		<ProductCard
			{product}
			index={i}
			onQuickAdd={quickAdd}
			adding={addingId === product.id}
		/>
	{/each}
</div>
```

**Step 3: Commit**

```
refactor: extract shared ProductCard component
```

---

### Task 3: Shop Listing — Collection Filter + Pagination

**Files:**
- Modify: `src/routes/(shop)/shop/+page.server.ts`
- Modify: `src/routes/(shop)/shop/+page.svelte`

**Step 1: Update server load**

```typescript
import type { PageServerLoad } from './$types';
import {
	getProducts,
	getCollectionProducts,
	getCollections,
	type ProductSortKey
} from '$lib/server/shopify-queries';

export const load: PageServerLoad = async ({ url }) => {
	const sortParam = url.searchParams.get('sort') ?? 'newest';
	const collectionHandle = url.searchParams.get('collection') ?? null;
	const after = url.searchParams.get('after') ?? undefined;

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

	const [result, collections] = await Promise.all([
		collectionHandle
			? getCollectionProducts(collectionHandle, 24, sortKey, reverse, after)
			: getProducts(24, sortKey, reverse, after),
		getCollections()
	]);

	return {
		products: result.products,
		pageInfo: result.pageInfo,
		collections,
		sort: sortParam,
		collection: collectionHandle
	};
};
```

**Step 2: Update shop page template**

Add collection filter pills between header and grid. Add "Load More" button after grid.

Collection pills markup (add after the sort Select, inside the header flex container):

```svelte
<!-- Collection filter pills -->
<div use:inView class="reveal-up mb-8 flex flex-wrap gap-2">
	<a
		href="/shop{data.sort !== 'newest' ? `?sort=${data.sort}` : ''}"
		class="border px-4 py-2 text-xs tracking-wide transition-colors {!data.collection
			? 'border-foreground bg-foreground text-background'
			: 'border-border text-muted-foreground hover:border-foreground'}"
	>
		All
	</a>
	{#each data.collections as col (col.id)}
		<a
			href="/shop?collection={col.handle}{data.sort !== 'newest' ? `&sort=${data.sort}` : ''}"
			class="border px-4 py-2 text-xs tracking-wide transition-colors {data.collection === col.handle
				? 'border-foreground bg-foreground text-background'
				: 'border-border text-muted-foreground hover:border-foreground'}"
		>
			{col.title}
		</a>
	{/each}
</div>
```

Load More button (add after the product grid `</div>`):

```svelte
{#if data.pageInfo.hasNextPage}
	<div class="mt-12 text-center">
		<a
			href="/shop?{new URLSearchParams({
				...(data.collection ? { collection: data.collection } : {}),
				...(data.sort !== 'newest' ? { sort: data.sort } : {}),
				after: data.pageInfo.endCursor ?? ''
			}).toString()}"
		>
			<Button variant="outline" class="rounded-none px-10 text-sm tracking-wide">
				Load More
			</Button>
		</a>
	</div>
{/if}
```

Also update the sort handler to preserve collection param:

```typescript
function onSortChange(value: string | undefined) {
	if (value) {
		const params = new URLSearchParams();
		params.set('sort', value);
		if (data.collection) params.set('collection', data.collection);
		goto(`/shop?${params.toString()}`);
	}
}
```

**Step 3: Commit**

```
feat: add collection filtering and pagination to shop listing
```

---

### Task 4: Product Detail — Sticky Gallery + Compare Price + Related Products

**Files:**
- Modify: `src/routes/(shop)/shop/[handle]/+page.server.ts`
- Modify: `src/routes/(shop)/shop/[handle]/+page.svelte`

**Step 1: Update server load to fetch related products**

```typescript
import type { PageServerLoad } from './$types';
import { getProductByHandle, getRelatedProducts } from '$lib/server/shopify-queries';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductByHandle(params.handle);
	if (!product) throw error(404, 'Product not found');

	const relatedProducts = await getRelatedProducts(product.id, 4);

	return { product, relatedProducts };
};
```

**Step 2: Update product detail page**

Key changes to `src/routes/(shop)/shop/[handle]/+page.svelte`:

1. Make image column sticky on desktop: add `lg:sticky lg:top-32 lg:self-start` to the image gallery wrapper
2. Add compare-at-price display next to price
3. Add related products section at the bottom

Price section becomes:

```svelte
{@const compareAt = selectedVariant?.compareAtPrice}
{@const isOnSale = compareAt && parseFloat(compareAt.amount) > parseFloat(selectedVariant?.price.amount ?? '0')}
<div class="mb-6 flex items-center gap-3">
	<p class="text-xl">
		{formatMoney(selectedVariant?.price.amount ?? product.priceRange.minVariantPrice.amount)}
	</p>
	{#if isOnSale}
		<p class="text-lg text-muted-foreground/50 line-through">
			{formatMoney(compareAt.amount)}
		</p>
	{/if}
</div>
```

Related products section (add after the closing `</div>` of the main grid):

```svelte
{#if data.relatedProducts.length > 0}
	<section class="mt-24 border-t border-border/30 pt-16">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<h2 use:inView class="reveal-up mb-10 font-serif text-2xl font-light">You May Also Like</h2>
			<div class="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
				{#each data.relatedProducts as product, i (product.id)}
					<ProductCard {product} index={i} onQuickAdd={quickAdd} adding={addingId === product.id} />
				{/each}
			</div>
		</div>
	</section>
{/if}
```

This requires importing `ProductCard` and adding the `quickAdd` function (same as shop listing).

**Step 3: Commit**

```
feat: add sticky gallery, compare-at-price, and related products to PDP
```

---

### Task 5: Build Search Page

**Files:**
- Create: `src/routes/(shop)/shop/search/+page.server.ts`
- Create: `src/routes/(shop)/shop/search/+page.svelte`

**Step 1: Create server load**

```typescript
import type { PageServerLoad } from './$types';
import { searchProducts } from '$lib/server/shopify-queries';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';

	if (!query) {
		return { products: [], query };
	}

	const products = await searchProducts(query, 24);
	return { products, query };
};
```

**Step 2: Create search page**

```svelte
<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { inView } from '$lib/components/magazine/animations';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import CartToast from '$lib/components/shop/CartToast.svelte';
	import ProductCard from '$lib/components/shop/ProductCard.svelte';
	import { Search } from '@lucide/svelte';

	let { data } = $props();

	let searchInput = $state(data.query);
	let debounceTimer: ReturnType<typeof setTimeout>;
	let addingId = $state<string | null>(null);

	function onInput() {
		clearTimeout(debounceTimer);
		debounceTimer = setTimeout(() => {
			const q = searchInput.trim();
			if (q) {
				goto(`/shop/search?q=${encodeURIComponent(q)}`, { keepFocus: true });
			} else {
				goto('/shop/search', { keepFocus: true });
			}
		}, 300);
	}

	async function quickAdd(e: MouseEvent, product: (typeof data.products)[0]) {
		e.preventDefault();
		e.stopPropagation();
		const defaultVariant = product.variants.nodes[0];
		if (!defaultVariant?.availableForSale) return;
		addingId = product.id;
		try {
			await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'add',
					variantId: defaultVariant.id,
					quantity: 1
				})
			});
			await invalidateAll();
			toast(product.title, {
				unstyled: true,
				component: CartToast,
				componentProps: {
					title: product.title,
					image: product.featuredImage?.url ?? null
				}
			});
		} finally {
			addingId = null;
		}
	}
</script>

<svelte:head>
	<title>{data.query ? `"${data.query}" — Search` : 'Search'} — Aziza</title>
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Search header -->
		<div class="mb-12">
			<p
				use:inView
				class="reveal-up mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
			>
				Search
			</p>
			<div use:inView class="reveal-up relative">
				<Search class="absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-muted-foreground/40" />
				<input
					type="text"
					bind:value={searchInput}
					oninput={onInput}
					placeholder="What are you looking for?"
					class="w-full border-b border-border bg-transparent py-3 pl-8 font-serif text-2xl font-light outline-none placeholder:text-muted-foreground/30 focus:border-foreground lg:text-3xl"
				/>
			</div>
		</div>

		<!-- Results -->
		{#if data.query && data.products.length === 0}
			<div use:inView class="reveal-up py-20 text-center">
				<p class="mb-2 font-serif text-xl font-light">No results for "{data.query}"</p>
				<p class="mb-6 text-sm text-muted-foreground">Try a different search term</p>
				<a href="/shop">
					<Button variant="outline" class="rounded-none text-sm tracking-wide">
						Browse All Products
					</Button>
				</a>
			</div>
		{:else if data.products.length > 0}
			<div class="grid grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-8">
				{#each data.products as product, i (product.id)}
					<ProductCard
						{product}
						index={i}
						onQuickAdd={quickAdd}
						adding={addingId === product.id}
					/>
				{/each}
			</div>
		{:else}
			<div use:inView class="reveal-up py-20 text-center">
				<p class="font-serif text-xl font-light text-muted-foreground">
					Search our collection
				</p>
			</div>
		{/if}
	</div>
</section>

<style>
	.reveal-up {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 700ms ease-out,
			transform 700ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}
</style>
```

**Step 3: Commit**

```
feat: add product search page
```

---

### Task 6: Final Polish + Build Check

**Step 1: Add search link to navbar**

Add a search icon or link in the nav top-right area (next to the cart icon) that links to `/shop/search`. Show it on shop routes alongside the cart icon.

**Step 2: Run build check**

```bash
bun run build
```

Fix any type errors or import issues.

**Step 3: Commit**

```
feat: add search link to navbar, fix build
```
