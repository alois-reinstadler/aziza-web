<script lang="ts">
	import { goto } from '$app/navigation';
	import { inView } from '$lib/components/magazine/animations';
	import * as Select from '$lib/components/ui/select';

	let { data } = $props();

	const sortOptions = [
		{ value: 'newest', label: 'Newest' },
		{ value: 'price-asc', label: 'Price: Low to High' },
		{ value: 'price-desc', label: 'Price: High to Low' }
	];

	function formatMoney(amount: string) {
		return `€${parseFloat(amount).toFixed(2)}`;
	}

	function onSortChange(value: string | undefined) {
		if (value) goto(`/shop?sort=${value}`);
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
		<div class="mb-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
			<div>
				<p
					use:inView
					class="reveal-up mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					Shop
				</p>
				<h1 use:inView class="reveal-up font-serif text-4xl font-light lg:text-5xl">
					All Products
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

		<!-- Product Grid -->
		{#if data.products.length === 0}
			<div class="py-20 text-center">
				<p class="text-muted-foreground">No products found</p>
			</div>
		{:else}
			<div class="grid grid-cols-2 gap-6 lg:grid-cols-3 lg:gap-8">
				{#each data.products as product, i (product.id)}
					<a href="/shop/{product.handle}" class="group block" use:inView>
						<div class="reveal-up" style="transition-delay: {i * 80}ms">
							<div class="mb-3 overflow-hidden">
								{#if product.featuredImage}
									<img
										src={product.featuredImage.url}
										alt={product.featuredImage.altText ?? product.title}
										class="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
									/>
								{:else}
									<div class="aspect-3/4 w-full bg-muted"></div>
								{/if}
							</div>
							<h3 class="font-serif text-base font-light">{product.title}</h3>
							<p class="mt-1 text-sm text-muted-foreground">
								{formatMoney(product.priceRange.minVariantPrice.amount)}
							</p>
						</div>
					</a>
				{/each}
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
