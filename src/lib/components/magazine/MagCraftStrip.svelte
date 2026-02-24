<script lang="ts">
	import { Leaf, Sparkles, Clock } from '@lucide/svelte';
	import { scrollProgress } from './animations';
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

<section data-navbar-dark class="relative overflow-hidden py-24 lg:py-0">
	<!-- Desktop: scroll-driven horizontal strip -->
	<div class="hidden lg:block">
		<div use:scrollProgress class="relative h-[300vh]">
			<div class="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
				<div class="mb-12 px-16">
					<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
						Our Values
					</p>
					<h2 class="font-serif text-4xl font-light lg:text-5xl">The Aziza Craft</h2>
				</div>

				<div
					class="flex gap-8 px-16 transition-transform duration-100 ease-linear"
					style="transform: translateX(calc(-1 * var(--scroll-progress, 0) * 60%))"
				>
					{#each values as value, i (value.title)}
						{@const Icon = value.icon}
						<div
							class="flex w-[500px] shrink-0 items-start gap-8 rounded-none border border-border/30 p-10"
						>
							<div class="flex h-16 w-16 shrink-0 items-center justify-center border border-border">
								<Icon class="h-6 w-6 text-foreground/50" />
							</div>
							<div>
								<h3 class="mb-3 font-serif text-2xl font-light">{value.title}</h3>
								<p class="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile: vertical stack -->
	<div class="lg:hidden">
		<div class="mx-auto max-w-7xl px-6">
			<div class="mb-12">
				<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
					Our Values
				</p>
				<h2 class="font-serif text-3xl font-light">The Aziza Craft</h2>
			</div>

			<div class="space-y-8">
				{#each values as value (value.title)}
					{@const Icon = value.icon}
					<div class="flex items-start gap-6 border border-border/30 p-6">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border">
							<Icon class="h-5 w-5 text-foreground/50" />
						</div>
						<div>
							<h3 class="mb-2 font-serif text-xl font-light">{value.title}</h3>
							<p class="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
