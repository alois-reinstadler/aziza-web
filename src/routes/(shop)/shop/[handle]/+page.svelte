<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { inView } from '$lib/components/magazine/animations';
	import { invalidateAll } from '$app/navigation';
	import { Minus, Plus } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import CartToast from '$lib/components/shop/CartToast.svelte';
	import ProductCard from '$lib/components/shop/ProductCard.svelte';

	let { data } = $props();

	const product = $derived(data.product);
	const images = $derived(product.images.nodes);
	const variants = $derived(product.variants.nodes);

	let selectedImageIndex = $state(0);
	let selectedVariantIndex = $state(0);
	let quantity = $state(1);
	let adding = $state(false);
	let addingId = $state<string | null>(null);

	const selectedVariant = $derived(variants[selectedVariantIndex]);
	const hasMultipleVariants = $derived(
		variants.length > 1 && variants[0].title !== 'Default Title'
	);
	const compareAt = $derived(selectedVariant?.compareAtPrice);
	const isOnSale = $derived(
		compareAt &&
			parseFloat(compareAt.amount) > parseFloat(selectedVariant?.price.amount ?? '0')
	);

	function formatMoney(amount: string) {
		return `€${parseFloat(amount).toFixed(2)}`;
	}

	async function addToCart() {
		if (!selectedVariant) return;
		adding = true;
		try {
			await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: 'add',
					variantId: selectedVariant.id,
					quantity
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
			adding = false;
		}
	}

	async function quickAdd(e: MouseEvent, p: (typeof data.relatedProducts)[0]) {
		e.preventDefault();
		e.stopPropagation();
		const defaultVariant = p.variants.nodes[0];
		if (!defaultVariant?.availableForSale) return;
		addingId = p.id;
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
			toast(p.title, {
				unstyled: true,
				component: CartToast,
				componentProps: {
					title: p.title,
					image: p.featuredImage?.url ?? null
				}
			});
		} finally {
			addingId = null;
		}
	}
</script>

<svelte:head>
	<title>{product.title} — Aziza</title>
	<meta name="description" content={product.description} />
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Breadcrumb -->
		<nav class="mb-8 text-sm text-muted-foreground">
			<a href="/shop" class="hover:text-foreground">Shop</a>
			<span class="mx-2">›</span>
			<span>{product.title}</span>
		</nav>

		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-16">
			<!-- Image Gallery (sticky on desktop) -->
			<div use:inView class="reveal-up lg:sticky lg:top-32 lg:self-start">
				<!-- Main image -->
				<div class="mb-4 overflow-hidden">
					{#if images[selectedImageIndex]}
						<img
							src={images[selectedImageIndex].url}
							alt={images[selectedImageIndex].altText ?? product.title}
							class="aspect-3/4 w-full object-cover"
						/>
					{:else}
						<div class="aspect-3/4 w-full bg-muted"></div>
					{/if}
				</div>

				<!-- Thumbnails -->
				{#if images.length > 1}
					<div class="flex gap-2 overflow-x-auto">
						{#each images as image, i (image.url)}
							<button
								onclick={() => (selectedImageIndex = i)}
								class="shrink-0 overflow-hidden border-2 transition-colors {i ===
								selectedImageIndex
									? 'border-foreground'
									: 'border-transparent'}"
							>
								<img
									src={image.url}
									alt={image.altText ?? `${product.title} ${i + 1}`}
									class="h-20 w-16 object-cover"
								/>
							</button>
						{/each}
					</div>
				{/if}
			</div>

			<!-- Product Info -->
			<div use:inView class="reveal-up">
				<h1 class="mb-3 font-serif text-3xl font-light lg:text-4xl">{product.title}</h1>

				<!-- Price with compare-at -->
				<div class="mb-6 flex items-center gap-3">
					<p class="text-xl">
						{formatMoney(
							selectedVariant?.price.amount ??
								product.priceRange.minVariantPrice.amount
						)}
					</p>
					{#if isOnSale}
						<p class="text-lg text-muted-foreground/50 line-through">
							{formatMoney(compareAt.amount)}
						</p>
					{/if}
				</div>

				<!-- Description -->
				<div class="mb-8 leading-relaxed text-muted-foreground">
					{@html product.descriptionHtml}
				</div>

				<!-- Variant selector -->
				{#if hasMultipleVariants}
					<div class="mb-6">
						<p class="mb-3 text-sm font-medium">
							{variants[0].selectedOptions[0]?.name ?? 'Option'}
						</p>
						<div class="flex flex-wrap gap-2">
							{#each variants as variant, i (variant.id)}
								<button
									onclick={() => {
										selectedVariantIndex = i;
										if (variant.image) {
											const imgIdx = images.findIndex(
												(img) => img.url === variant.image?.url
											);
											if (imgIdx >= 0) selectedImageIndex = imgIdx;
										}
									}}
									class="border px-4 py-2 text-sm transition-colors {i ===
									selectedVariantIndex
										? 'border-foreground bg-foreground text-background'
										: 'border-border hover:border-foreground'}"
									disabled={!variant.availableForSale}
								>
									{variant.title}
								</button>
							{/each}
						</div>
					</div>
				{/if}

				<!-- Quantity -->
				<div class="mb-8">
					<p class="mb-3 text-sm font-medium">Quantity</p>
					<div class="flex items-center gap-3">
						<button
							onclick={() => (quantity = Math.max(1, quantity - 1))}
							class="flex h-10 w-10 items-center justify-center border border-border hover:bg-muted"
							aria-label="Decrease quantity"
						>
							<Minus class="h-4 w-4" />
						</button>
						<span class="w-8 text-center">{quantity}</span>
						<button
							onclick={() => (quantity = quantity + 1)}
							class="flex h-10 w-10 items-center justify-center border border-border hover:bg-muted"
							aria-label="Increase quantity"
						>
							<Plus class="h-4 w-4" />
						</button>
					</div>
				</div>

				<!-- Add to Cart -->
				<Button
					class="w-full rounded-none py-6 text-sm tracking-wide lg:w-auto lg:px-16"
					onclick={addToCart}
					disabled={adding || !selectedVariant?.availableForSale}
				>
					{#if adding}
						Adding...
					{:else if !selectedVariant?.availableForSale}
						Sold Out
					{:else}
						Add to Cart
					{/if}
				</Button>
			</div>
		</div>
	</div>
</section>

<!-- Related Products -->
{#if data.relatedProducts.length > 0}
	<section data-navbar-dark class="border-t border-border/30 pt-16 pb-20">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<h2 use:inView class="reveal-up mb-10 font-serif text-2xl font-light">
				You May Also Like
			</h2>
			<div class="grid grid-cols-2 gap-6 lg:grid-cols-4 lg:gap-8">
				{#each data.relatedProducts as relProduct, i (relProduct.id)}
					<ProductCard
						product={relProduct}
						index={i}
						onQuickAdd={quickAdd}
						adding={addingId === relProduct.id}
					/>
				{/each}
			</div>
		</div>
	</section>
{/if}

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
