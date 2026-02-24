<script lang="ts">
	import { page } from '$app/state';
	import { SsgoiTransition } from '@ssgoi/svelte';
	import { Button } from '$lib/components/ui/button';

	import bloom from '$lib/assets/collections/collection-01-xl.webp';
	import ivory from '$lib/assets/collections/collection-02-xl.webp';
	import wildGarden from '$lib/assets/collections/collection-03-xl.webp';
	import atelier from '$lib/assets/collections/collection-04-xl.webp';

	import prod1 from '$lib/assets/stock-images/AdobeStock_1632366276.webp';
	import prod2 from '$lib/assets/stock-images/AdobeStock_1710340739.webp';
	import prod3 from '$lib/assets/stock-images/AdobeStock_1868479109.webp';
	import prod4 from '$lib/assets/stock-images/AdobeStock_1705702729.webp';

	type Collection = {
		name: string;
		tag: string;
		image: string;
		description: string;
	};

	const collections: Record<string, Collection> = {
		bloom: {
			name: 'The Bloom',
			tag: 'New Collection',
			image: bloom,
			description:
				'A celebration of the garden in full flower — peonies and petals translated into the softest cotton and linen weaves.'
		},
		ivory: {
			name: 'The Ivory',
			tag: 'Bestseller',
			image: ivory,
			description:
				'Clean, luminous whites and quiet creams. Timeless pieces that work in every room, in every light.'
		},
		'wild-garden': {
			name: 'Wild Garden',
			tag: 'Spring Edit',
			image: wildGarden,
			description:
				'Soft botanical prints inspired by meadow flowers — for those who want a little nature inside.'
		},
		atelier: {
			name: 'The Atelier',
			tag: 'Limited Edition',
			image: atelier,
			description:
				'Our most considered collection. Rich, dramatic florals drawn from 17th-century botanical paintings.'
		}
	};

	const collection = $derived(collections[page.params.id ?? ''] ?? collections['bloom']);

	const products = [
		{ name: 'Duvet Cover', size: 'Double / King', price: '€145', image: prod1 },
		{ name: 'Pillowcase Set', size: 'Standard × 2', price: '€65', image: prod2 },
		{ name: 'Fitted Sheet', size: 'Double / King', price: '€95', image: prod3 },
		{ name: 'Throw Cushion', size: '50 × 50 cm', price: '€55', image: prod4 }
	];
</script>

<svelte:head>
	<title>{collection.name} — Aziza</title>
	<meta name="description" content={collection.description} />
</svelte:head>

<SsgoiTransition id="/collections/{page.params.id}">
	<section
		data-hero-key="collection-{page.params.id}"
		class="relative flex min-h-screen items-end overflow-hidden pb-20"
	>
		<img
			src={collection.image}
			alt={collection.name}
			class="absolute inset-0 h-full w-full object-cover"
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

<section class="py-20 lg:py-28">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-10 flex items-end justify-between">
			<div>
				<p class="mb-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
					Products
				</p>
				<h2 class="font-serif text-3xl font-light">The Full Edit</h2>
			</div>
			<a
				href="/collections"
				class="text-sm text-muted-foreground underline-offset-4 hover:underline"
			>
				All collections
			</a>
		</div>

		<div class="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
			{#each products as product (product.name)}
				<div class="group cursor-pointer">
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
	</div>
</section>
