<script lang="ts">
	import { inView } from './animations';

	import imgCraft from '$lib/assets/lookbook/curtains-light.jpg';
	import imgDetail from '$lib/assets/lookbook/botanical-shelf.jpg';

	const values = [
		{ num: '01', title: 'Natural Fibres', description: 'Organic cotton, Belgian linen, and responsibly sourced materials — gentle on you and the planet.' },
		{ num: '02', title: 'Botanical Craft', description: 'Each pattern is hand-drawn, each piece woven with care. Details you live with should always be beautiful.' },
		{ num: '03', title: 'Made to Last', description: 'We design against the throwaway. Our textiles are built to become heirlooms, not seasonal casualties.' },
		{ num: '04', title: 'Quiet Luxury', description: 'No logos, no noise. Just exceptional quality you can feel the moment you touch it.' },
		{ num: '05', title: 'Considered Design', description: 'Every colour, texture and proportion is deliberated. We design for the room, not the shelf.' }
	];
</script>

<section class="bg-background py-24 lg:py-36">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Header -->
		<div use:inView class="reveal-up mb-20 lg:mb-28">
			<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase">Our Values</p>
			<h2 class="max-w-md font-serif text-4xl font-light lg:text-5xl">The Aziza Craft</h2>
		</div>

		<!-- Image + first 3 values -->
		<div class="mb-20 grid grid-cols-1 gap-12 lg:mb-28 lg:grid-cols-2 lg:gap-20">
			<div use:inView class="reveal-up overflow-hidden">
				<img src={imgCraft} alt="Artisan textile" class="aspect-[3/4] w-full object-cover" />
			</div>
			<div class="flex flex-col justify-center gap-12 lg:gap-16">
				{#each values.slice(0, 3) as value, i (value.num)}
					<div use:inView class="reveal-up" style="transition-delay: {i * 100}ms">
						<span class="mb-2 block font-serif text-sm text-muted-foreground/40">{value.num}</span>
						<h3 class="mb-2 font-serif text-xl font-light lg:text-2xl">{value.title}</h3>
						<p class="max-w-sm text-sm leading-relaxed text-muted-foreground">{value.description}</p>
					</div>
				{/each}
			</div>
		</div>

		<!-- Last 2 values + image -->
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-20">
			<div class="flex flex-col justify-center gap-12 lg:gap-16 lg:order-1 order-2">
				{#each values.slice(3) as value, i (value.num)}
					<div use:inView class="reveal-up" style="transition-delay: {i * 100}ms">
						<span class="mb-2 block font-serif text-sm text-muted-foreground/40">{value.num}</span>
						<h3 class="mb-2 font-serif text-xl font-light lg:text-2xl">{value.title}</h3>
						<p class="max-w-sm text-sm leading-relaxed text-muted-foreground">{value.description}</p>
					</div>
				{/each}
			</div>
			<div use:inView class="reveal-up overflow-hidden lg:order-2 order-1">
				<img src={imgDetail} alt="Textile detail" class="aspect-[3/4] w-full object-cover" />
			</div>
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
