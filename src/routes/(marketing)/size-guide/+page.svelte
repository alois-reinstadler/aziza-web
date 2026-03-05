<script lang="ts">
	import { inView } from '$lib/components/magazine/animations';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';

	const bedding = [
		{ name: 'Single Duvet Cover', dimensions: '135 × 200 cm', fits: 'Single bed (90 cm)' },
		{ name: 'Double Duvet Cover', dimensions: '200 × 200 cm', fits: 'Double bed (140 cm)' },
		{ name: 'King Duvet Cover', dimensions: '220 × 240 cm', fits: 'King bed (160–180 cm)' },
		{ name: 'Pillowcase (Standard)', dimensions: '50 × 70 cm', fits: 'Standard pillow' },
		{ name: 'Pillowcase (Square)', dimensions: '60 × 60 cm', fits: 'Continental pillow' },
		{ name: 'Fitted Sheet (Single)', dimensions: '90 × 200 × 30 cm', fits: 'Mattress up to 30 cm' },
		{
			name: 'Fitted Sheet (Double)',
			dimensions: '140 × 200 × 30 cm',
			fits: 'Mattress up to 30 cm'
		},
		{ name: 'Fitted Sheet (King)', dimensions: '180 × 200 × 30 cm', fits: 'Mattress up to 30 cm' }
	];

	const throws = [
		{ name: 'Accent Throw', dimensions: '130 × 170 cm', fits: 'Armchair or sofa accent' },
		{ name: 'Sofa Throw', dimensions: '150 × 200 cm', fits: 'Standard 2–3 seater sofa' },
		{ name: 'Bed Throw', dimensions: '180 × 250 cm', fits: 'Double / King bed' }
	];

	const table = [
		{ name: 'Napkin', dimensions: '45 × 45 cm', fits: 'Place setting' },
		{ name: 'Placemat', dimensions: '35 × 50 cm', fits: 'Standard dining plate' },
		{ name: 'Table Runner', dimensions: '40 × 150 cm', fits: '4-seater table' },
		{ name: 'Table Runner (Long)', dimensions: '40 × 250 cm', fits: '6–8 seater table' },
		{ name: 'Tablecloth (Small)', dimensions: '140 × 180 cm', fits: '4-seater table' },
		{ name: 'Tablecloth (Large)', dimensions: '160 × 260 cm', fits: '6–8 seater table' }
	];

	const curtains = [
		{ name: 'Standard Panel', dimensions: '140 × 250 cm', fits: 'Ceiling height up to 260 cm' },
		{ name: 'Long Panel', dimensions: '140 × 280 cm', fits: 'Ceiling height up to 290 cm' },
		{ name: 'Wide Panel', dimensions: '280 × 250 cm', fits: 'Windows up to 200 cm wide' }
	];

	const categories = [
		{ title: 'Bedding', items: bedding },
		{ title: 'Throws & Blankets', items: throws },
		{ title: 'Table Linen', items: table },
		{ title: 'Curtains', items: curtains }
	];
</script>

<svelte:head>
	<title>Size Guide — Aziza</title>
	<meta
		name="description"
		content="Find the right size for your Aziza home textiles — bedding, throws, table linen, and curtains."
	/>
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-4xl px-6 lg:px-8">
		<!-- Header -->
		<div use:inView class="reveal-up mb-16">
			<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
				Reference
			</p>
			<h1 class="mb-4 font-serif text-4xl font-light lg:text-5xl">Size Guide</h1>
			<p class="max-w-lg text-muted-foreground">
				All measurements are in centimetres. If you're unsure which size is right for your space,
				<a href="/contact" class="underline hover:text-foreground">get in touch</a> — we're happy
				to help.
			</p>
		</div>

		<!-- Size Tables -->
		{#each categories as category, ci}
			<div use:inView class="reveal-up mb-14" style="transition-delay: {ci * 80}ms">
				<h2
					class="mb-5 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase"
				>
					{category.title}
				</h2>

				<!-- Header row -->
				<div
					class="hidden border-b border-border/50 pb-3 text-xs font-medium tracking-wide text-muted-foreground/40 uppercase sm:grid sm:grid-cols-3"
				>
					<span>Product</span>
					<span>Dimensions</span>
					<span>Fits</span>
				</div>

				<!-- Data rows -->
				{#each category.items as item}
					<div
						class="flex flex-col gap-0.5 border-b border-border/20 py-4 sm:grid sm:grid-cols-3 sm:items-center sm:gap-0"
					>
						<span class="font-serif text-base font-light">{item.name}</span>
						<span class="text-sm text-muted-foreground">{item.dimensions}</span>
						<span class="text-sm text-muted-foreground/60">{item.fits}</span>
					</div>
				{/each}
			</div>
		{/each}

		<!-- Measuring Tips -->
		<div use:inView class="reveal-up border-t border-border/30 pt-12">
			<h2
				class="mb-6 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase"
			>
				Measuring Tips
			</h2>
			<div class="grid grid-cols-1 gap-8 sm:grid-cols-2">
				<div>
					<h3 class="mb-2 font-serif text-lg font-light">Bedding</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">
						Measure your mattress width — not the bed frame. Duvet covers should be slightly larger
						than your duvet insert for a relaxed drape. Our fitted sheets accommodate mattresses up
						to 30 cm deep.
					</p>
				</div>
				<div>
					<h3 class="mb-2 font-serif text-lg font-light">Throws</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">
						For a draped look over a sofa, choose a throw at least as wide as your seat. Bed throws
						should overhang by 20–30 cm on each side for an effortless feel.
					</p>
				</div>
				<div>
					<h3 class="mb-2 font-serif text-lg font-light">Table Linen</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">
						A tablecloth should hang at least 20 cm over each edge. For a more formal look, aim for
						30 cm. Table runners should overhang the table by 15–20 cm on each end.
					</p>
				</div>
				<div>
					<h3 class="mb-2 font-serif text-lg font-light">Curtains</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">
						Mount your curtain rod 10–15 cm above the window frame. Panels should just kiss the
						floor or puddle 2–3 cm for a luxurious effect. For fullness, use 1.5–2× the window width.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<MagNewsletter />

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
