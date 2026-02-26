<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { splitChars } from './animations';
	import hero1 from '$lib/assets/hero-01.jpeg';
	import { scrollY } from 'svelte/reactivity/window';

	// Animation state
	let revealed = $state(false);
	let showText = $state(false);
	let showCta = $state(false);

	const titleTop = splitChars('SPRING');
	const titleBottom = splitChars('COLLECTION');

	$effect(() => {
		// Sequence: curtain (300ms) -> text (800ms) -> cta (1100ms)
		const t1 = setTimeout(() => (revealed = true), 300);
		const t2 = setTimeout(() => (showText = true), 800);
		const t3 = setTimeout(() => (showCta = true), 1100);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	});
</script>

<section data-navbar-dark class="relative h-screen w-full overflow-hidden">
	<!-- Curtain reveal via clip-path -->
	<div
		class="absolute inset-0 transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
		style="clip-path: inset({revealed ? '0%' : '0 50% 0 50%'})"
	>
		<img
			src={hero1}
			alt="Aziza Spring Collection"
			class="h-full w-full object-cover transition-transform duration-[2000ms] ease-out"
			style="transform: scale({revealed ? 1 : 1.6}) translateY({scrollY.current ?? 0 * 0.3}px)"
		/>
		<div class="absolute inset-0 bg-black/30"></div>
	</div>

	<!-- Issue label — top right -->
	<div
		class="absolute top-8 right-8 z-10 transition-opacity duration-700 lg:top-12 lg:right-12"
		style="opacity: {showText ? 1 : 0}"
	>
		<p class="text-xs tracking-[0.35em] text-white/50 uppercase">Issue 01 — Spring 2025</p>
	</div>

	<!-- Staggered headline — offset layout -->
	<div class="absolute inset-0 z-10 flex flex-col justify-between p-8 lg:p-16">
		<!-- "SPRING" top-left -->
		<div class="mt-24 lg:mt-32" style="transform: translateY({scrollY.current ?? 0 * -0.15}px)">
			<h1 class="font-serif text-[12vw] leading-[0.85] font-light text-white lg:text-[10vw]">
				{#each titleTop as { char, index }}
					<span
						class="inline-block transition-all duration-700 ease-out"
						style="
							opacity: {showText ? 1 : 0};
							transform: translateY({showText ? 0 : 40}px);
							transition-delay: {index * 60}ms;
						">{char}</span
					>
				{/each}
			</h1>
		</div>

		<!-- "COLLECTION" bottom-right + CTA bottom-left -->
		<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
			<!-- Subtext + CTA -->
			<div
				class="order-2 max-w-sm lg:order-1"
				style="opacity: {showCta ? 1 : 0}; transform: translateY({showCta
					? 0
					: 20}px); transition: all 700ms ease-out"
			>
				<p class="mb-6 text-sm leading-relaxed text-white/60 lg:text-base">
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

			<!-- "COLLECTION" bottom-right -->
			<div
				class="order-1 text-right lg:order-2"
				style="transform: translateY({scrollY.current ?? 0 * -0.1}px)"
			>
				<h1 class="font-serif text-[10vw] leading-[0.85] font-light text-white lg:text-[8vw]">
					{#each titleBottom as { char, index }}
						<span
							class="inline-block transition-all duration-700 ease-out"
							style="
								opacity: {showText ? 1 : 0};
								transform: translateY({showText ? 0 : 40}px);
								transition-delay: {(index + titleTop.length) * 50}ms;
							">{char}</span
						>
					{/each}
				</h1>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div
		class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-700"
		style="opacity: {showCta && (scrollY.current ?? 0) < 50 ? 0.5 : 0}"
	>
		<div class="h-12 w-px animate-pulse bg-white/40"></div>
	</div>
</section>
