<script lang="ts">
	import { collections } from '$lib/config/collections';
	import { inView } from '$lib/components/magazine/animations';
</script>

<svelte:head>
	<title>Collections — Aziza</title>
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Header -->
		<div class="reveal-up" use:inView>
			<span class="mb-4 block text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
				Collections
			</span>
			<h1 class="mb-4 font-serif text-4xl font-light lg:text-5xl">Our Collections</h1>
			<p class="mb-16 max-w-lg text-muted-foreground">
				Each collection tells its own story — crafted from the finest natural materials and inspired
				by the beauty of the botanical world.
			</p>
		</div>

		<!-- Grid -->
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
			{#each collections as col, i}
				<div class="reveal-up" use:inView style="transition-delay: {i * 120}ms">
					<a href={col.href} class="group block">
						<div class="mb-4 overflow-hidden">
							<img
								src={col.images.hero}
								alt={col.label}
								class="aspect-4/5 w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>
						{#if col.tag}
							<span class="text-xs tracking-[0.2em] text-muted-foreground uppercase">{col.tag}</span
							>
						{/if}
						<h2 class="mt-1 font-serif text-2xl font-light lg:text-3xl">{col.label}</h2>
						<p class="mt-2 text-sm text-muted-foreground">{col.description}</p>
					</a>
				</div>
			{/each}
		</div>
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
