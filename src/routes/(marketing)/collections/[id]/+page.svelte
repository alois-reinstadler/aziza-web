<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { inView } from '$lib/components/magazine/animations';
	import { collections, collectionsById } from '$lib/config/collections';

	const collection = $derived(collectionsById[page.params.id ?? ''] ?? collections[0]);
	const productPairs = $derived([collection.products.slice(0, 2), collection.products.slice(2, 4)]);

	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{collection.label} — Aziza</title>
	<meta name="description" content={collection.description} />
</svelte:head>

<!-- Hero -->
<section data-navbar-dark class="relative flex min-h-screen items-end overflow-hidden pb-20">
	<img
		src={collection.images.hero}
		alt={collection.label}
		class="absolute inset-0 h-full w-full object-cover"
		style="view-transition-name: collection-{page.params.id}; transform: translateY({scrollY *
			0.2}px)"
	/>
	<div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
	<div class="absolute inset-0 bg-linear-to-r from-black/30 to-transparent"></div>
	<div class="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
		<span class="mb-4 block text-xs font-medium tracking-[0.25em] text-white/60 uppercase">
			{collection.tag}
		</span>
		<h1 class="mb-5 font-serif text-5xl font-light text-white sm:text-6xl lg:text-7xl">
			{collection.label}
		</h1>
		<p class="mb-8 max-w-md leading-relaxed text-white/70">{collection.description}</p>
		<Button class="rounded-none bg-white px-10 text-sm tracking-wide text-black hover:bg-stone-100">
			Shop this Collection
		</Button>
	</div>
</section>

<!-- Story: The Inspiration -->
<section class="py-24 lg:py-32" data-navbar-dark>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
			<!-- Story image -->
			<div use:inView class="reveal-up overflow-hidden">
				<img
					src={collection.story.image}
					alt="{collection.label} inspiration"
					class="aspect-4/5 w-full object-cover"
				/>
			</div>

			<!-- Story text -->
			<div>
				<p
					use:inView
					class="reveal-up mb-4 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					The Inspiration
				</p>
				<h2 use:inView class="reveal-up mb-8 font-serif text-3xl font-light lg:text-4xl">
					Behind {collection.label}
				</h2>
				<p use:inView class="reveal-up mb-6 leading-relaxed text-muted-foreground">
					{collection.story.inspiration}
				</p>
				<p use:inView class="reveal-up leading-relaxed text-muted-foreground">
					{collection.story.process}
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Pull Quote -->
<section class="border-y border-border/30 py-20 lg:py-28" data-navbar-dark>
	<div class="mx-auto max-w-4xl px-6 text-center lg:px-8">
		<blockquote use:inView class="reveal-up">
			<p
				class="mb-6 font-serif text-2xl leading-snug font-light text-foreground italic lg:text-3xl"
			>
				"{collection.story.quote}"
			</p>
			<cite class="text-sm tracking-wide text-muted-foreground not-italic">
				— {collection.story.quoteAuthor}
			</cite>
		</blockquote>
	</div>
</section>

<!-- Materials -->
<section class="py-16 lg:py-20" data-navbar-dark>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
			{#each collection.story.materials as material, i (material)}
				<div class="flex items-center gap-3 text-sm text-muted-foreground">
					{#if i > 0}
						<span class="hidden text-border sm:inline">·</span>
					{/if}
					<span>{material}</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Lookbook: alternating lifestyle images + product pairs -->
<section class="py-20 lg:py-28" data-navbar-dark>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up mb-16 text-center">
			<p class="mb-3 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
				The Lookbook
			</p>
			<h2 class="font-serif text-3xl font-light lg:text-4xl">Styled for living</h2>
		</div>

		{#each productPairs as pair, i (i)}
			<!-- Lifestyle image -->
			<div use:inView class="reveal-up mb-12 overflow-hidden">
				<div class="relative aspect-21/9 overflow-hidden">
					<img
						src={collection.lifestyleImages[i].src}
						alt={collection.lifestyleImages[i].alt}
						class="h-full w-full object-cover transition-transform duration-700"
					/>
				</div>
			</div>

			<!-- Product pair -->
			<div class="mb-20 grid grid-cols-2 gap-4 lg:gap-8">
				{#each pair as product, j (product.name)}
					<div
						use:inView
						class="reveal-up group cursor-pointer"
						style="transition-delay: {j * 100}ms"
					>
						<div class="relative mb-3 aspect-3/4 overflow-hidden">
							<img
								src={product.image}
								alt={product.name}
								class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
							/>
						</div>
						<h3 class="font-serif text-base font-light">{product.name}</h3>
						<p class="mt-0.5 text-xs text-muted-foreground">{product.size}</p>
						<p class="mt-1 text-sm">{product.price}</p>
					</div>
				{/each}
			</div>
		{/each}
	</div>
</section>

<!-- CTA Banner -->
<section class="border-t border-border/30 py-24 lg:py-32" data-navbar-dark>
	<div use:inView class="reveal-up mx-auto max-w-2xl px-6 text-center lg:px-8">
		<h2 class="mb-4 font-serif text-3xl font-light lg:text-4xl">Explore the full collection</h2>
		<p class="mb-8 text-muted-foreground">
			Every piece in {collection.label} is designed to work together — mix, layer, and make it yours.
		</p>
		<Button class="rounded-none px-10 text-sm tracking-wide">Shop {collection.label}</Button>
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
