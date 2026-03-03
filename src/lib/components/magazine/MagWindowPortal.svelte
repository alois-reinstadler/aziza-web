<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import heroExplore from '$lib/assets/look-through.webp';
	import heroBg from '$lib/assets/hero-01.jpeg';

	let scrollContainer: HTMLElement | undefined = $state();
	let progress = $state(0);

	const MAX_SCALE = 12;

	$effect(() => {
		const el = scrollContainer;
		if (!el) return;

		function onScroll() {
			const rect = el!.getBoundingClientRect();
			const totalScroll = rect.height - window.innerHeight;
			if (totalScroll <= 0) return;
			const rawProgress = Math.max(0, -rect.top) / totalScroll;
			progress = Math.min(1, Math.max(0, rawProgress));
		}

		window.addEventListener('scroll', onScroll, { passive: true });
		onScroll();

		return () => window.removeEventListener('scroll', onScroll);
	});

	let scale = $derived(1 + progress * (MAX_SCALE - 1));
	let bgScale = $derived(1 + (1 - progress) * 0.08);
	let ctaOpacity = $derived(Math.min(1, Math.max(0, (progress - 0.8) / 0.2)));
</script>

<!-- Tall container — extra height gives scroll distance for the zoom -->
<section bind:this={scrollContainer} class="relative h-[300vh]" data-navbar-dark>
	<!-- Sticky viewport pinned while we scroll through -->
	<div class="sticky top-0 h-screen w-full overflow-hidden">
		<!-- Background: hero image revealed through the portal -->
		<div class="absolute inset-0">
			<img
				src={heroBg}
				alt="Aziza collection interior"
				class="h-full w-full object-cover"
				style="transform: scale({bgScale})"
			/>
			<div class="absolute inset-0 bg-black/20" style="opacity: {1 - progress * 0.5}"></div>
		</div>

		<!-- CTA — fades in when zoomed through the window -->
		<div
			class="absolute inset-0 z-10 flex flex-col items-center justify-center"
			style="opacity: {ctaOpacity}; transform: translateY({(1 - ctaOpacity) * 30}px)"
		>
			<p class="mb-2 text-xs tracking-[0.35em] text-white/60 uppercase">Explore</p>
			<h2
				class="mb-6 text-center font-serif text-5xl font-light tracking-wide text-white md:text-7xl"
			>
				New Collection
			</h2>
			<Button
				href="/shop"
				size="lg"
				class="rounded-none bg-white px-12 text-sm tracking-wide text-black hover:bg-stone-100"
			>
				Shop Now
			</Button>
		</div>

		<!-- Foreground: window frame scales up on scroll -->
		<div
			class="pointer-events-none absolute inset-0 z-20"
			style="transform: scale({scale}); will-change: transform"
		>
			<img src={heroExplore} alt="" aria-hidden="true" class="h-full w-full object-cover" />
		</div>
	</div>
</section>
