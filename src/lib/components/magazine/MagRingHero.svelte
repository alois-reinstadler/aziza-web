<script lang="ts">
	import { onMount } from 'svelte';

	import windowImg from '$lib/assets/window.webp';
	import img01 from '$lib/assets/lookbook/breakfast-table.jpg';
	import img02 from '$lib/assets/lookbook/living-room-throws.jpg';
	import img03 from '$lib/assets/lookbook/bedroom-linen.jpg';
	import img04 from '$lib/assets/lookbook/curtains-light.jpg';
	import img05 from '$lib/assets/lookbook/dining-setting.jpg';
	import img06 from '$lib/assets/lookbook/cozy-corner.jpg';
	import img07 from '$lib/assets/lookbook/botanical-shelf.jpg';
	import img08 from '$lib/assets/lookbook/terrace-textiles.jpg';
	import img09 from '$lib/assets/lookbook/lookbook-cta.jpg';
	import img10 from '$lib/assets/collections/collection-01-xl.jpg';
	import img11 from '$lib/assets/collections/collection-02-xl.jpg';
	import img12 from '$lib/assets/collections/collection-03-xl.jpg';

	const pool = [img01, img02, img03, img04, img05, img06, img07, img08, img09, img10, img11, img12];

	const ringConfigs = [
		{ count: 10, radius: 220, dir: 1, imgScale: 0.7 },
		{ count: 16, radius: 380, dir: -1, imgScale: 0.85 },
		{ count: 22, radius: 560, dir: 1, imgScale: 1.0 }
	];

	type RingData = {
		items: { src: string; angle: number }[];
		radius: number;
		dir: 1 | -1;
		imgScale: number;
	};

	const rings: RingData[] = ringConfigs.map((cfg) => ({
		items: Array.from({ length: cfg.count }, (_, i) => ({
			src: pool[i % pool.length],
			angle: (360 / cfg.count) * i
		})),
		radius: cfg.radius,
		dir: cfg.dir as 1 | -1,
		imgScale: cfg.imgScale
	}));

	let cleanup: (() => void) | undefined;

	onMount(() => {
		init();
		return () => cleanup?.();
	});

	async function init() {
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const section = document.querySelector<HTMLElement>('.ring-section')!;
		const assembly = document.querySelector<HTMLElement>('.ring-assembly')!;
		const ringEls = Array.from(document.querySelectorAll<HTMLElement>('.ring'));
		const allItems = Array.from(document.querySelectorAll<HTMLElement>('.ring-item'));
		const windowFrame = document.querySelector<HTMLElement>('.window-frame')!;
		const logoStrokes = Array.from(document.querySelectorAll<SVGPathElement>('.logo-stroke'));
		const logoFills = Array.from(document.querySelectorAll<SVGPathElement>('.logo-fill'));
		const vignette = document.querySelector<HTMLElement>('.ring-vignette')!;
		const introOverlay = document.querySelector<HTMLElement>('.intro-overlay')!;
		const ringCenter = document.querySelector<HTMLElement>('.ring-center')!;

		gsap.set(logoStrokes, { strokeDasharray: 500, strokeDashoffset: 500 });
		gsap.set(logoFills, { opacity: 0 });

		const allImages = Array.from(document.querySelectorAll<HTMLElement>('.ring-item img'));
		gsap.set(allItems, { opacity: 0 });
		gsap.set(allImages, { scale: 0.6 });

		// Entrance
		const entranceTl = gsap.timeline({
			scrollTrigger: { trigger: section, start: 'top 80%', end: 'top 20%', scrub: 1 }
		});

		ringEls.forEach((ringEl, ringIdx) => {
			const items = ringEl.querySelectorAll<HTMLElement>('.ring-item');
			const imgs = ringEl.querySelectorAll<HTMLElement>('.ring-item img');
			entranceTl.to(
				items,
				{ opacity: 1, duration: 0.5, stagger: { each: 0.02, from: 'random' }, ease: 'power2.out' },
				ringIdx * 0.08
			);
			entranceTl.to(
				imgs,
				{ scale: 1, duration: 0.5, stagger: { each: 0.02, from: 'random' }, ease: 'power2.out' },
				ringIdx * 0.08
			);
		});

		// Main scroll timeline — starts slightly before pin so the transition feels gradual
		const mainTl = gsap.timeline({
			scrollTrigger: { trigger: section, start: 'top 10%', end: 'bottom bottom', scrub: 2 }
		});

		// Dead zone: first 5% of scroll nothing happens — cushions the sticky lock
		mainTl.to({}, { duration: 0.05 }, 0);

		ringEls.forEach((el, i) => {
			const dir = i % 2 === 0 ? 1 : -1;
			const speed = 90 + i * 30;
			mainTl.to(el, { rotation: dir * speed, duration: 1, ease: 'none' }, 0.05);
		});

		// Intro scales up with the window frame
		mainTl.to(introOverlay, { scale: 8, duration: 0.4, ease: 'power3.in' }, 0.05);

		mainTl.to(assembly, { scale: 5, duration: 1, ease: 'power3.in' }, 0.05);
		mainTl.to(windowFrame, { scale: 8, duration: 0.4, ease: 'power3.in' }, 0.05);

		mainTl.to(logoStrokes[0], { strokeDashoffset: 0, duration: 0.25, ease: 'power2.inOut' }, 0.05);
		mainTl.to(
			logoStrokes.slice(1),
			{ strokeDashoffset: 0, duration: 0.3, stagger: 0.02, ease: 'power2.inOut' },
			0.12
		);
		mainTl.to(logoFills, { opacity: 1, duration: 0.15, stagger: 0.02, ease: 'power1.out' }, 0.42);
		mainTl.to(vignette, { opacity: 0, duration: 0.3, ease: 'power1.in' }, 0.5);
		mainTl.to(allItems, { opacity: 0.3, duration: 0.25, ease: 'none' }, 0.55);
		mainTl.to(allItems, { opacity: 0, duration: 0.15, ease: 'none' }, 0.75);
		mainTl.to(ringCenter, { opacity: 0, duration: 0.15, ease: 'none' }, 0.75);

		cleanup = () => {
			gsap.killTweensOf('*');
			ScrollTrigger.getAll().forEach((st) => st.kill());
		};
	}
</script>

<svelte:head>
	<link rel="preload" as="image" href={windowImg} />
	{#each pool as src}
		<link rel="preload" as="image" href={src} />
	{/each}
</svelte:head>

<!-- Ring scroll section -->
<section class="ring-section" data-navbar-dark>
	<div class="ring-sticky">
		<div class="intro-overlay">
			<div class="intro-top-left">
				<p class="intro-small">Where</p>
				<h1 class="intro-big">Home</h1>
			</div>
			<div class="intro-bottom-right">
				<p class="intro-small">Becomes</p>
				<h1 class="intro-big">Haven</h1>
			</div>
			<div class="scroll-cue">
				<span></span>
			</div>
		</div>
		<div class="window-frame">
			<img src={windowImg} alt="" />
		</div>
		<div class="ring-vignette"></div>
		<div class="ring-assembly">
			{#each rings as ring, ringIdx (ringIdx)}
				<div class="ring" data-ring={ringIdx}>
					{#each ring.items as item, itemIdx (itemIdx)}
						<div
							class="ring-item"
							style="
								--angle: {item.angle}deg;
								--radius: {ring.radius}px;
								--img-w: {80 * ring.imgScale}px;
								--img-h: {100 * ring.imgScale}px;
							"
						>
							<img src={item.src} alt="" />
						</div>
					{/each}
				</div>
			{/each}
		</div>
		<div class="ring-center">
			<div class="ring-logo">
				<svg viewBox="0 0 244 66" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Aziza">
					<defs>
						<mask id="logo-mask">
							<rect width="244" height="66" fill="black" />
							<path d="M119 0V66H125V0H119Z" fill="white" />
							<path
								d="M208 0L244 66H242L212 11L195 66H133V64H180L133 0H187V2H145L187 59H189L206 0H208Z"
								fill="white"
							/>
							<path
								d="M36 0L0 66H2L32 11L49 66H111V64H64L111 0H57V2H99L57 59H55L38 0H36Z"
								fill="white"
							/>
						</mask>
						<clipPath id="logo-clip">
							<rect width="244" height="66" />
						</clipPath>
					</defs>
					<g mask="url(#logo-mask)" clip-path="url(#logo-clip)">
						<path d="M122 66V0" class="logo-stroke" stroke-width="6" />
						<path d="M1 66L37 0" class="logo-stroke" />
						<path d="M33 1L52 62H60.5L108 -2.5" class="logo-stroke" stroke-width="10" />
						<path d="M110 1H57" class="logo-stroke" />
						<path d="M50 65H111" class="logo-stroke" />
						<path d="M243 66L207 0" class="logo-stroke" />
						<path d="M211 1L192 62H183.5L136 -2.5" class="logo-stroke" stroke-width="10" />
						<path d="M134 1H187" class="logo-stroke" />
						<path d="M194 65H133" class="logo-stroke" />
					</g>
					<path d="M119 0V66H125V0H119Z" fill="white" class="logo-fill" />
					<path
						d="M208 0L244 66H242L212 11L195 66H133V64H180L133 0H187V2H145L187 59H189L206 0H208Z"
						fill="white"
						class="logo-fill"
					/>
					<path
						d="M36 0L0 66H2L32 11L49 66H111V64H64L111 0H57V2H99L57 59H55L38 0H36Z"
						fill="white"
						class="logo-fill"
					/>
				</svg>
			</div>
		</div>
	</div>
</section>

<style>
	* {
		box-sizing: border-box;
		margin: 0;
	}

	.intro-overlay {
		position: absolute;
		inset: 0;
		z-index: 25;
		pointer-events: none;
		will-change: transform, opacity;
	}

	.intro-small {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(1rem, 2.5vw, 2rem);
		font-weight: 300;
		color: rgba(255, 255, 255, 0.5);
		letter-spacing: 0.05em;
		line-height: 1;
		margin-bottom: 0.15em;
	}

	.intro-big {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(4rem, 14vw, 12rem);
		font-weight: 300;
		line-height: 0.85;
		color: white;
		letter-spacing: -0.03em;
	}

	.intro-top-left {
		position: absolute;
		top: 12vh;
		left: clamp(1.5rem, 6vw, 6rem);
	}

	.intro-bottom-right {
		position: absolute;
		bottom: 12vh;
		right: clamp(1.5rem, 6vw, 6rem);
		text-align: right;
	}

	.scroll-cue {
		position: absolute;
		bottom: 3rem;
		left: 50%;
		transform: translateX(-50%);
		width: 1px;
		height: 48px;
		overflow: hidden;
	}

	.scroll-cue span {
		display: block;
		width: 1px;
		height: 100%;
		background: rgba(255, 255, 255, 0.3);
		animation: scroll-line 2s ease-in-out infinite;
	}

	@keyframes scroll-line {
		0% {
			transform: translateY(-100%);
		}
		50% {
			transform: translateY(0);
		}
		100% {
			transform: translateY(100%);
		}
	}

	.ring-section {
		height: 500vh;
		position: relative;
		background: #060608;
	}

	.ring-sticky {
		position: sticky;
		top: 0;
		height: 100vh;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #060608;
	}

	.ring-vignette {
		position: absolute;
		inset: 0;
		z-index: 10;
		pointer-events: none;
		background: radial-gradient(
			ellipse at center,
			transparent 15%,
			rgba(6, 6, 8, 0.5) 45%,
			rgba(6, 6, 8, 0.92) 75%
		);
	}

	.window-frame {
		position: absolute;
		inset: 0;
		z-index: 15;
		display: flex;
		align-items: center;
		justify-content: center;
		pointer-events: none;
		will-change: transform, opacity;
	}

	.window-frame img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	.ring-assembly {
		position: absolute;
		top: 50%;
		left: 50%;
		width: 0;
		height: 0;
		transform: translate(0, 0) scale(1);
		will-change: transform;
	}

	.ring {
		position: absolute;
		top: 0;
		left: 0;
		width: 0;
		height: 0;
		will-change: transform;
	}

	.ring-item {
		position: absolute;
		width: var(--img-w);
		height: var(--img-h);
		margin-left: calc(var(--img-w) / -2);
		margin-top: calc(var(--img-h) / -2);
		transform: rotate(var(--angle)) translateX(var(--radius)) rotate(-90deg);
		overflow: hidden;
		border-radius: 3px;
		will-change: transform, opacity;
	}

	.ring-item img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
		filter: brightness(0.65) saturate(0.8);
	}

	.ring-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		z-index: 20;
		display: flex;
		flex-direction: column;
		align-items: center;
		pointer-events: none;
	}

	.ring-logo {
		width: clamp(120px, 18vw, 280px);
	}

	.ring-logo svg {
		width: 100%;
		height: auto;
		overflow: visible;
	}

	.logo-stroke {
		fill: none;
		stroke: white;
		stroke-width: 10;
		stroke-linecap: round;
	}

	@media (max-width: 768px) {
		.ring-item {
			--img-w: calc(56px * var(--img-scale, 1)) !important;
			--img-h: calc(70px * var(--img-scale, 1)) !important;
			--radius: calc(var(--radius) * 0.55) !important;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.ring-section {
			height: auto;
		}

		.ring-sticky {
			position: relative;
			height: 100vh;
		}

		.ring-item {
			opacity: 1 !important;
		}
	}
</style>
