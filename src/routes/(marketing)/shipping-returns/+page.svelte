<script lang="ts">
	import { inView } from '$lib/components/magazine/animations';
	import { Package, Truck, Globe, RotateCcw, Clock, ShieldCheck } from '@lucide/svelte';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';
	import type { Component } from 'svelte';

	const shippingTiers: { region: string; cost: string; time: string; note?: string }[] = [
		{ region: 'Germany', cost: 'Free over €120 / €5.90', time: '2–4 business days' },
		{ region: 'Austria & Switzerland', cost: '€9.90', time: '3–5 business days' },
		{
			region: 'EU (rest)',
			cost: '€12.90',
			time: '5–8 business days',
			note: 'Free over €200'
		},
		{
			region: 'International',
			cost: 'Calculated at checkout',
			time: '7–14 business days',
			note: 'Duties may apply'
		}
	];

	const highlights: { icon: Component; title: string; text: string }[] = [
		{
			icon: Truck,
			title: 'Carbon-Neutral Delivery',
			text: 'All shipments are sent via carbon-neutral delivery partners. Your order arrives without compromise.'
		},
		{
			icon: Package,
			title: 'Thoughtful Packaging',
			text: 'Every piece is wrapped in recycled tissue and shipped in compostable mailers — no plastic, no excess.'
		},
		{
			icon: Globe,
			title: 'Europe-Wide Shipping',
			text: 'We ship to all EU member states and Switzerland, with select international destinations available.'
		}
	];

	const returnSteps: { num: string; title: string; text: string }[] = [
		{
			num: '01',
			title: 'Get in Touch',
			text: 'Email us at hello@aziza-home.com within 30 days of delivery. Let us know what you would like to return or exchange.'
		},
		{
			num: '02',
			title: 'Ship It Back',
			text: 'We will send you a prepaid return label. Pack items in their original packaging and drop them at any pickup point.'
		},
		{
			num: '03',
			title: 'Refund or Exchange',
			text: 'Once we receive and inspect your return, we will process your refund within 5 business days or ship your exchange immediately.'
		}
	];
</script>

<svelte:head>
	<title>Shipping & Returns — Aziza</title>
	<meta
		name="description"
		content="Free shipping over €120 in Germany. Carbon-neutral delivery across Europe. 30-day hassle-free returns."
	/>
</svelte:head>

<!-- Header -->
<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up">
			<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
				Shipping & Returns
			</p>
			<h1 class="mb-4 font-serif text-4xl font-light lg:text-5xl">
				Delivery & Returns
			</h1>
			<p class="max-w-lg text-muted-foreground">
				We want your Aziza experience to be effortless from order to unboxing — and easy to make
				right if something isn't perfect.
			</p>
		</div>
	</div>
</section>

<!-- Highlights -->
<section data-navbar-dark class="border-t border-border/30 py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:gap-16">
			{#each highlights as item, i}
				{@const Icon = item.icon}
				<div use:inView class="reveal-up" style="transition-delay: {i * 100}ms">
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

<!-- Shipping Rates Table -->
<section data-navbar-dark class="border-t border-border/30 py-20">
	<div class="mx-auto max-w-3xl px-6 lg:px-8">
		<div use:inView class="reveal-up">
			<h2 class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase">
				Shipping Rates
			</h2>
			<p class="mb-10 font-serif text-2xl font-light lg:text-3xl">
				Where we deliver
			</p>
		</div>

		<div use:inView class="reveal-up">
			<div class="border-t border-border/30">
				{#each shippingTiers as tier, i}
					<div
						class="flex flex-col gap-1 border-b border-border/30 py-5 sm:flex-row sm:items-center sm:gap-0"
					>
						<span class="font-serif text-lg font-light sm:w-1/3">{tier.region}</span>
						<span class="text-sm text-muted-foreground sm:w-1/3">{tier.cost}</span>
						<span class="text-sm text-muted-foreground/60 sm:w-1/3 sm:text-right">
							{tier.time}
							{#if tier.note}
								<span class="ml-2 text-xs text-foreground/40">({tier.note})</span>
							{/if}
						</span>
					</div>
				{/each}
			</div>
		</div>

		<div use:inView class="reveal-up mt-8 flex items-start gap-3">
			<Clock class="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
			<p class="text-sm leading-relaxed text-muted-foreground/60">
				Orders placed before 14:00 CET on business days are dispatched the same day. Weekend and
				holiday orders ship the next business day. You will receive tracking details by email as
				soon as your parcel leaves our warehouse.
			</p>
		</div>
	</div>
</section>

<!-- Returns Process -->
<section data-navbar-dark class="border-t border-border/30 py-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up mb-16">
			<h2 class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase">
				Returns
			</h2>
			<p class="font-serif text-2xl font-light lg:text-3xl">
				30-day hassle-free returns
			</p>
		</div>

		<div class="grid grid-cols-1 gap-12 sm:grid-cols-3 lg:gap-16">
			{#each returnSteps as step, i}
				<div use:inView class="reveal-up" style="transition-delay: {i * 150}ms">
					<span class="mb-3 block font-serif text-3xl font-light text-foreground/20">
						{step.num}
					</span>
					<h3 class="mb-2 text-sm font-medium tracking-wide uppercase">{step.title}</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
				</div>
			{/each}
		</div>

		<div use:inView class="reveal-up mt-16 border border-border/30 p-8">
			<div class="flex items-start gap-4">
				<ShieldCheck class="mt-0.5 h-5 w-5 shrink-0 text-foreground/50" />
				<div>
					<h3 class="mb-2 font-serif text-lg font-light">Damaged or Defective Items</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">
						If your order arrives damaged or defective, contact us within 48 hours of delivery with
						photographs. We will arrange a free replacement or full refund — no returns needed.
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

<!-- CTA -->
<section data-navbar-dark class="border-t border-border/30 py-16 text-center">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div use:inView class="reveal-up">
			<p class="mb-2 font-serif text-xl font-light">Need help with an order?</p>
			<p class="mb-6 text-sm text-muted-foreground">We typically respond within a few hours.</p>
			<a
				href="/contact"
				class="inline-block border border-foreground px-8 py-3 text-xs tracking-wide transition-colors hover:bg-foreground hover:text-background"
			>
				Contact Us
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
