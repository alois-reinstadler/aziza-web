<script lang="ts">
	import { Leaf, Sparkles, Clock, Gem, Heart } from '@lucide/svelte';
	import { inView } from './animations';
	import type { Component } from 'svelte';

	import craftImage from '$lib/assets/stock-images/AdobeStock_459093612.webp';
	import detailImage from '$lib/assets/stock-images/AdobeStock_687113608.webp';

	const values: { icon: Component; title: string; description: string; detail: string }[] = [
		{
			icon: Leaf,
			title: 'Natural Fibres',
			description:
				'Certified organic cotton, Belgian linen, and responsibly sourced materials — gentle on you and the planet.',
			detail: 'Every fibre is traceable to its origin.'
		},
		{
			icon: Sparkles,
			title: 'Botanical Craft',
			description:
				'Each pattern is hand-drawn, each piece woven with care. We believe the details you live with should always be beautiful.',
			detail: 'Designed in-house, inspired by nature.'
		},
		{
			icon: Clock,
			title: 'Made to Last',
			description:
				'We design against the throwaway. Our textiles are built to become heirlooms, not seasonal casualties.',
			detail: 'Pre-washed and tested for 100+ cycles.'
		},
		{
			icon: Gem,
			title: 'Quiet Luxury',
			description:
				'No logos, no noise. Just exceptional quality you can feel the moment you touch it.',
			detail: 'Luxury that speaks for itself.'
		},
		{
			icon: Heart,
			title: 'Considered Design',
			description:
				'Every colour, texture and proportion is deliberated. We design for the room, not the shelf.',
			detail: 'Curated palettes that work in any home.'
		}
	];
</script>

<section data-navbar-dark class="py-24 lg:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Section header -->
		<div use:inView class="reveal-up mb-16 lg:mb-24">
			<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
				Our Values
			</p>
			<h2 class="mb-6 max-w-lg font-serif text-4xl font-light lg:text-5xl">The Aziza Craft</h2>
			<p class="max-w-md leading-relaxed text-muted-foreground">
				What we stand for shapes everything we make — from the fields where our fibres grow to the
				homes where they belong.
			</p>
		</div>

		<!-- Featured image + first value -->
		<div class="mb-20 grid grid-cols-1 items-center gap-12 lg:mb-28 lg:grid-cols-2 lg:gap-16">
			<div use:inView class="reveal-up overflow-hidden">
				<img src={craftImage} alt="Artisan weaving" class="aspect-4/5 w-full object-cover" />
			</div>
			<div use:inView class="reveal-up">
				<div class="mb-6 flex h-14 w-14 items-center justify-center border border-border">
					<svelte:component this={values[0].icon} class="h-6 w-6 text-foreground/50" />
				</div>
				<h3 class="mb-3 font-serif text-2xl font-light lg:text-3xl">{values[0].title}</h3>
				<p class="mb-3 leading-relaxed text-muted-foreground">{values[0].description}</p>
				<p class="text-sm text-muted-foreground/60 italic">{values[0].detail}</p>
			</div>
		</div>

		<!-- Middle values — 3 column grid -->
		<div class="mb-20 grid grid-cols-1 gap-12 sm:grid-cols-3 lg:mb-28 lg:gap-16">
			{#each values.slice(1, 4) as value, i (value.title)}
				{@const Icon = value.icon}
				<div use:inView class="reveal-up" style="transition-delay: {i * 120}ms">
					<div class="mb-5 flex h-12 w-12 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-foreground/50" />
					</div>
					<h3 class="mb-3 font-serif text-xl font-light">{value.title}</h3>
					<p class="mb-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
					<p class="text-xs text-muted-foreground/60 italic">{value.detail}</p>
				</div>
			{/each}
		</div>

		<!-- Closing image + last value -->
		<div class="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
			<div use:inView class="reveal-up order-2 lg:order-1">
				<div class="mb-6 flex h-14 w-14 items-center justify-center border border-border">
					<svelte:component this={values[4].icon} class="h-6 w-6 text-foreground/50" />
				</div>
				<h3 class="mb-3 font-serif text-2xl font-light lg:text-3xl">{values[4].title}</h3>
				<p class="mb-3 leading-relaxed text-muted-foreground">{values[4].description}</p>
				<p class="text-sm text-muted-foreground/60 italic">{values[4].detail}</p>
			</div>
			<div use:inView class="reveal-up order-1 overflow-hidden lg:order-2">
				<img src={detailImage} alt="Textile detail" class="aspect-4/5 w-full object-cover" />
			</div>
		</div>
	</div>
</section>

<style>
	.reveal-up {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 700ms ease-out,
			transform 700ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}
</style>
