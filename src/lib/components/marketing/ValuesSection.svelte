<script lang="ts">
	import { Leaf, Sparkles, Clock } from '@lucide/svelte';
	import type { Component } from 'svelte';

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
		}
	];
</script>

<section data-navbar-dark class="py-20 lg:py-28">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-16 text-center">
			<p class="mb-3 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
				The Aziza Difference
			</p>
			<h2 class="font-serif text-3xl font-light lg:text-4xl">Why we do things differently</h2>
		</div>

		<div class="grid grid-cols-1 gap-12 md:grid-cols-3 md:gap-8 lg:gap-16">
			{#each values as value (value.title)}
				{@const Icon = value.icon}
				<div class="text-center">
					<div class="mb-6 inline-flex h-11 w-11 items-center justify-center border border-border">
						<Icon class="h-[18px] w-[18px] text-foreground/50" />
					</div>
					<h3 class="mb-3 font-serif text-xl font-light">{value.title}</h3>
					<p class="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
				</div>
			{/each}
		</div>
	</div>
</section>
