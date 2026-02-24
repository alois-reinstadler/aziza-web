<script lang="ts">
	// Animation states — triggered when section enters viewport
	let fillVisible = $state(false);
	let taglineVisible = $state(false);

	function onInView(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						// Add class to unpause CSS stroke-draw animations
						node.classList.add('in-view');
						// Stage 2: fill fades in after stroke draw completes (~1600ms)
						const t1 = setTimeout(() => (fillVisible = true), 1800);
						// Stage 3: tagline fades in
						const t2 = setTimeout(() => (taglineVisible = true), 2400);
						observer.unobserve(node);

						return () => {
							clearTimeout(t1);
							clearTimeout(t2);
						};
					}
				}
			},
			{ threshold: 0.4 }
		);
		observer.observe(node);
		return {
			destroy() {
				observer.disconnect();
			}
		};
	}

	// Logo path data from logo_regular.svg
	const centerBar = 'M119 0V66H125V0H119Z';
	const rightSide =
		'M208 0L244 66H242L212 11L195 66H133V64H180L133 0H187V2H145L187 59H189L206 0H208Z';
	const leftSide = 'M36 0L0 66H2L32 11L49 66H111V64H64L111 0H57V2H99L57 59H55L38 0H36Z';
</script>

<section
	data-navbar-dark
	use:onInView
	class="flex min-h-screen flex-col items-center justify-center bg-black"
>
	<div class="relative w-full max-w-lg px-8 lg:max-w-xl">
		<!-- SVG with stroke-draw animation -->
		<svg
			viewBox="0 0 244 66"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="w-full"
			aria-label="Aziza logo"
		>
			<!-- Stroke-draw paths (visible during draw phase, fade out when fill appears) -->
			<path
				d={centerBar}
				class="logo-stroke stroke-center transition-opacity duration-500"
				style="opacity: {fillVisible ? 0 : 1}"
			/>
			<path
				d={rightSide}
				class="logo-stroke stroke-right transition-opacity duration-500"
				style="opacity: {fillVisible ? 0 : 1}"
			/>
			<path
				d={leftSide}
				class="logo-stroke stroke-left transition-opacity duration-500"
				style="opacity: {fillVisible ? 0 : 1}"
			/>

			<!-- Fill paths (fade in after stroke completes) -->
			<path
				d={centerBar}
				fill="white"
				class="transition-opacity duration-700"
				style="opacity: {fillVisible ? 1 : 0}"
			/>
			<path
				d={rightSide}
				fill="white"
				class="transition-opacity duration-700"
				style="opacity: {fillVisible ? 1 : 0}; transition-delay: 100ms"
			/>
			<path
				d={leftSide}
				fill="white"
				class="transition-opacity duration-700"
				style="opacity: {fillVisible ? 1 : 0}; transition-delay: 200ms"
			/>
		</svg>

		<!-- Tagline -->
		<div
			class="mt-10 text-center transition-all duration-700 ease-out"
			style="opacity: {taglineVisible ? 1 : 0}; transform: translateY({taglineVisible ? 0 : 15}px)"
		>
			<p class="font-serif text-lg font-light tracking-[0.15em] text-white/70 lg:text-xl">
				Where Home Becomes Haven
			</p>
		</div>
	</div>
</section>

<style>
	.logo-stroke {
		fill: none;
		stroke: white;
		stroke-width: 0.8;
		stroke-dasharray: 1000;
		stroke-dashoffset: 1000;
		stroke-linejoin: miter;
	}

	/* Staggered draw: center first, then sides */
	.stroke-center {
		animation: draw 1200ms cubic-bezier(0.4, 0, 0.2, 1) 200ms forwards;
	}
	.stroke-left {
		animation: draw 1400ms cubic-bezier(0.4, 0, 0.2, 1) 400ms forwards;
	}
	.stroke-right {
		animation: draw 1400ms cubic-bezier(0.4, 0, 0.2, 1) 600ms forwards;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	/* Pause animations until section scrolls into view */
	section:not(:global(.in-view)) .logo-stroke {
		animation-play-state: paused;
	}
</style>
