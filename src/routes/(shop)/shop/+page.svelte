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

	let addingId = $state<string | null>(null);

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
						? data.collections.find((c) => c.handle === data.collection)?.title ?? 'Collection'
						: 'All Products'}
				</h1>
			</div>

			<!-- Sort -->
			<div use:inView class="reveal-up">
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
						href="/shop?collection={col.handle}{data.sort !== 'newest'
							? `&sort=${data.sort}`
							: ''}"
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
