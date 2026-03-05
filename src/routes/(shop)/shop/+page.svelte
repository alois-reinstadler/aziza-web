<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { inView } from '$lib/components/magazine/animations';
	import * as Select from '$lib/components/ui/select';
	import { Button } from '$lib/components/ui/button';
	import { toast } from 'svelte-sonner';
	import CartToast from '$lib/components/shop/CartToast.svelte';
	import ProductCard from '$lib/components/shop/ProductCard.svelte';

	let { data } = $props();

	const sortOptions = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'price-asc', label: 'Price: Low to High' },
		{ value: 'price-desc', label: 'Price: High to Low' }
	];

	type GridSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
	const gridSizes: GridSize[] = ['xs', 'sm', 'md', 'lg', 'xl'];
	let gridSize = $state<GridSize>('md');
	let animating = $state(false);

	const gridClasses: Record<GridSize, string> = {
		xs: 'grid-cols-5 gap-1.5 lg:grid-cols-10 lg:gap-2',
		sm: 'grid-cols-4 gap-2 lg:grid-cols-8 lg:gap-3',
		md: 'grid-cols-3 gap-3 lg:grid-cols-6 lg:gap-4',
		lg: 'grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6',
		xl: 'grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8'
	};
	let gridEl = $state<HTMLDivElement | null>(null);

	let addingId = $state<string | null>(null);

	async function setGridSize(size: GridSize) {
		if (size === gridSize || animating) return;
		animating = true;

		try {
			const { gsap } = await import('gsap');
			// @ts-ignore — gsap/Flip type casing mismatch on case-sensitive FS
			const { Flip } = await import('gsap/Flip');
			gsap.registerPlugin(Flip);

			const items = gridEl?.querySelectorAll('[data-flip-id]');
			if (!items?.length) {
				gridSize = size;
				animating = false;
				return;
			}

			const state = Flip.getState(items);
			const oldHeight = gridEl!.offsetHeight;
			gridSize = size;

			await new Promise<void>((resolve) => {
				requestAnimationFrame(() => {
					const newHeight = gridEl!.offsetHeight;
					if (oldHeight !== newHeight) {
						gsap.fromTo(
							gridEl,
							{ height: oldHeight },
							{
								height: newHeight,
								duration: 0.7,
								ease: 'power2.inOut',
								onComplete: () => {
									gsap.set(gridEl, { height: 'auto' });
								}
							}
						);
					}
					Flip.from(state, {
						duration: 0.7,
						ease: 'power2.inOut',
						onComplete: resolve
					});
				});
			});
		} finally {
			animating = false;
		}
	}

	function onSortChange(value: string | undefined) {
		if (value) {
			const params = new URLSearchParams();
			params.set('sort', value);
			if (data.collection) params.set('collection', data.collection);
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

<svelte:head>
	<title>Shop — Aziza</title>
	<meta
		name="description"
		content="Shop Aziza's collection of thoughtfully crafted home textiles."
	/>
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Header -->
		<div class="mb-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p
					use:inView
					class="reveal-up mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					Shop
				</p>
				<h1 use:inView class="reveal-up font-serif text-4xl font-light lg:text-5xl">
					{data.collection
						? (data.collections.find((c) => c.handle === data.collection)?.title ?? 'Collection')
						: 'All Products'}
				</h1>
			</div>

			<!-- Sort + Zoom -->
			<div use:inView class="reveal-up flex items-center gap-4">
				<div class="flex gap-1">
					{#each gridSizes as size (size)}
						<button
							onclick={() => setGridSize(size)}
							disabled={animating}
							class="border px-3 py-2 text-xs tracking-wide transition-colors {gridSize === size
								? 'border-foreground bg-foreground text-background'
								: 'border-border text-muted-foreground hover:border-foreground'}"
						>
							{size}
						</button>
					{/each}
				</div>
				<Select.Root type="single" value={data.sort} onValueChange={onSortChange}>
					<Select.Trigger class="w-[200px] rounded-none text-sm">
						{sortOptions.find((o) => o.value === data.sort)?.label ?? 'Sort by'}
					</Select.Trigger>
					<Select.Content>
						{#each sortOptions as option (option.value)}
							<Select.Item value={option.value} class="text-sm">
								{option.label}
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
		</div>

		<!-- Collection filter pills -->
		{#if data.collections.length > 0}
			<div use:inView class="reveal-up mb-10 flex flex-wrap gap-2">
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
						class="border px-4 py-2 text-xs tracking-wide transition-colors {data.collection ===
						col.handle
							? 'border-foreground bg-foreground text-background'
							: 'border-border text-muted-foreground hover:border-foreground'}"
					>
						{col.title}
					</a>
				{/each}
			</div>
		{/if}

		<!-- Product Grid -->
		{#if data.products.length === 0}
			<div class="py-20 text-center">
				<p class="text-muted-foreground">No products found</p>
			</div>
		{:else}
			<div class="grid {gridSize === 'xs' ? 'mb-4 grid-rows-[1fr]' : 'grid-rows-[0fr]'}">
				<p
					class="overflow-hidden text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					{data.collection
						? (data.collections.find((c: { handle: string }) => c.handle === data.collection)
								?.title ?? 'Products')
						: 'All Products'}
					— {data.products.length} items
				</p>
			</div>
			<div bind:this={gridEl} class="grid {gridClasses[gridSize]}">
				{#each data.products as product, i (product.id)}
					<ProductCard
						{product}
						index={i}
						{gridSize}
						onQuickAdd={quickAdd}
						adding={addingId === product.id}
					/>
				{/each}
			</div>

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
