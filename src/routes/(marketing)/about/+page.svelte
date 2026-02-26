<script lang="ts">
	import { Leaf, Sparkles, Clock, Gem, Heart } from '@lucide/svelte';
	import { inView } from '$lib/components/magazine/animations';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';
	import type { Component } from 'svelte';

	import craftImage from '$lib/assets/placeholder/craft-01.jpg';
	import storyImage from '$lib/assets/placeholder/story-01.jpg';
	import lifestyleImage from '$lib/assets/placeholder/lifestyle-01.jpg';

	let scrollY = $state(0);

	const values: { icon: Component; title: string; description: string }[] = [
		{
			icon: Leaf,
			title: 'Natural Fibres',
			description:
				'Certified organic cotton, Belgian linen, and responsibly sourced materials — gentle on you and the planet.'
		},
		{
			icon: Sparkles,
			title: 'Botanical Craft',
			description:
				'Each pattern is hand-drawn, each piece woven with care. We believe the details you live with should always be beautiful.'
		},
		{
			icon: Clock,
			title: 'Made to Last',
			description:
				'We design against the throwaway. Our textiles are built to become heirlooms, not seasonal casualties.'
		},
		{
			icon: Gem,
			title: 'Quiet Luxury',
			description:
				'No logos, no noise. Just exceptional quality you can feel the moment you touch it.'
		},
		{
			icon: Heart,
			title: 'Considered Design',
			description:
				'Every colour, texture and proportion is deliberated. We design for the room, not the shelf.'
		}
	];

	const steps = [
		{
			num: '01',
			title: 'Sourced',
			text: 'Organic cotton and Belgian linen, responsibly gathered from trusted growers across Europe.',
			image: storyImage
		},
		{
			num: '02',
			title: 'Woven',
			text: 'Skilled mills and careful craft — every thread placed with intention at family-run ateliers in Portugal and Belgium.',
			image: lifestyleImage
		},
		{
			num: '03',
			title: 'Home',
			text: 'Made to last, made to love. Pieces that become part of your story, softening with every wash.',
			image: craftImage
		}
	];

	const publications = [
		'Architectural Digest',
		'Elle Decoration',
		'Wallpaper*',
		'Monocle',
		'The New York Times'
	];
</script>

<svelte:window bind:scrollY />

<svelte:head>
	<title>About — Aziza</title>
	<meta
		name="description"
		content="Aziza was born from a deep belief that the details you live with should always be beautiful."
	/>
</svelte:head>

<!-- Hero Section -->
<section data-navbar-dark class="relative flex min-h-[70vh] items-end overflow-hidden pb-20">
	<img
		src={craftImage}
		alt="Aziza craft"
		class="absolute inset-0 h-full w-full object-cover"
		style="transform: translateY({scrollY * 0.15}px)"
	/>
	<div class="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent"></div>
	<div class="absolute inset-0 bg-linear-to-r from-black/30 to-transparent"></div>
	<div class="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
		<span class="mb-4 block text-xs font-medium tracking-[0.25em] text-white/60 uppercase"
			>About Aziza</span
		>
		<h1 class="mb-5 font-serif text-5xl font-light text-white sm:text-6xl lg:text-7xl">
			Where Home Becomes Heaven
		</h1>
		<p class="max-w-md leading-relaxed text-white/70">
			We believe the home should be a sanctuary — a place of warmth, calm, and quiet beauty.
		</p>
	</div>
</section>

<!-- Manifesto Section -->
<section data-navbar-dark class="py-24 lg:py-32">
	<div class="mx-auto max-w-3xl px-6 text-center lg:px-8">
		<p
			use:inView
			class="reveal-up mb-8 font-serif text-2xl leading-relaxed font-light lg:text-3xl"
		>
			Aziza was born from a deep belief that the details you live with should always be beautiful.
		</p>
		<p use:inView class="reveal-up mb-6 leading-relaxed text-muted-foreground">
			We draw on botanical heritage and artisan craft, balancing timeless design with the demands of
			modern living. Our collections are made to be lived in, layered with love, and passed down
			through generations.
		</p>
		<p use:inView class="reveal-up leading-relaxed text-muted-foreground">
			No logos, no noise — just exceptional quality you can feel the moment you touch it. Every
			colour, texture, and proportion is deliberated. We design for the room, not the shelf.
		</p>
	</div>
</section>

<!-- Values Grid Section -->
<section data-navbar-dark class="border-t border-border/30 py-24 lg:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<span
			use:inView
			class="reveal-up mb-3 block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
			>Our Values</span
		>
		<h2 use:inView class="reveal-up mb-16 font-serif text-3xl font-light lg:text-4xl">
			What We Stand For
		</h2>
		<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:gap-16">
			{#each values as value, i}
				{@const Icon = value.icon}
				<div
					use:inView
					class="reveal-up"
					style="transition-delay: {i * 100}ms"
				>
					<div class="mb-5 flex h-12 w-12 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-foreground/50" />
					</div>
					<h3 class="mb-3 font-serif text-xl font-light">{value.title}</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Process Timeline Section -->
<section data-navbar-dark class="border-t border-border/30 py-24 lg:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<span
			use:inView
			class="reveal-up mb-3 block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
			>From Field to Home</span
		>
		<h2 use:inView class="reveal-up mb-16 font-serif text-3xl font-light lg:text-4xl">
			How Our Textiles Come to Life
		</h2>
		<div class="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:gap-16">
			{#each steps as step, i}
				<div
					use:inView
					class="reveal-up"
					style="transition-delay: {i * 150}ms"
				>
					<div class="overflow-hidden">
						<img
							src={step.image}
							alt={step.title}
							class="mb-6 aspect-3/4 w-full object-cover"
						/>
					</div>
					<span class="mb-2 block font-serif text-3xl font-light text-foreground/20"
						>{step.num}</span
					>
					<h3 class="mb-2 text-sm font-medium tracking-wide uppercase">{step.title}</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Press Strip Section -->
<section data-navbar-dark class="border-y border-border/30 py-16">
	<div class="mx-auto max-w-7xl px-6 text-center lg:px-8">
		<span
			use:inView
			class="reveal-up mb-8 block text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase"
			>As Featured In</span
		>
		<div class="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
			{#each publications as pub}
				<span class="font-serif text-lg text-muted-foreground/30 italic">{pub}</span>
			{/each}
		</div>
	</div>
</section>

<!-- Newsletter CTA -->
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
