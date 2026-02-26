<script lang="ts">
	import { inView, countUp } from '$lib/components/magazine/animations';
	import { Button } from '$lib/components/ui/button';

	import storyImage from '$lib/assets/placeholder/story-01.jpg';
	import craftImage from '$lib/assets/placeholder/craft-01.jpg';

	import materialImg1 from '$lib/assets/stock-images/AdobeStock_687113608.webp';
	import materialImg2 from '$lib/assets/stock-images/AdobeStock_1534945326.webp';
	import materialImg3 from '$lib/assets/stock-images/AdobeStock_1809727053.webp';

	let scrollY = $state(0);

	const materials = [
		{
			name: 'Organic Cotton',
			origin: 'GOTS Certified',
			cert: 'Traceable to origin',
			desc: 'Soft, breathable, and grown without synthetic pesticides. Our cotton is certified to the Global Organic Textile Standard.',
			image: materialImg1
		},
		{
			name: 'Belgian Linen',
			origin: 'Flanders, Belgium',
			cert: 'European Flax®',
			desc: 'Prized for its natural lustre and durability. Each batch is woven at family-run mills with over a century of tradition.',
			image: materialImg2
		},
		{
			name: 'Silk-Cotton Blend',
			origin: 'Handloom Finished',
			cert: 'Limited Edition',
			desc: 'The warmth of cotton meets the sheen of silk. Reserved for our Atelier collection — no more than 200 pieces per design.',
			image: materialImg3
		}
	];

	const stats = [
		{ target: 100, suffix: '%', label: 'Organic materials' },
		{ target: 3, suffix: '', label: 'Family-run mills' },
		{ target: 0, suffix: '', label: 'Synthetic dyes', static: true },
		{ target: 100, suffix: '+', label: 'Wash cycles tested' }
	];

	const certifications = [
		{ name: 'GOTS', desc: 'Global Organic Textile Standard' },
		{ name: 'OEKO-TEX®', desc: 'Standard 100 Certified' },
		{ name: 'EU Ecolabel', desc: 'European Environmental Standard' },
		{ name: 'Fair Trade', desc: 'Certified Fair Labour Practices' }
	];
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>Sustainability — Aziza</title>
	<meta
		name="description"
		content="From the fields where our fibres grow to the homes where they belong — every step is considered."
	/>
</svelte:head>

<!-- Hero -->
<section data-navbar-dark class="relative flex min-h-[70vh] items-end overflow-hidden pb-20">
	<img
		src={storyImage}
		alt="Aziza sustainability"
		class="absolute inset-0 h-full w-full object-cover"
		style="transform: translateY({scrollY * 0.15}px)"
	/>
	<div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
	<div class="absolute inset-0 bg-linear-to-r from-black/30 to-transparent"></div>
	<div class="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
		<span class="mb-4 block text-xs font-medium tracking-[0.25em] text-white/60 uppercase">
			Sustainability
		</span>
		<h1 class="mb-5 font-serif text-5xl font-light text-white sm:text-6xl lg:text-7xl">
			Made with Intention
		</h1>
		<p class="max-w-md leading-relaxed text-white/70">
			From the fields where our fibres grow to the homes where they belong — every step is
			considered.
		</p>
	</div>
</section>

<!-- Materials Showcase -->
<section data-navbar-dark class="py-24 lg:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<p
			use:inView
			class="reveal-up mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
		>
			Our Materials
		</p>
		<h2 use:inView class="reveal-up mb-16 font-serif text-3xl font-light lg:text-4xl">
			The Finest Natural Fibres
		</h2>
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:gap-12">
			{#each materials as material, i (material.name)}
				<div use:inView class="reveal-up" style="transition-delay: {i * 120}ms">
					<div class="mb-6 overflow-hidden">
						<img
							src={material.image}
							alt={material.name}
							class="aspect-4/5 w-full object-cover"
						/>
					</div>
					<h3 class="mb-1 font-serif text-xl font-light">{material.name}</h3>
					<p class="mb-3 text-xs tracking-wide text-muted-foreground/60 uppercase">
						{material.origin}
					</p>
					<p class="text-sm leading-relaxed text-muted-foreground">{material.desc}</p>
					<span
						class="mt-3 inline-block border border-border px-3 py-1 text-xs tracking-wide text-muted-foreground"
					>
						{material.cert}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- By the Numbers -->
<section data-navbar-dark class="border-y border-border/30 py-16">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
			{#each stats as stat, i (stat.label)}
				<div use:inView class="reveal-up text-center" style="transition-delay: {i * 100}ms">
					{#if stat.static}
						<span class="block font-serif text-4xl font-light text-foreground lg:text-5xl">
							0
						</span>
					{:else}
						<span
							use:countUp={{ target: stat.target, suffix: stat.suffix }}
							class="block font-serif text-4xl font-light text-foreground lg:text-5xl"
						>
							0{stat.suffix}
						</span>
					{/if}
					<span class="mt-2 block text-xs tracking-wide text-muted-foreground uppercase">
						{stat.label}
					</span>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Supply Chain -->
<section data-navbar-dark class="py-24 lg:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
			<div use:inView class="reveal-up overflow-hidden">
				<img src={craftImage} alt="Artisan weaving" class="aspect-4/5 w-full object-cover" />
			</div>
			<div use:inView class="reveal-up">
				<p
					class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					Our Supply Chain
				</p>
				<h2 class="mb-6 font-serif text-3xl font-light lg:text-4xl">From Field to Finished</h2>
				<p class="mb-4 leading-relaxed text-muted-foreground">
					Every Aziza piece begins in the fields of certified organic farms, where cotton grows
					without synthetic pesticides and linen flax sways in the Flemish wind.
				</p>
				<p class="mb-4 leading-relaxed text-muted-foreground">
					Our yarns travel to family-run mills in Portugal and Belgium — workshops where
					generations of weavers have perfected their craft. Here, every thread is placed with
					intention, every pattern woven with care.
				</p>
				<p class="leading-relaxed text-muted-foreground">
					The result is a textile that feels alive — organic, never rigid. Pre-washed, tested
					for over a hundred cycles, and made to become softer and more beautiful with every
					year.
				</p>
			</div>
		</div>
	</div>
</section>

<!-- Certifications -->
<section data-navbar-dark class="py-20 lg:py-24">
	<div class="mx-auto max-w-7xl px-6 text-center lg:px-8">
		<p
			use:inView
			class="reveal-up mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
		>
			Certifications
		</p>
		<h2 use:inView class="reveal-up mb-12 font-serif text-2xl font-light lg:text-3xl">
			Independently Verified
		</h2>
		<div class="grid grid-cols-2 gap-6 sm:grid-cols-4">
			{#each certifications as cert, i (cert.name)}
				<div
					use:inView
					class="reveal-up border border-border p-6"
					style="transition-delay: {i * 100}ms"
				>
					<p class="mb-1 font-serif text-lg font-light">{cert.name}</p>
					<p class="text-xs text-muted-foreground">{cert.desc}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- CTA -->
<section data-navbar-dark class="border-t border-border/30 py-24">
	<div use:inView class="reveal-up mx-auto max-w-2xl px-6 text-center lg:px-8">
		<h2 class="mb-4 font-serif text-3xl font-light lg:text-4xl">Explore Our Collections</h2>
		<p class="mb-8 text-muted-foreground">
			Discover textiles that are made with intention — for you and for the planet.
		</p>
		<a href="/collections">
			<Button class="rounded-none px-10 text-sm tracking-wide">Shop Collections</Button>
		</a>
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
