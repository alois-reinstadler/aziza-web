<script lang="ts">
	// Animation states — triggered when section enters viewport
	let fillVisible = $state(false);
	let taglineVisible = $state(false);

	function onInView(node: HTMLElement) {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						node.classList.add('in-view');
						// Stage 2: fill fades in after stroke draw completes
						const t1 = setTimeout(() => (fillVisible = true), 1600);
						// Stage 3: tagline fades in
						const t2 = setTimeout(() => (taglineVisible = true), 2000);
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

	// Original fill paths from logo_regular.svg — used as mask
	const maskCenter = 'M119 0V66H125V0H119Z';
	const maskRight =
		'M208 0L244 66H242L212 11L195 66H133V64H180L133 0H187V2H145L187 59H189L206 0H208Z';
	const maskLeft = 'M36 0L0 66H2L32 11L49 66H111V64H64L111 0H57V2H99L57 59H55L38 0H36Z';
</script>

<section
	data-navbar-dark
	use:onInView
	class="flex flex-col items-center justify-center py-32 lg:py-48"
>
	<div class="relative w-full max-w-lg px-8 lg:max-w-xl">
		<svg
			viewBox="0 0 244 66"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			class="w-full overflow-visible"
			aria-label="Aziza logo"
		>
			<defs>
				<!-- Mask: original fill shapes define visible area -->
				<mask id="logo-mask">
					<rect width="244" height="66" fill="black" />
					<path d={maskCenter} fill="white" />
					<path d={maskRight} fill="white" />
					<path d={maskLeft} fill="white" />
				</mask>
				<clipPath id="logo-clip">
					<rect width="244" height="66" />
				</clipPath>
			</defs>

			<!-- Stroke paths masked by the logo silhouette -->
			<g mask="url(#logo-mask)" clip-path="url(#logo-clip)">
				<!-- Left side strokes -->
				<path d="M1 66L37 0" class="logo-stroke stroke-s1" />
				<path d="M33 1L52 62H60.5L108 -2.5" class="logo-stroke stroke-s2" stroke-width="10" />
				<path d="M50 65H111" class="logo-stroke stroke-s3" />
				<path d="M110 1H57" class="logo-stroke stroke-s4" />

				<!-- Center bar -->
				<path d="M122 66V0" class="logo-stroke stroke-s5" stroke-width="6" />

				<!-- Right side strokes -->
				<path d="M243 66L207 0" class="logo-stroke stroke-s6" />
				<path d="M211 1L192 62H183.5L136 -2.5" class="logo-stroke stroke-s7" stroke-width="10" />
				<path d="M194 65H133" class="logo-stroke stroke-s8" />
				<path d="M134 1H187" class="logo-stroke stroke-s9" />
			</g>

			<!-- Solid fill paths (fade in after stroke draw completes) -->
			<path
				d={maskCenter}
				fill="white"
				class="transition-opacity duration-700"
				style="opacity: {fillVisible ? 1 : 0}"
			/>
			<path
				d={maskRight}
				fill="white"
				class="transition-opacity duration-700"
				style="opacity: {fillVisible ? 1 : 0}; transition-delay: 100ms"
			/>
			<path
				d={maskLeft}
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
				Where Home Becomes Heaven
			</p>
		</div>
	</div>
</section>

<style>
	.logo-stroke {
		fill: none;
		stroke: white;
		stroke-width: 10;
		stroke-dasharray: 500;
		stroke-dashoffset: 500;
		stroke-linecap: round;
	}

	/* Staggered draw timing — center first, then outward */
	.stroke-s5 {
		animation: draw 1000ms cubic-bezier(0.4, 0, 0.2, 1) 100ms forwards;
	}
	/* Left side */
	.stroke-s1 {
		animation: draw 800ms cubic-bezier(0.4, 0, 0.2, 1) 400ms forwards;
	}
	.stroke-s2 {
		animation: draw 1200ms cubic-bezier(0.4, 0, 0.2, 1) 500ms forwards;
	}
	.stroke-s3 {
		animation: draw 600ms cubic-bezier(0.4, 0, 0.2, 1) 900ms forwards;
	}
	.stroke-s4 {
		animation: draw 600ms cubic-bezier(0.4, 0, 0.2, 1) 800ms forwards;
	}
	/* Right side */
	.stroke-s6 {
		animation: draw 800ms cubic-bezier(0.4, 0, 0.2, 1) 400ms forwards;
	}
	.stroke-s7 {
		animation: draw 1200ms cubic-bezier(0.4, 0, 0.2, 1) 500ms forwards;
	}
	.stroke-s8 {
		animation: draw 600ms cubic-bezier(0.4, 0, 0.2, 1) 900ms forwards;
	}
	.stroke-s9 {
		animation: draw 600ms cubic-bezier(0.4, 0, 0.2, 1) 800ms forwards;
	}

	@keyframes draw {
		to {
			stroke-dashoffset: 0;
		}
	}

	/* Pause all animations until section scrolls into view */
	section:not(:global(.in-view)) .logo-stroke {
		animation-play-state: paused;
	}
</style>
