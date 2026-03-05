<script lang="ts">
	import { inView } from '$lib/components/magazine/animations';
	import * as Accordion from '$lib/components/ui/accordion';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';
	import {
		Droplets,
		Wind,
		ThermometerSun,
		Sparkles,
		ShieldCheck,
		Heart
	} from '@lucide/svelte';
	import type { Component } from 'svelte';

	const principles: { icon: Component; title: string; text: string }[] = [
		{
			icon: Droplets,
			title: 'Gentle Washing',
			text: 'Always wash at 30–40°C on a gentle or delicate cycle. Use a mild, eco-friendly detergent. Avoid bleach and optical brighteners — they weaken natural fibres over time.'
		},
		{
			icon: Wind,
			title: 'Air Dry When Possible',
			text: 'Line drying is the kindest option for natural textiles. It preserves fibres, saves energy, and gives linen that beautiful lived-in softness. If you must tumble dry, use a low heat setting.'
		},
		{
			icon: ThermometerSun,
			title: 'Iron with Care',
			text: 'Iron while slightly damp for best results. Use a medium setting for cotton, medium-high for linen. Or embrace the natural texture — a relaxed look is part of the charm.'
		},
		{
			icon: Sparkles,
			title: 'Gets Softer with Time',
			text: 'Natural fibres improve with use. Linen in particular becomes wonderfully supple after a few washes. Your Aziza textiles are designed to get better, not worse.'
		},
		{
			icon: ShieldCheck,
			title: 'Stain Treatment',
			text: 'Act quickly — blot (never rub) with cold water. For stubborn stains, apply a small amount of mild soap directly before washing. Avoid harsh chemical stain removers.'
		},
		{
			icon: Heart,
			title: 'Storage',
			text: 'Store textiles in a cool, dry place away from direct sunlight. Fold rather than hang to prevent stretching. For long-term storage, use breathable cotton bags — never plastic.'
		}
	];

	const materials = [
		{
			name: 'Organic Cotton',
			wash: '40°C gentle cycle',
			dry: 'Tumble dry low or line dry',
			iron: 'Medium heat',
			notes:
				'Pre-washed to minimise shrinkage. Expect up to 3% natural shrinkage on first wash. Colours stay vibrant wash after wash when washed in cold water with like colours.'
		},
		{
			name: 'Belgian Linen',
			wash: '30°C gentle cycle',
			dry: 'Line dry recommended',
			iron: 'Medium-high heat while damp',
			notes:
				'Linen softens beautifully over time. Slight colour variation between batches is natural and a hallmark of genuine linen. Avoid wringing — gently reshape while damp.'
		},
		{
			name: 'Cotton-Linen Blend',
			wash: '30–40°C gentle cycle',
			dry: 'Tumble dry low or line dry',
			iron: 'Medium heat',
			notes:
				'Combines the crispness of cotton with the texture of linen. More wrinkle-resistant than pure linen while retaining a natural drape. Ideal for everyday use.'
		},
		{
			name: 'Wool & Cashmere Throws',
			wash: 'Hand wash or dry clean',
			dry: 'Lay flat to dry',
			iron: 'Steam only — do not press',
			notes:
				'Spot-clean when possible. For a refresh between washes, air outside on a dry day. Store folded with cedar to protect against moths. Pilling is natural and can be removed with a fabric comb.'
		}
	];
</script>

<svelte:head>
	<title>Care Guide — Aziza</title>
	<meta
		name="description"
		content="How to care for your Aziza textiles — washing, drying, ironing, and storage tips for every material."
	/>
</svelte:head>

<!-- Header -->
<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up">
			<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
				Care Guide
			</p>
			<h1 class="mb-4 font-serif text-4xl font-light lg:text-5xl">
				Looking After Your Textiles
			</h1>
			<p class="max-w-lg text-muted-foreground">
				Our pieces are made to last for years. A little care goes a long way — here's how to keep
				them at their best.
			</p>
		</div>
	</div>
</section>

<!-- Care Principles Grid -->
<section data-navbar-dark class="border-t border-border/30 py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up mb-16">
			<h2 class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase">
				General Principles
			</h2>
			<p class="font-serif text-2xl font-light lg:text-3xl">The basics for every piece</p>
		</div>

		<div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-16">
			{#each principles as item, i}
				{@const Icon = item.icon}
				<div use:inView class="reveal-up" style="transition-delay: {i * 80}ms">
					<div class="mb-5 flex h-12 w-12 items-center justify-center border border-border">
						<Icon class="h-5 w-5 text-foreground/50" />
					</div>
					<h3 class="mb-3 font-serif text-xl font-light">{item.title}</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">{item.text}</p>
				</div>
			{/each}
		</div>
	</div>
</section>

<!-- Material-Specific Care -->
<section data-navbar-dark class="border-t border-border/30 py-20">
	<div class="mx-auto max-w-3xl px-6 lg:px-8">
		<div use:inView class="reveal-up mb-10">
			<h2 class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase">
				By Material
			</h2>
			<p class="font-serif text-2xl font-light lg:text-3xl">Care by fibre type</p>
		</div>

		<Accordion.Root type="single" class="border-t border-border/30">
			{#each materials as mat, i}
				<Accordion.Item value="mat-{i}" class="border-b border-border/30">
					<Accordion.Trigger class="py-5 text-left font-serif text-lg font-light">
						{mat.name}
					</Accordion.Trigger>
					<Accordion.Content>
						<div class="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-3">
							<div>
								<span
									class="mb-1 block text-xs font-medium tracking-wide text-muted-foreground/40 uppercase"
									>Wash</span
								>
								<p class="text-sm text-muted-foreground">{mat.wash}</p>
							</div>
							<div>
								<span
									class="mb-1 block text-xs font-medium tracking-wide text-muted-foreground/40 uppercase"
									>Dry</span
								>
								<p class="text-sm text-muted-foreground">{mat.dry}</p>
							</div>
							<div>
								<span
									class="mb-1 block text-xs font-medium tracking-wide text-muted-foreground/40 uppercase"
									>Iron</span
								>
								<p class="text-sm text-muted-foreground">{mat.iron}</p>
							</div>
						</div>
						<p class="pb-5 text-sm leading-relaxed text-muted-foreground/70">{mat.notes}</p>
					</Accordion.Content>
				</Accordion.Item>
			{/each}
		</Accordion.Root>
	</div>
</section>

<!-- CTA -->
<section data-navbar-dark class="border-t border-border/30 py-16 text-center">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up">
			<p class="mb-2 font-serif text-xl font-light">Not sure about a specific product?</p>
			<p class="mb-6 text-sm text-muted-foreground">
				Detailed care labels are included with every order. For anything else, we're here.
			</p>
			<a
				href="/contact"
				class="inline-block border border-foreground px-8 py-3 text-xs tracking-wide transition-colors hover:bg-foreground hover:text-background"
			>
				Ask Us
			</a>
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
