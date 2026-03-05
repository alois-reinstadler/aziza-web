<script lang="ts">
	import type { ShopifyProduct } from '$lib/types/shopify';
	import { inView } from '$lib/components/magazine/animations';
	import { Button } from '$lib/components/ui/button';

	type GridSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	type Props = {
		product: ShopifyProduct;
		index?: number;
		gridSize?: GridSize;
		onQuickAdd?: (e: MouseEvent, product: ShopifyProduct) => void;
		adding?: boolean;
	};

	let { product, index = 0, gridSize = 'md', onQuickAdd, adding = false }: Props = $props();

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

	const optionGroups = $derived.by(() => {
		const groups: Record<string, string[]> = {};
		for (const v of product.variants.nodes) {
			for (const opt of v.selectedOptions) {
				if (opt.name === 'Title' && opt.value === 'Default Title') continue;
				if (!groups[opt.name]) groups[opt.name] = [];
				if (!groups[opt.name].includes(opt.value)) groups[opt.name].push(opt.value);
			}
		}
		return groups;
	});

	const allImages = $derived(product.images.nodes);
	const imageCount = $derived(allImages.length);

	const showName = $derived(gridSize !== 'xs');
	const showPrice = $derived(gridSize === 'md' || gridSize === 'lg' || gridSize === 'xl');
	const showDescription = $derived(gridSize === 'lg' || gridSize === 'xl');
	const showQuickAdd = $derived(gridSize === 'md' || gridSize === 'lg' || gridSize === 'xl');
	const truncateName = $derived(gridSize === 'sm');
	const isXL = $derived(gridSize === 'xl');

	const shortDescription = $derived(
		product.description.length > 120
			? product.description.slice(0, 120).trimEnd() + '…'
			: product.description
	);
</script>

{#if isXL}
	<!-- XL: Mini-PDP row layout -->
	<a
		href="/shop/{product.handle}"
		class="group block"
		data-flip-id={product.id}
	>
		<div use:inView class="reveal-up flex flex-col gap-5 sm:flex-row sm:gap-6">
		<div class="sm:w-1/2">
			<!-- Bento image grid -->
			{#if imageCount === 0}
				<div class="aspect-3/4 w-full bg-muted"></div>
			{:else if imageCount === 1}
				<div class="overflow-hidden">
					<img
						src={allImages[0].url}
						alt={allImages[0].altText ?? product.title}
						class="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				</div>
			{:else if imageCount === 2}
				<div class="grid grid-cols-2 gap-2">
					{#each allImages.slice(0, 2) as img (img.url)}
						<div class="overflow-hidden">
							<img
								src={img.url}
								alt={img.altText ?? product.title}
								class="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>
					{/each}
				</div>
			{:else if imageCount === 3}
				<div class="grid grid-cols-2 gap-2">
					<div class="row-span-2 overflow-hidden">
						<img
							src={allImages[0].url}
							alt={allImages[0].altText ?? product.title}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
					</div>
					{#each allImages.slice(1, 3) as img (img.url)}
						<div class="overflow-hidden">
							<img
								src={img.url}
								alt={img.altText ?? product.title}
								class="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>
					{/each}
				</div>
			{:else}
				<!-- 4+ images: 2x2 bento with hero -->
				<div class="grid grid-cols-2 gap-2">
					<div class="col-span-2 overflow-hidden">
						<img
							src={allImages[0].url}
							alt={allImages[0].altText ?? product.title}
							class="aspect-4/3 w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
					</div>
					{#each allImages.slice(1, 4) as img (img.url)}
						<div class="overflow-hidden">
							<img
								src={img.url}
								alt={img.altText ?? product.title}
								class="aspect-square w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>
					{/each}
				</div>
			{/if}
		</div>

		<!-- Product details -->
		<div class="flex flex-col justify-center sm:w-1/2">
			<h3 class="font-serif text-xl font-light lg:text-2xl">{product.title}</h3>

			<div class="mt-2 flex items-center gap-2">
				<p class="text-base">
					{formatMoney(product.priceRange.minVariantPrice.amount)}
				</p>
				{#if isOnSale && compareAtPrice}
					<p class="text-sm text-muted-foreground/50 line-through">
						{formatMoney(compareAtPrice.amount)}
					</p>
				{/if}
			</div>

			{#if shortDescription}
				<p class="mt-3 text-sm leading-relaxed text-muted-foreground">
					{shortDescription}
				</p>
			{/if}

			{#if Object.keys(optionGroups).length > 0}
				<div class="mt-4 flex flex-col gap-2">
					{#each Object.entries(optionGroups) as [name, values] (name)}
						<div>
							<span class="mb-1.5 block text-xs tracking-wide text-muted-foreground/60 uppercase">{name}</span>
							<div class="flex flex-wrap gap-1.5">
								{#each values as value (value)}
									<span class="border border-border px-2.5 py-1 text-xs tracking-wide text-muted-foreground">
										{value}
									</span>
								{/each}
							</div>
						</div>
					{/each}
				</div>
			{/if}

			<div class="mt-5">
				{#if product.availableForSale}
					<Button
						class="rounded-none px-8 py-5 text-xs tracking-wide"
						onclick={(e: MouseEvent) => {
							if (hasMultipleVariants(product)) return;
							onQuickAdd?.(e, product);
						}}
						disabled={adding}
					>
						{#if adding}
							Adding...
						{:else if hasMultipleVariants(product)}
							View Options
						{:else}
							Add to Cart
						{/if}
					</Button>
				{:else}
					<Button variant="outline" class="rounded-none px-8 py-5 text-xs tracking-wide" disabled>
						Sold Out
					</Button>
				{/if}
			</div>
		</div>
		</div>
	</a>
{:else}
	<!-- XS–LG: Standard vertical card -->
	<a href="/shop/{product.handle}" class="group block" data-flip-id={product.id}>
		<div use:inView class="reveal-up" style="transition-delay: {index * 80}ms">
			<div class="relative {showName ? 'mb-3' : ''} overflow-hidden">
				{#if product.featuredImage}
					<img
						src={product.featuredImage.url}
						alt={product.featuredImage.altText ?? product.title}
						class="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				{:else}
					<div class="aspect-3/4 w-full bg-muted"></div>
				{/if}
				{#if showQuickAdd}
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
				{/if}
			</div>

			{#if showName}
				<h3 class="font-serif text-sm {truncateName ? 'truncate' : ''}">{product.title}</h3>

				{#if showPrice}
					<div class="mt-1 flex items-center gap-2">
						<p class="text-sm text-muted-foreground">
							{formatMoney(product.priceRange.minVariantPrice.amount)}
						</p>
						{#if isOnSale && compareAtPrice}
							<p class="text-sm text-muted-foreground/50 line-through">
								{formatMoney(compareAtPrice.amount)}
							</p>
						{/if}
					</div>
				{/if}

				{#if showDescription && shortDescription}
					<p class="mt-2 text-xs leading-relaxed text-muted-foreground/70 line-clamp-2">
						{shortDescription}
					</p>
				{/if}
			{/if}
		</div>
	</a>
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
