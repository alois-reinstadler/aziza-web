<script lang="ts">
	import bloom from '$lib/assets/collections/collection-01.webp';
	import ivory from '$lib/assets/collections/collection-02.webp';
	import wildGarden from '$lib/assets/collections/collection-03.webp';
	import atelier from '$lib/assets/collections/collection-04.webp';

	const collections = [
		{
			name: 'The Bloom',
			tag: 'New Collection',
			image: bloom,
			href: '/collections/bloom'
		},
		{
			name: 'The Ivory',
			tag: 'Bestseller',
			image: ivory,
			href: '/collections/ivory'
		},
		{
			name: 'Wild Garden',
			tag: 'Spring Edit',
			image: wildGarden,
			href: '/collections/wild-garden'
		},
		{
			name: 'The Atelier',
			tag: 'Limited Edition',
			image: atelier,
			href: '/collections/atelier'
		}
	];
</script>

<section data-navbar-dark class="py-20 lg:py-28">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-10 flex items-end justify-between">
			<div>
				<p class="mb-2 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
					Explore
				</p>
				<h2 class="font-serif text-3xl font-light lg:text-4xl">Our Collections</h2>
			</div>
			<a
				href="/collections"
				class="hidden text-sm text-muted-foreground underline-offset-4 transition-all hover:underline sm:inline"
			>
				View all
			</a>
		</div>

		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
			{#each collections as col (col.href)}
				<a href={col.href} class="group block">
					<div
						class="relative aspect-3/4 transform-gpu overflow-hidden"
						data-hero-key={`collection-${col.href.split('/').pop()}`}
					>
						<img
							src={col.image}
							alt={col.name}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
						/>
						<div
							class="absolute inset-0 bg-black/15 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
						></div>
						<span
							class="absolute top-3 left-3 bg-black/25 px-2 py-1 text-[10px] font-medium tracking-widest text-white uppercase"
						>
							{col.tag}
						</span>
					</div>
					<div class="mt-3">
						<h3 class="font-serif text-lg font-light">{col.name}</h3>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>
