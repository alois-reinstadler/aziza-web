<script lang="ts">
	import { page } from '$app/state';
	import { SsgoiTransition } from '@ssgoi/svelte';
	import { Button } from '$lib/components/ui/button';
	import { inView } from '$lib/components/magazine/animations';

	import bloom from '$lib/assets/collections/collection-01-xl.webp';
	import ivory from '$lib/assets/collections/collection-02-xl.webp';
	import wildGarden from '$lib/assets/collections/collection-03-xl.webp';
	import atelier from '$lib/assets/collections/collection-04-xl.webp';

	import prod1 from '$lib/assets/stock-images/AdobeStock_1632366276.webp';
	import prod2 from '$lib/assets/stock-images/AdobeStock_1710340739.webp';
	import prod3 from '$lib/assets/stock-images/AdobeStock_1868479109.webp';
	import prod4 from '$lib/assets/stock-images/AdobeStock_1705702729.webp';

	import lifestyle1 from '$lib/assets/stock-images/AdobeStock_1552940722.webp';
	import lifestyle2 from '$lib/assets/stock-images/AdobeStock_1290119063.webp';

	type Collection = {
		name: string;
		tag: string;
		image: string;
		description: string;
	};

	const collections: Record<string, Collection> = {
		'imperial-bloom': {
			name: 'Imperial Bloom',
			tag: 'New Collection',
			image: bloom,
			description:
				'A celebration of the garden in full flower — peonies and petals translated into the softest cotton and linen weaves.'
		},
		'maison-jardin': {
			name: 'Maison Jardin',
			tag: 'Bestseller',
			image: ivory,
			description:
				'Clean, luminous whites and quiet creams. Timeless pieces that work in every room, in every light.'
		},
		'alpine-heritage': {
			name: 'Alpine Heritage',
			tag: 'Spring Edit',
			image: wildGarden,
			description:
				'Soft botanical prints inspired by meadow flowers — for those who want a little nature inside.'
		},
		'aziza-atelier': {
			name: 'Aziza Atelier',
			tag: 'Limited Edition',
			image: atelier,
			description:
				'Our most considered collection. Rich, dramatic florals drawn from 17th-century botanical paintings.'
		}
	};

	const collection = $derived(collections[page.params.id ?? ''] ?? collections['imperial-bloom']);

	const products = [
		{ name: 'Duvet Cover', size: 'Double / King', price: '€145', image: prod1 },
		{ name: 'Pillowcase Set', size: 'Standard × 2', price: '€65', image: prod2 },
		{ name: 'Fitted Sheet', size: 'Double / King', price: '€95', image: prod3 },
		{ name: 'Throw Cushion', size: '50 × 50 cm', price: '€55', image: prod4 }
	];

	// Split products into pairs for lookbook rhythm
	const productPairs = [products.slice(0, 2), products.slice(2, 4)];
	const lifestyleImages = [
		{ src: lifestyle1, alt: 'Styled bedroom with Aziza textiles' },
		{ src: lifestyle2, alt: 'Living space with Aziza cushions and throws' }
	];

	let scrollY = $state(0);
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>{collection.name} — Aziza</title>
	<meta name="description" content={collection.description} />
</svelte:head>

<SsgoiTransition id="/collections/{page.params.id}">
	<!-- Hero -->
	<section
		data-navbar-dark
		data-hero-key="collection-{page.params.id}"
		class="relative flex min-h-screen items-end overflow-hidden pb-20"
	>
		<img
			src={collection.image}
			alt={collection.name}
			class="absolute inset-0 h-full w-full object-cover"
			style="transform: translateY({scrollY * 0.2}px)"
		/>
		<div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
		<div class="absolute inset-0 bg-linear-to-r from-black/30 to-transparent"></div>
		<div class="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
			<span class="mb-4 block text-xs font-medium tracking-[0.25em] text-white/60 uppercase">
				{collection.tag}
			</span>
			<h1 class="mb-5 font-serif text-5xl font-light text-white sm:text-6xl lg:text-7xl">
				{collection.name}
			</h1>
			<p class="mb-8 max-w-md leading-relaxed text-white/70">{collection.description}</p>
			<Button
				class="rounded-none bg-white px-10 text-sm tracking-wide text-black hover:bg-stone-100"
			>
				Shop this Collection
			</Button>
		</div>
	</section>
</SsgoiTransition>

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
			<!-- Lifestyle image — full width with parallax -->
			<div use:inView class="reveal-up mb-12 overflow-hidden">
				<div class="relative aspect-[21/9] overflow-hidden">
					<img
						src={lifestyleImages[i].src}
						alt={lifestyleImages[i].alt}
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
			Every piece in {collection.name} is designed to work together — mix, layer, and make it yours.
		</p>
		<Button class="rounded-none px-10 text-sm tracking-wide">Shop {collection.name}</Button>
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
