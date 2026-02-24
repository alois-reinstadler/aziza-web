<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import hero1 from '$lib/assets/hero-01.jpeg';
	import hero2 from '$lib/assets/hero-02.jpeg';
	import hero3 from '$lib/assets/hero-03.jpeg';

	const slides = [
		{ image: hero1, alt: 'Warm living room with Aziza textiles' },
		{ image: hero2, alt: 'Bright Scandinavian interior with Aziza cushions' },
		{ image: hero3, alt: 'Cozy natural living room with Aziza throws' }
	];

	let current = $state(0);

	$effect(() => {
		const interval = setInterval(() => {
			current = (current + 1) % slides.length;
		}, 5000);
		return () => clearInterval(interval);
	});
</script>

<section data-navbar-dark class="relative flex min-h-screen items-end overflow-hidden pb-20 lg:pb-28">
	{#each slides as slide, i (i)}
		<div
			class="absolute inset-0 transition-opacity duration-1000 ease-in-out"
			style="opacity: {i === current ? 1 : 0}"
			aria-hidden={i !== current}
		>
			<img src={slide.image} alt={slide.alt} class="h-full w-full object-cover" />
		</div>
	{/each}

	<div class="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent"></div>
	<div class="absolute inset-0 bg-gradient-to-r from-black/35 to-transparent"></div>

	<div class="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8">
		<p class="mb-5 text-xs font-medium tracking-[0.3em] text-white/55 uppercase">
			Spring Collection 2025
		</p>
		<h1
			class="mb-6 max-w-2xl font-serif text-5xl leading-[1.05] font-light text-white sm:text-6xl lg:text-7xl xl:text-8xl"
		>
			Where Home<br />Becomes<br />Haven
		</h1>
		<p class="mb-10 max-w-md text-base leading-relaxed text-white/70 sm:text-lg">
			Thoughtfully crafted textiles that transform everyday living into something extraordinary.
		</p>
		<div class="flex flex-wrap gap-4">
			<Button
				href="/collections"
				size="lg"
				class="rounded-none bg-white px-10 text-sm tracking-wide text-black hover:bg-stone-100"
			>
				Shop Collections
			</Button>
			<Button
				href="/about"
				variant="ghost"
				size="lg"
				class="rounded-none border border-white/40 px-10 text-sm tracking-wide text-white hover:bg-white/10 hover:text-white"
			>
				Our Story
			</Button>
		</div>
	</div>

	<div class="absolute right-8 bottom-8 z-10 flex items-center gap-3">
		{#each slides as _, i (i)}
			<button
				onclick={() => (current = i)}
				aria-label="Go to slide {i + 1}"
				class="block origin-center transition-all duration-300 {i === current
					? 'h-px w-8 bg-white'
					: 'h-px w-4 bg-white/40 hover:bg-white/70'}"
			></button>
		{/each}
	</div>
</section>
