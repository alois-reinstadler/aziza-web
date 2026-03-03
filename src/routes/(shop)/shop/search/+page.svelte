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
				<Search
					class="absolute top-1/2 left-0 h-5 w-5 -translate-y-1/2 text-muted-foreground/40"
				/>
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
			{#if data.isPopular}
				<p
					use:inView
					class="reveal-up mb-6 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					Popular Products
				</p>
			{/if}
			<div class="grid grid-cols-2 gap-6 lg:gap-8 {data.isPopular ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}">
				{#each data.products as product, i (product.id)}
					<ProductCard
						{product}
						index={i}
						onQuickAdd={quickAdd}
						adding={addingId === product.id}
					/>
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
