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
		compareAtPrice &&
			parseFloat(compareAtPrice.amount) >
				parseFloat(product.priceRange.minVariantPrice.amount)
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
