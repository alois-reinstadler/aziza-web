<script lang="ts">
	import { onMount } from 'svelte';

	import windowImg from '$lib/assets/hero-explore.webp';
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

	// Ring config: count, radius, direction, image scale
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
		const { default: Lenis } = await import('lenis');
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');

		gsap.registerPlugin(ScrollTrigger);

		// ── Lenis smooth scroll ──
		const lenis = new Lenis({ lerp: 0.07, wheelMultiplier: 1.2 });
		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		// ── Elements ──
		const section = document.querySelector<HTMLElement>('.ring-section')!;
		const assembly = document.querySelector<HTMLElement>('.ring-assembly')!;
		const ringEls = Array.from(document.querySelectorAll<HTMLElement>('.ring'));
		const allItems = Array.from(document.querySelectorAll<HTMLElement>('.ring-item'));
		const windowFrame = document.querySelector<HTMLElement>('.window-frame')!;
		const logoStrokes = Array.from(document.querySelectorAll<SVGPathElement>('.logo-stroke'));
		const logoFills = Array.from(document.querySelectorAll<SVGPathElement>('.logo-fill'));
		const subhero = document.querySelector<HTMLElement>('.ring-subhero')!;
		const vignette = document.querySelector<HTMLElement>('.ring-vignette')!;

		// ── Initial states ──
		gsap.set(logoStrokes, { strokeDasharray: 500, strokeDashoffset: 500 });
		gsap.set(logoFills, { opacity: 0 });
		gsap.set(subhero, { opacity: 0, y: 20 });

		// Items start hidden — only animate opacity (not scale/transform) to preserve CSS positioning
		const allImages = Array.from(document.querySelectorAll<HTMLElement>('.ring-item img'));
		gsap.set(allItems, { opacity: 0 });
		gsap.set(allImages, { scale: 0.6 });

		// ── Entrance animation (plays once when section enters) ──
		const entranceTl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top 80%',
				end: 'top 20%',
				scrub: 1
			}
		});

		// Items fade in with stagger across all rings
		ringEls.forEach((ringEl, ringIdx) => {
			const items = ringEl.querySelectorAll<HTMLElement>('.ring-item');
			const imgs = ringEl.querySelectorAll<HTMLElement>('.ring-item img');
			entranceTl.to(
				items,
				{
					opacity: 1,
					duration: 0.5,
					stagger: { each: 0.02, from: 'random' },
					ease: 'power2.out'
				},
				ringIdx * 0.08
			);
			entranceTl.to(
				imgs,
				{
					scale: 1,
					duration: 0.5,
					stagger: { each: 0.02, from: 'random' },
					ease: 'power2.out'
				},
				ringIdx * 0.08
			);
		});

		// ── Main scroll-driven timeline ──
		const mainTl = gsap.timeline({
			scrollTrigger: {
				trigger: section,
				start: 'top top',
				end: 'bottom bottom',
				scrub: 1.5
			}
		});

		// Rings rotate continuously — alternating directions, outer rings faster
		ringEls.forEach((el, i) => {
			const dir = i % 2 === 0 ? 1 : -1;
			const speed = 90 + i * 30; // inner slower, outer faster
			mainTl.to(
				el,
				{
					rotation: dir * speed,
					duration: 1,
					ease: 'none'
				},
				0
			);
		});

		// Assembly zooms in — slow start then accelerates (power2.in)
		mainTl.to(
			assembly,
			{
				scale: 5,
				duration: 1,
				ease: 'power2.in'
			},
			0
		);

		// Window frame scales up — you "look through" the transparent center
		mainTl.to(
			windowFrame,
			{
				scale: 8,
				duration: 0.4,
				ease: 'power2.in'
			},
			0
		);

		// Logo stroke draw — center first, then outward (staggered)
		mainTl.to(logoStrokes[0], { strokeDashoffset: 0, duration: 0.25, ease: 'power2.inOut' }, 0.05);
		mainTl.to(
			logoStrokes.slice(1),
			{
				strokeDashoffset: 0,
				duration: 0.3,
				stagger: 0.02,
				ease: 'power2.inOut'
			},
			0.12
		);

		// Logo fill paths fade in after strokes complete
		mainTl.to(
			logoFills,
			{
				opacity: 1,
				duration: 0.15,
				stagger: 0.02,
				ease: 'power1.out'
			},
			0.42
		);

		// Vignette fades out
		mainTl.to(
			vignette,
			{
				opacity: 0,
				duration: 0.3,
				ease: 'power1.in'
			},
			0.5
		);

		// Images dim as we zoom deeper
		mainTl.to(
			allItems,
			{
				opacity: 0.3,
				duration: 0.25,
				ease: 'none'
			},
			0.55
		);

		// Images fully gone
		mainTl.to(
			allItems,
			{
				opacity: 0,
				duration: 0.15,
				ease: 'none'
			},
			0.75
		);

		// ── Sub-hero section (separate from ring timeline) ──
		const subheroSection = document.querySelector<HTMLElement>('.subhero-section')!;

		gsap.to(subhero, {
			opacity: 1,
			y: 0,
			duration: 0.8,
			ease: 'power2.out',
			scrollTrigger: {
				trigger: subheroSection,
				start: 'top 60%',
				toggleActions: 'play none none reverse'
			}
		});

		cleanup = () => {
			lenis.destroy();
			gsap.killTweensOf('*');
			ScrollTrigger.getAll().forEach((st) => st.kill());
		};
	}
</script>

<svelte:head>
	<title>Aziza — Ring Scroll</title>
	<link rel="preload" as="image" href={windowImg} />
	{#each pool as src}
		<link rel="preload" as="image" href={src} />
	{/each}
</svelte:head>

<!-- Film grain (full page) -->
<div class="page-grain"></div>

<!-- Intro -->
<section class="intro" data-navbar-dark>
	<div class="intro-inner">
		<p class="intro-kicker">CSS Ring Demo</p>
		<h1>Scroll to<br />enter the ring</h1>
	</div>
</section>

<!-- Ring scroll section -->
<section class="ring-section" data-navbar-dark>
	<div class="ring-sticky">
		<!-- Window overlay — fades in from top, scales up to look through -->
		<div class="window-frame">
			<img src={windowImg} alt="" />
		</div>

		<!-- Vignette -->
		<div class="ring-vignette"></div>

		<!-- Rotating ring assembly -->
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

		<!-- Logo centered in viewport -->
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

					<!-- Stroke paths masked by logo silhouette -->
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

<!-- Sub-hero — separate full-height section so it has its own viewport space -->
<section class="subhero-section" data-navbar-dark>
	<div class="subhero-inner">
		<div class="ring-subhero">
			<p class="subhero-kicker">Spring 2025</p>
			<h2>Where Home<br />Becomes Haven</h2>
			<p class="subhero-sub">Textiles crafted for the spaces you love</p>
			<a href="/shop" class="subhero-btn">Shop the Collection</a>
		</div>
	</div>
</section>

<!-- Outro — black landing -->
<section class="outro" data-navbar-dark>
	<div class="outro-inner">
		<p class="outro-kicker">Continue scrolling</p>
		<h2>Explore the<br />Collection</h2>
		<a href="/shop" class="outro-btn">Shop Now</a>
	</div>
</section>

<style>
	* {
		box-sizing: border-box;
		margin: 0;
	}

	/* ── Intro ──────────────────────────────── */
	.intro {
		height: 100vh;
		background: #060608;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 12vh;
	}

	.intro-inner {
		text-align: center;
	}

	.intro-kicker {
		font-size: 0.7rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.35);
		margin-bottom: 16px;
	}

	.intro h1 {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(3rem, 8vw, 7rem);
		font-weight: 300;
		line-height: 1;
		color: white;
	}

	/* ── Ring section ──────────────────────── */
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

	/* ── Vignette ──────────────────────────── */
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

	/* ── Film grain (full page) ────────────── */
	.page-grain {
		position: fixed;
		inset: 0;
		z-index: 50;
		pointer-events: none;
		opacity: 0.035;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
		background-repeat: repeat;
		background-size: 180px;
	}

	/* ── Window frame overlay ─────────────── */
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

	/* ── Ring assembly ─────────────────────── */
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

	/* ── Ring items (images on the circle) ── */
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

	/* ── Center content container ─────────── */
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

	/* ── Logo SVG ─────────────────────────── */
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

	/* ── Sub-hero section ─────────────────── */
	.subhero-section {
		height: 50vh;
		margin-top: -25vh;
		position: relative;
		z-index: 1;
		background: #060608;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.subhero-inner {
		text-align: center;
		padding: 0 24px;
	}

	.ring-subhero {
		will-change: transform, opacity;
	}

	.subhero-kicker {
		font-size: 0.7rem;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
		margin-bottom: 14px;
	}

	.ring-subhero h2 {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(2.5rem, 6vw, 5.5rem);
		font-weight: 300;
		line-height: 1.05;
		color: white;
	}

	.subhero-sub {
		margin-top: 16px;
		font-size: clamp(0.9rem, 1.3vw, 1.05rem);
		color: rgba(255, 255, 255, 0.5);
		line-height: 1.5;
	}

	.subhero-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 28px;
		padding: 14px 40px;
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		color: #0a0a0c;
		background: white;
		pointer-events: all;
		transition: background 300ms ease;
	}

	.subhero-btn:hover {
		background: #f0ece4;
	}

	/* ── Outro ─────────────────────────────── */
	.outro {
		min-height: 100vh;
		background: #060608;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.outro-inner {
		text-align: center;
	}

	.outro-kicker {
		font-size: 0.7rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.35);
		margin-bottom: 16px;
	}

	.outro h2 {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(2.5rem, 6vw, 5rem);
		font-weight: 300;
		line-height: 1.05;
		color: white;
	}

	.outro-btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 32px;
		padding: 14px 40px;
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		color: #0a0a0c;
		background: white;
		transition: background 300ms ease;
	}

	.outro-btn:hover {
		background: #f0ece4;
	}

	/* ── Responsive ────────────────────────── */
	@media (max-width: 768px) {
		.ring-item {
			--img-w: calc(56px * var(--img-scale, 1)) !important;
			--img-h: calc(70px * var(--img-scale, 1)) !important;
			--radius: calc(var(--radius) * 0.55) !important;
		}
	}

	/* ── Reduced motion ────────────────────── */
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
