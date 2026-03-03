<script lang="ts">
	import imgFloral from '$lib/assets/collections/collection-03-xl.jpg';
	import imgIvory from '$lib/assets/collections/collection-02-xl.jpg';
	import imgBloom from '$lib/assets/collections/collection-01-xl.jpg';
	import imgAtelier from '$lib/assets/collections/collection-04-xl.jpg';
	import imgCraft from '$lib/assets/placeholder/craft-01.jpg';
	import imgLifestyle from '$lib/assets/placeholder/lifestyle-01.jpg';
	import imgStory from '$lib/assets/placeholder/story-01.jpg';
	import { innerWidth, innerHeight } from 'svelte/reactivity/window';

	/* ── helpers ──────────────────────────────────────── */
	function clamp(v: number, min: number, max: number) {
		return Math.min(Math.max(v, min), max);
	}

	/**
	 * Svelte action: maps 0→1 across the sticky travel
	 * (the scroll distance while an element is pinned).
	 */
	function stickyProgress(node: HTMLElement, cssVar = '--p') {
		let raf = 0;
		const update = () => {
			raf = 0;
			const rect = node.getBoundingClientRect();
			const vh = window.innerHeight || 1;
			const travel = Math.max(rect.height - vh, 1);
			const p = clamp(-rect.top / travel, 0, 1);
			node.style.setProperty(cssVar, p.toFixed(4));
		};
		const schedule = () => {
			if (!raf) raf = requestAnimationFrame(update);
		};
		update();
		window.addEventListener('scroll', schedule, { passive: true });
		window.addEventListener('resize', schedule, { passive: true });
		return {
			destroy() {
				if (raf) cancelAnimationFrame(raf);
				window.removeEventListener('scroll', schedule);
				window.removeEventListener('resize', schedule);
			}
		};
	}

	/** Svelte action: adds `in-view` class when element enters viewport */
	function inView(node: HTMLElement, opts: { threshold?: number; once?: boolean } = {}) {
		const { threshold = 0.15, once = true } = opts;
		const io = new IntersectionObserver(
			(entries) => {
				for (const e of entries) {
					if (e.isIntersecting) {
						node.classList.add('in-view');
						if (once) io.unobserve(node);
					} else if (!once) {
						node.classList.remove('in-view');
					}
				}
			},
			{ threshold }
		);
		io.observe(node);
		return { destroy: () => io.disconnect() };
	}

	/* ── logo zoom — compute exact scale to fill viewport ── */
	const logoMaxScale = $derived.by(() => {
		const vw = innerWidth.current ?? 1440;
		const vh = innerHeight.current ?? 900;
		// .logo-wrap: max-width 520px, padding 0 32px (border-box)
		const svgW = Math.min(520, vw) - 64;
		// The "I" bar = 6 / 244 of SVG width
		const iW = (6 / 244) * svgW;
		const iH = (66 / 244) * svgW;
		return Math.ceil(Math.max(vw / iW, vh / iH) * 1.15);
	});

	/* ── data ─────────────────────────────────────────── */
	const collections = [
		{
			kicker: 'Collection 01',
			title: 'Ivory\nBotanica',
			copy: 'Soft neutrals and delicate botanical prints that bring warmth to any room.',
			image: imgIvory
		},
		{
			kicker: 'Collection 02',
			title: 'Floral\nHeritage',
			copy: 'Rich painterly florals rooted in textile tradition, reimagined for modern living.',
			image: imgFloral
		},
		{
			kicker: 'Collection 03',
			title: 'Garden\nBloom',
			copy: 'Lush garden-inspired motifs that feel alive with color and movement.',
			image: imgBloom
		},
		{
			kicker: 'Collection 04',
			title: 'Atelier\nWeave',
			copy: 'Hand-drawn patterns translated into woven textures with artisan detail.',
			image: imgAtelier
		}
	];

	const features = [
		{
			kicker: '01 — Natural Fibers',
			title: 'Chosen for drape,\nnot just softness',
			copy: 'We test hand-feel, crease behavior, and light response before anything reaches production.',
			image: imgIvory
		},
		{
			kicker: '02 — Painterly Motifs',
			title: 'Botanical patterns\ntranslated into weave',
			copy: 'Our repeats are designed to feel irregular from a distance and detailed up close.',
			image: imgAtelier
		},
		{
			kicker: '03 — Soft Finish',
			title: 'Gets better\nwith every wash',
			copy: 'We bias toward finishes that age well with washing and daily use.',
			image: imgCraft
		},
		{
			kicker: '04 — Considered Color',
			title: 'Tested in\nnatural light',
			copy: 'Every colorway is evaluated across daylight conditions before it enters production.',
			image: imgLifestyle
		}
	];

	/* ── lerp for smooth interpolation ───────────────── */
	function lerp(start: number, end: number, factor: number) {
		return start * (1 - factor) + end * factor;
	}

	/**
	 * Codrops-style horizontal parallax gallery.
	 * - Uses lerp to smoothly ease the track position (buttery momentum).
	 * - Each card image gets a per-element parallax offset based on its
	 *   distance from the viewport center.
	 */
	function hScroll(node: HTMLElement) {
		const track = node.querySelector<HTMLElement>('.hscroll-track');
		if (!track) return { destroy() {} };

		const el = track; // non-null alias for closures
		const EASE = 0.07; // lower = more inertia (0.07 from the Codrops article)
		const PARALLAX_INTENSITY = 0.15; // how much images shift inside their cards

		let scrollTarget = 0;
		let scrollCurrent = 0;
		let limit = 0;
		let running = true;

		const cards = Array.from(el.querySelectorAll<HTMLElement>('.hscroll-card'));
		const images = cards.map((c) => c.querySelector<HTMLElement>('.hscroll-card-img img'));

		function setLimit() {
			limit = Math.max(el.scrollWidth - node.clientWidth, 0);
		}

		function onScroll() {
			const rect = node.getBoundingClientRect();
			const vh = window.innerHeight || 1;
			const travel = Math.max(rect.height - vh, 1);
			const p = clamp(-rect.top / travel, 0, 1);
			scrollTarget = p * limit;
		}

		function render() {
			if (!running) return;

			// Lerp toward target for smooth momentum
			scrollCurrent = lerp(scrollCurrent, scrollTarget, EASE);

			// Snap when close enough to avoid sub-pixel jitter
			if (Math.abs(scrollCurrent - scrollTarget) < 0.5) {
				scrollCurrent = scrollTarget;
			}

			el.style.transform = `translateX(${-scrollCurrent}px)`;

			// Per-card parallax: shift the image based on card's distance from center
			const vw = window.innerWidth || 1;
			const center = vw / 2;

			for (let i = 0; i < cards.length; i++) {
				const card = cards[i];
				const img = images[i];
				if (!img) continue;

				const cardRect = card.getBoundingClientRect();
				const cardCenter = cardRect.left + cardRect.width / 2;
				// Normalized distance from center: -1 (left) to +1 (right)
				const distance = (cardCenter - center) / center;
				const parallax = distance * PARALLAX_INTENSITY * cardRect.width;

				img.style.transform = `translateX(${parallax}px) scale(1.15)`;
			}

			requestAnimationFrame(render);
		}

		setLimit();
		onScroll();
		scrollCurrent = scrollTarget; // start without easing gap

		const onResize = () => {
			setLimit();
			onScroll();
		};

		window.addEventListener('scroll', onScroll, { passive: true });
		window.addEventListener('resize', onResize, { passive: true });

		requestAnimationFrame(render);

		return {
			destroy() {
				running = false;
				window.removeEventListener('scroll', onScroll);
				window.removeEventListener('resize', onResize);
			}
		};
	}

	const editorialCards = [
		{
			image: imgBloom,
			tag: 'Styling Guide',
			title: 'Layering prints without losing calm'
		},
		{
			image: imgAtelier,
			tag: 'Behind the Loom',
			title: 'From motif to woven repeat'
		},
		{
			image: imgCraft,
			tag: 'Studio Notes',
			title: 'How we test color before production'
		},
		{
			image: imgStory,
			tag: 'Material Story',
			title: 'Why hand-feel matters more'
		}
	];
</script>

<svelte:head>
	<title>Aziza — Sticky Scroll</title>
	<meta
		name="description"
		content="A cinematic sticky scroll landing page for Aziza home textiles."
	/>
</svelte:head>

<!-- ═══════════════════════════════════════════════════
     HERO
     ═══════════════════════════════════════════════════ -->
<section data-navbar-dark class="hero">
	<div class="hero-bg">
		<img src={imgFloral} alt="Aziza hero" class="hero-bg-img" />
		<div class="hero-overlay"></div>
	</div>

	<div class="hero-content">
		<p class="kicker" use:inView>Spring Collection 2025</p>
		<h1 use:inView>
			Where craft<br />meets comfort
		</h1>
		<p class="hero-lede" use:inView>
			Thoughtfully designed home textiles that turn everyday living into something extraordinary —
			from fiber to finish.
		</p>
		<div class="hero-actions" use:inView>
			<a href="/collections" class="btn-solid">Shop Collections</a>
			<a href="/about" class="btn-outline">Our Story</a>
		</div>
	</div>

	<div class="scroll-hint" use:inView>
		<span></span>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════
     LOGO REVEAL — scroll-driven SVG stroke draw
     ═══════════════════════════════════════════════════ -->
<section class="logo-section" use:stickyProgress={'--logo'}>
	<div class="logo-sticky">
		<div class="logo-wrap" style="--max-scale:{logoMaxScale}">
			<svg
				viewBox="0 0 244 66"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
				class="logo-svg"
				aria-label="Aziza logo"
			>
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

				<!-- Stroke paths masked by the logo silhouette, each with staggered --d/--dur -->
				<g mask="url(#logo-mask)" clip-path="url(#logo-clip)" class="logo-strokes">
					<!-- Center bar — draws first -->
					<path d="M122 66V0" class="logo-stroke" style="--d:0; --dur:0.25" stroke-width="6" />
					<!-- Left diagonal -->
					<path d="M1 66L37 0" class="logo-stroke" style="--d:0.08; --dur:0.22" />
					<!-- Left complex -->
					<path
						d="M33 1L52 62H60.5L108 -2.5"
						class="logo-stroke"
						style="--d:0.1; --dur:0.3"
						stroke-width="10"
					/>
					<!-- Left horizontals -->
					<path d="M50 65H111" class="logo-stroke" style="--d:0.2; --dur:0.2" />
					<path d="M110 1H57" class="logo-stroke" style="--d:0.18; --dur:0.2" />
					<!-- Right diagonal -->
					<path d="M243 66L207 0" class="logo-stroke" style="--d:0.08; --dur:0.22" />
					<!-- Right complex -->
					<path
						d="M211 1L192 62H183.5L136 -2.5"
						class="logo-stroke"
						style="--d:0.1; --dur:0.3"
						stroke-width="10"
					/>
					<!-- Right horizontals -->
					<path d="M194 65H133" class="logo-stroke" style="--d:0.2; --dur:0.2" />
					<path d="M134 1H187" class="logo-stroke" style="--d:0.18; --dur:0.2" />
				</g>

				<!-- Solid fill paths — fade in after strokes complete -->
				<path d="M119 0V66H125V0H119Z" class="logo-fill-i" />
				<path
					d="M208 0L244 66H242L212 11L195 66H133V64H180L133 0H187V2H145L187 59H189L206 0H208Z"
					fill="white"
					class="logo-fill"
					style="--fill-d: 0.05"
				/>
				<path
					d="M36 0L0 66H2L32 11L49 66H111V64H64L111 0H57V2H99L57 59H55L38 0H36Z"
					fill="white"
					class="logo-fill"
					style="--fill-d: 0.1"
				/>
			</svg>

			<!-- Tagline — fades in last -->
			<p class="logo-tagline">Where Home Becomes Haven</p>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════
     WHITE EDITORIAL — seamless from the logo zoom
     ═══════════════════════════════════════════════════ -->
<section class="white-ed">
	<div class="we-inner">
		<div class="we-header" use:inView>
			<p class="we-kicker">Our Philosophy</p>
			<h2>Designed for<br />the way you live</h2>
		</div>

		<div class="we-cols">
			<div class="we-text" use:inView>
				<p>
					Aziza was born from a deep belief that the home should feel like a sanctuary — a place of
					warmth, calm, and quiet beauty.
				</p>
				<p>
					Our collections draw on botanical heritage and artisan craft, balancing timeless design
					with the demands of modern living. Every piece is made to be lived in and loved for years
					to come.
				</p>
			</div>
			<div class="we-img" use:inView>
				<img src={imgIvory} alt="Aziza textile detail" />
			</div>
		</div>

		<blockquote class="we-quote" use:inView>
			<p>"We believe the details you live with<br />should always be beautiful."</p>
		</blockquote>

		<div class="we-cols we-cols-flip">
			<div class="we-text" use:inView>
				<p>
					We test hand-feel, crease behavior, and light response before anything reaches production.
					The result is fabric that looks composed in motion and at rest.
				</p>
				<p>
					From fiber selection to final finish, every decision is guided by a single question: will
					this make a home feel more like itself?
				</p>
			</div>
			<div class="we-img" use:inView>
				<img src={imgCraft} alt="Aziza craftsmanship" />
			</div>
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════
     COLLECTION SHOWCASE — fullscreen images + text on scroll
     ═══════════════════════════════════════════════════ -->
<section class="showcase" use:stickyProgress={'--show'}>
	<div class="showcase-sticky">
		{#each collections as col, i}
			<div class="showcase-slide" style="--idx:{i}; --count:{collections.length}">
				<img src={col.image} alt={col.title} class="showcase-img" />
				<div class="showcase-overlay"></div>
				<div class="showcase-text">
					<p class="kicker">{col.kicker}</p>
					<h2>{@html col.title.replace('\n', '<br />')}</h2>
					<p class="showcase-copy">{col.copy}</p>
				</div>
			</div>
		{/each}

		<!-- Progress dots -->
		<div class="showcase-dots">
			{#each collections as _, i}
				<span class="showcase-dot" style="--idx:{i}; --count:{collections.length}"></span>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════
     FEATURES — horizontal scroll
     ═══════════════════════════════════════════════════ -->
<section class="hscroll-section" use:hScroll>
	<div class="hscroll-sticky">
		<div class="hscroll-header">
			<p class="kicker">The Aziza Difference</p>
			<h2>Why it feels<br />different</h2>
		</div>
		<div class="hscroll-track">
			{#each features as feat, i}
				<article class="hscroll-card">
					<div class="hscroll-card-img">
						<img src={feat.image} alt={feat.title} />
					</div>
					<div class="hscroll-card-overlay"></div>
					<div class="hscroll-card-body">
						<span class="hscroll-card-kicker">{feat.kicker}</span>
						<h3>{@html feat.title.replace('\n', '<br />')}</h3>
						<p>{feat.copy}</p>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════
     EDITORIAL GRID
     ═══════════════════════════════════════════════════ -->
<section data-navbar-dark class="editorial">
	<div class="editorial-inner">
		<div class="editorial-header" use:inView>
			<p class="kicker">From the Journal</p>
			<h2>Stories behind<br />the collection</h2>
		</div>

		<div class="editorial-grid">
			{#each editorialCards as card, i}
				<article class="ed-card" use:inView style="transition-delay: {i * 100}ms">
					<div class="ed-card-img-wrap">
						<img src={card.image} alt={card.title} />
					</div>
					<div class="ed-card-body">
						<span class="ed-card-tag">{card.tag}</span>
						<h4>{card.title}</h4>
					</div>
				</article>
			{/each}
		</div>
	</div>
</section>

<!-- ═══════════════════════════════════════════════════
     CLOSING CTA — another sticky grow into email capture
     ═══════════════════════════════════════════════════ -->
<section class="cta-section" use:stickyProgress={'--cta'}>
	<div class="cta-sticky">
		<div class="cta-bg">
			<img src={imgBloom} alt="Aziza bloom" class="cta-bg-img" />
			<div class="cta-bg-overlay"></div>
		</div>

		<div class="cta-content">
			<p class="kicker" style="color: rgba(255,255,255,0.5)">Be the first to know</p>
			<h2>Join the<br />Aziza circle</h2>
			<p class="cta-sub">
				Collection previews, styling notes, and early access — delivered with care, never with spam.
			</p>
			<form class="cta-form" onsubmit={(e) => e.preventDefault()}>
				<input type="email" placeholder="Your email address" />
				<button type="submit">Subscribe</button>
			</form>
		</div>
	</div>
</section>

<style>
	/* ──────────────────────────────────────────────────
	   TOKENS
	   ────────────────────────────────────────────────── */
	:global(body) {
		/* override for demo page */
	}

	* {
		box-sizing: border-box;
		margin: 0;
	}

	.kicker {
		font-size: 0.7rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
		font-weight: 500;
	}

	h1,
	h2,
	h3,
	h4 {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-weight: 300;
		line-height: 1;
	}

	/* ──────────────────────────────────────────────────
	   REVEAL ANIMATION
	   ────────────────────────────────────────────────── */
	:global(.in-view) {
		/* intentionally empty — used by descendants */
	}

	/* ──────────────────────────────────────────────────
	   HERO
	   ────────────────────────────────────────────────── */
	.hero {
		position: relative;
		min-height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		padding: 0 clamp(24px, 4vw, 64px) clamp(48px, 8vh, 100px);
		overflow: hidden;
		background: #060608;
	}

	.hero-bg {
		position: absolute;
		inset: 0;
	}

	.hero-bg-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center 30%;
	}

	.hero-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(6, 6, 8, 0.88) 0%,
			rgba(6, 6, 8, 0.4) 40%,
			rgba(6, 6, 8, 0.15) 100%
		);
	}

	.hero-content {
		position: relative;
		z-index: 2;
		max-width: 720px;
	}

	.hero-content .kicker {
		opacity: 0;
		transform: translateY(20px);
		transition: all 800ms ease;
	}
	.hero-content .kicker:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.hero h1 {
		margin-top: 16px;
		font-size: clamp(3rem, 8vw, 7rem);
		color: white;
		opacity: 0;
		transform: translateY(30px);
		transition: all 900ms ease 100ms;
	}
	.hero h1:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-lede {
		margin-top: 20px;
		font-size: clamp(0.95rem, 1.6vw, 1.15rem);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.6);
		max-width: 480px;
		opacity: 0;
		transform: translateY(20px);
		transition: all 800ms ease 250ms;
	}
	.hero-lede:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.hero-actions {
		margin-top: 28px;
		display: flex;
		gap: 12px;
		flex-wrap: wrap;
		opacity: 0;
		transform: translateY(16px);
		transition: all 800ms ease 400ms;
	}
	.hero-actions:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.btn-solid,
	.btn-outline {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 14px 32px;
		font-size: 0.82rem;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		font-weight: 500;
		transition: all 300ms ease;
	}

	.btn-solid {
		background: white;
		color: #0a0a0c;
	}
	.btn-solid:hover {
		background: #f0ece4;
	}

	.btn-outline {
		border: 1px solid rgba(255, 255, 255, 0.3);
		color: white;
		background: transparent;
	}
	.btn-outline:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.scroll-hint {
		position: absolute;
		bottom: 28px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 2;
		opacity: 0;
		transition: opacity 1.2s ease 1s;
	}
	.scroll-hint:global(.in-view) {
		opacity: 1;
	}
	.scroll-hint span {
		display: block;
		width: 1px;
		height: 48px;
		background: linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.4));
		animation: scrollPulse 2s ease-in-out infinite;
	}

	@keyframes scrollPulse {
		0%,
		100% {
			opacity: 0.3;
			transform: scaleY(0.6);
		}
		50% {
			opacity: 1;
			transform: scaleY(1);
		}
	}

	/* ──────────────────────────────────────────────────
	   LOGO REVEAL — scroll-driven  (slow draw → fast zoom)
	   Phases mapped to --logo (0→1):
	     0→0.35   stroke draw  (multiplier 2 — leisurely)
	     0.28→0.38 fills + tagline appear
	     0.38→0.48 hold (everything visible)
	     0.45→0.58 tagline fades out
	     0.5→0.9  entire logo scales up — "I" fills viewport
	   ────────────────────────────────────────────────── */
	.logo-section {
		position: relative;
		height: 220svh; /* 60svh travel — snappy */
		background: #060608;
		--logo: 0;
	}

	.logo-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: clip;
	}

	.logo-wrap {
		display: flex;
		flex-direction: column;
		align-items: center;
		width: 100%;
		max-width: 520px;
		padding: 0 32px;
		position: relative;
		z-index: 2;
		/* Zoom: 0.5→1.0 mapped to 0→1 — fills entire remaining scroll */
		--zp: clamp(0, (var(--logo) - 0.5) / 0.5, 1);
		/* Quadratic ease-in for cinematic acceleration */
		--ze: calc(var(--zp) * var(--zp));
		transform: scale(calc(1 + var(--ze) * (var(--max-scale, 250) - 1)));
		transform-origin: center;
		will-change: transform;
	}

	.logo-svg {
		width: 100%;
		overflow: visible;
	}

	/*
	 * Strokes: multiplier 1.43 → draw spans ~0→0.35 of --logo.
	 * dashoffset goes from 500 (hidden) → 0 (drawn).
	 */
	.logo-stroke {
		fill: none;
		stroke: white;
		stroke-width: 10;
		stroke-linecap: round;
		stroke-dasharray: 500;
		stroke-dashoffset: calc(500 * (1 - clamp(0, (var(--logo) * 1.43 - var(--d)) / var(--dur), 1)));
	}

	/*
	 * Non-I fill paths: appear at ~0.28, stay visible.
	 * They scale off-screen naturally during zoom.
	 */
	.logo-fill {
		--fill-d: 0;
		opacity: clamp(0, calc((var(--logo) - 0.28 - var(--fill-d)) * 10), 1);
	}

	/*
	 * Center "I" fill: fades in and STAYS visible through the zoom.
	 * Uses #faf9f7 to seamlessly blend into the white editorial section.
	 */
	.logo-fill-i {
		fill: #faf9f7;
		opacity: clamp(0, calc((var(--logo) - 0.28) * 10), 1);
	}

	/* Tagline — appears at ~0.28, fades out at 0.45→0.58 */
	.logo-tagline {
		margin-top: 40px;
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(1rem, 2vw, 1.25rem);
		font-weight: 300;
		letter-spacing: 0.15em;
		color: rgba(255, 255, 255, 0.7);
		text-align: center;
		opacity: clamp(0, calc(min((var(--logo) - 0.28) * 7, 1 - (var(--logo) - 0.45) * 8)), 1);
		transform: translateY(calc((1 - clamp(0, (var(--logo) - 0.25) * 5, 1)) * 15px));
	}

	/* ──────────────────────────────────────────────────
	   WHITE EDITORIAL
	   ────────────────────────────────────────────────── */
	.white-ed {
		background: #faf9f7;
		color: #1a1a1a;
		margin-top: -100px;
		padding: clamp(24px, 3vh, 36px) 0 clamp(80px, 12vh, 140px);
	}

	.we-inner {
		max-width: 1100px;
		margin: 0 auto;
		padding: 0 clamp(24px, 4vw, 64px);
	}

	.we-kicker {
		font-size: 0.7rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: #999;
		font-weight: 500;
	}

	.we-header {
		margin-bottom: clamp(60px, 8vh, 100px);
		opacity: 0;
		transform: translateY(30px);
		transition: all 800ms ease;
	}
	.we-header:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.we-header h2 {
		margin-top: 14px;
		font-size: clamp(2.5rem, 5vw, 4.5rem);
		color: #1a1a1a;
		line-height: 1.05;
	}

	.we-cols {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: clamp(32px, 4vw, 64px);
		align-items: center;
		margin-bottom: clamp(60px, 8vh, 100px);
	}

	.we-cols-flip {
		direction: rtl;
	}
	.we-cols-flip > * {
		direction: ltr;
	}

	.we-text {
		opacity: 0;
		transform: translateY(30px);
		transition: all 700ms ease;
	}
	.we-text:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.we-text p {
		font-size: clamp(0.95rem, 1.3vw, 1.05rem);
		line-height: 1.75;
		color: #555;
		margin-bottom: 1.2em;
	}
	.we-text p:last-child {
		margin-bottom: 0;
	}

	.we-img {
		overflow: hidden;
		opacity: 0;
		transform: translateY(30px);
		transition: all 700ms ease 100ms;
	}
	.we-img:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.we-img img {
		width: 100%;
		aspect-ratio: 4 / 5;
		object-fit: cover;
		display: block;
	}

	.we-quote {
		text-align: center;
		padding: clamp(40px, 6vh, 80px) 0;
		margin-bottom: clamp(60px, 8vh, 100px);
		border-top: 1px solid #e5e3df;
		border-bottom: 1px solid #e5e3df;
		opacity: 0;
		transition: opacity 800ms ease;
	}
	.we-quote:global(.in-view) {
		opacity: 1;
	}

	.we-quote p {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		font-weight: 300;
		font-style: italic;
		line-height: 1.3;
		color: #333;
	}

	/* ──────────────────────────────────────────────────
	   COLLECTION SHOWCASE — fullscreen crossfade
	   ────────────────────────────────────────────────── */
	.showcase {
		position: relative;
		height: 400svh;
		background: #060608;
		--show: 0;
	}

	.showcase-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: clip;
	}

	.showcase-slide {
		position: absolute;
		inset: 0;
		opacity: clamp(
			0,
			calc(1 - abs(var(--show) - (var(--idx) + 0.5) / var(--count)) * var(--count) * 2),
			1
		);
		will-change: opacity;
	}

	.showcase-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
		transform: scale(calc(1.08 - abs(var(--show) - (var(--idx) + 0.5) / var(--count)) * 0.08));
		will-change: transform;
	}

	.showcase-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(6, 6, 8, 0.78) 0%,
			rgba(6, 6, 8, 0.25) 50%,
			rgba(6, 6, 8, 0.12) 100%
		);
		pointer-events: none;
	}

	.showcase-text {
		position: absolute;
		bottom: max(10%, 60px);
		left: clamp(24px, 5vw, 80px);
		z-index: 2;
		max-width: 560px;
		transform: translateY(
			calc(
				(
						1 -
							clamp(
								0,
								1 - abs(var(--show) - (var(--idx) + 0.5) / var(--count)) * var(--count) * 2,
								1
							)
					) *
					40px
			)
		);
	}

	.showcase-text h2 {
		margin-top: 12px;
		font-size: clamp(3rem, 7vw, 6rem);
		color: white;
	}

	.showcase-copy {
		margin-top: 16px;
		font-size: clamp(0.95rem, 1.4vw, 1.1rem);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.55);
		max-width: 420px;
	}

	.showcase-dots {
		position: absolute;
		right: clamp(20px, 3vw, 48px);
		top: 50%;
		transform: translateY(-50%);
		display: flex;
		flex-direction: column;
		gap: 10px;
		z-index: 3;
	}

	.showcase-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		border: 1px solid rgba(255, 255, 255, 0.4);
		background: rgba(
			255,
			255,
			255,
			calc(
				clamp(0, 1 - abs(var(--show) - (var(--idx) + 0.5) / var(--count)) * var(--count) * 2, 1) *
					0.9
			)
		);
		transition: none;
	}

	/* ──────────────────────────────────────────────────
	   FEATURES — horizontal scroll
	   ────────────────────────────────────────────────── */
	.hscroll-section {
		position: relative;
		height: 300svh;
		background: #060608;
	}

	.hscroll-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		display: flex;
		flex-direction: column;
		justify-content: center;
		overflow: clip;
	}

	.hscroll-header {
		padding: 0 clamp(24px, 5vw, 80px);
		margin-bottom: clamp(28px, 4vh, 48px);
		flex-shrink: 0;
	}

	.hscroll-header h2 {
		margin-top: 12px;
		font-size: clamp(2.2rem, 5vw, 3.8rem);
		color: white;
	}

	.hscroll-track {
		display: flex;
		gap: clamp(16px, 2vw, 28px);
		padding: 0 clamp(24px, 5vw, 80px);
		will-change: transform;
		flex-shrink: 0;
	}

	.hscroll-card {
		position: relative;
		flex: 0 0 clamp(300px, 38vw, 480px);
		aspect-ratio: 3 / 4;
		overflow: hidden;
		cursor: pointer;
	}

	/* Image fills the card */
	.hscroll-card-img {
		position: absolute;
		inset: 0;
		overflow: hidden;
	}

	.hscroll-card-img img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		will-change: transform;
	}

	/* Dark gradient overlay — intensifies on hover */
	.hscroll-card-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(6, 6, 8, 0.7) 0%,
			rgba(6, 6, 8, 0.1) 50%,
			transparent 100%
		);
		opacity: 0.4;
		transition: opacity 500ms ease;
		pointer-events: none;
		z-index: 1;
	}

	.hscroll-card:hover .hscroll-card-overlay {
		opacity: 1;
	}

	/* Text body — sits at the bottom, slides up + fades in on hover */
	.hscroll-card-body {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 2;
		padding: clamp(20px, 3vw, 32px);
		opacity: 0;
		transform: translateY(16px);
		transition:
			opacity 450ms ease,
			transform 450ms ease;
	}

	.hscroll-card:hover .hscroll-card-body {
		opacity: 1;
		transform: translateY(0);
	}

	.hscroll-card-kicker {
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.5);
	}

	.hscroll-card-body h3 {
		margin-top: 10px;
		font-size: clamp(1.2rem, 2vw, 1.6rem);
		color: white;
		line-height: 1.1;
	}

	.hscroll-card-body p {
		margin-top: 10px;
		font-size: clamp(0.85rem, 1.1vw, 0.95rem);
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.6);
	}

	/* ──────────────────────────────────────────────────
	   EDITORIAL GRID
	   ────────────────────────────────────────────────── */
	.editorial {
		background: #060608;
		padding: clamp(64px, 10vh, 120px) 0;
	}

	.editorial-inner {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 clamp(24px, 4vw, 64px);
	}

	.editorial-header {
		margin-bottom: clamp(40px, 6vh, 72px);
		opacity: 0;
		transform: translateY(28px);
		transition: all 800ms ease;
	}
	.editorial-header:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.editorial-header .kicker {
		color: rgba(255, 255, 255, 0.4);
	}

	.editorial-header h2 {
		margin-top: 12px;
		font-size: clamp(2.2rem, 5vw, 3.8rem);
		color: white;
	}

	.editorial-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 16px;
	}

	.ed-card {
		border-radius: 16px;
		overflow: hidden;
		background: rgba(255, 255, 255, 0.03);
		border: 1px solid rgba(255, 255, 255, 0.07);
		opacity: 0;
		transform: translateY(30px);
		transition: all 700ms ease;
		cursor: pointer;
	}
	.ed-card:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.ed-card:hover .ed-card-img-wrap img {
		transform: scale(1.05);
	}

	.ed-card-img-wrap {
		overflow: hidden;
		aspect-ratio: 4 / 3;
	}

	.ed-card-img-wrap img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transition: transform 600ms ease;
	}

	.ed-card-body {
		padding: 16px 18px 20px;
	}

	.ed-card-tag {
		font-size: 0.65rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
	}

	.ed-card-body h4 {
		margin-top: 8px;
		font-size: clamp(1rem, 1.6vw, 1.2rem);
		line-height: 1.15;
		color: rgba(255, 255, 255, 0.85);
	}

	/* ──────────────────────────────────────────────────
	   CTA SECTION
	   ────────────────────────────────────────────────── */
	.cta-section {
		position: relative;
		height: 220svh;
		background: #060608;
		--cta: 0;
	}

	.cta-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: clip;
	}

	.cta-bg {
		position: absolute;
		inset: 0;
	}

	.cta-bg-img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		transform: scale(calc(1 + var(--cta) * 0.1));
		filter: brightness(calc(0.45 - var(--cta) * 0.05)) saturate(calc(0.9 + var(--cta) * 0.1));
		will-change: transform, filter;
	}

	.cta-bg-overlay {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(
				circle at 30% 40%,
				rgba(200, 160, 100, calc(0.08 + var(--cta) * 0.06)),
				transparent 50%
			),
			linear-gradient(to top, rgba(6, 6, 8, 0.8), rgba(6, 6, 8, 0.4));
	}

	.cta-content {
		position: relative;
		z-index: 2;
		text-align: center;
		max-width: 520px;
		padding: 0 24px;
		opacity: clamp(0, calc(var(--cta) * 2.5), 1);
		transform: translateY(calc((1 - clamp(0, var(--cta) * 2, 1)) * 40px));
	}

	.cta-content h2 {
		margin-top: 12px;
		font-size: clamp(2.5rem, 6vw, 5rem);
		color: white;
	}

	.cta-sub {
		margin-top: 18px;
		font-size: clamp(0.9rem, 1.3vw, 1.05rem);
		line-height: 1.6;
		color: rgba(255, 255, 255, 0.55);
	}

	.cta-form {
		margin-top: 28px;
		display: flex;
		gap: 0;
		max-width: 420px;
		margin-inline: auto;
		overflow: hidden;
		border: 1px solid rgba(255, 255, 255, 0.15);
	}

	.cta-form input {
		flex: 1;
		min-width: 0;
		padding: 15px 18px;
		background: rgba(255, 255, 255, 0.05);
		border: none;
		color: white;
		font-family: inherit;
		font-size: 0.9rem;
	}

	.cta-form input::placeholder {
		color: rgba(255, 255, 255, 0.3);
	}

	.cta-form input:focus {
		outline: none;
		background: rgba(255, 255, 255, 0.08);
	}

	.cta-form button {
		padding: 15px 28px;
		border: none;
		background: white;
		color: #0a0a0c;
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 600;
		letter-spacing: 0.06em;
		text-transform: uppercase;
		cursor: pointer;
		transition: background 300ms ease;
	}

	.cta-form button:hover {
		background: #f0ece4;
	}

	/* ──────────────────────────────────────────────────
	   RESPONSIVE
	   ────────────────────────────────────────────────── */
	@media (max-width: 900px) {
		.we-cols {
			grid-template-columns: 1fr;
		}
		.we-cols-flip {
			direction: ltr;
		}

		.editorial-grid {
			grid-template-columns: 1fr;
		}

		.showcase-text h2 {
			font-size: clamp(2.4rem, 9vw, 4rem);
		}

		.hscroll-card {
			flex: 0 0 clamp(240px, 65vw, 340px);
		}

		/* Show text by default on touch devices */
		.hscroll-card-body {
			opacity: 1;
			transform: translateY(0);
		}
		.hscroll-card-overlay {
			opacity: 0.8;
		}

		.hero h1 {
			font-size: clamp(2.6rem, 10vw, 4rem);
		}
	}

	@media (max-width: 600px) {
		.hero-actions {
			flex-direction: column;
		}

		.btn-solid,
		.btn-outline {
			text-align: center;
		}

		.cta-form {
			flex-direction: column;
		}

		.showcase-text h2 {
			font-size: clamp(2rem, 8vw, 3rem);
		}
	}

	/* ──────────────────────────────────────────────────
	   REDUCED MOTION
	   ────────────────────────────────────────────────── */
	@media (prefers-reduced-motion: reduce) {
		.logo-section,
		.showcase,
		.hscroll-section,
		.cta-section {
			height: auto;
		}

		.logo-sticky,
		.showcase-sticky,
		.hscroll-sticky,
		.cta-sticky {
			position: relative;
			height: auto;
			min-height: 80svh;
		}

		.logo-stroke {
			stroke-dashoffset: 0;
		}

		.logo-fill {
			opacity: 1;
		}

		.logo-tagline {
			opacity: 1;
			transform: none;
		}

		.logo-wrap {
			transform: none;
		}

		.logo-fill-i {
			fill: white;
			opacity: 1;
		}

		.showcase-slide {
			position: relative;
			opacity: 1;
			height: 80svh;
		}

		.showcase-img {
			transform: none;
		}

		.showcase-text {
			transform: none;
		}

		.showcase-dots {
			display: none;
		}

		.hscroll-track {
			flex-wrap: wrap;
			transform: none !important;
		}

		.hscroll-card-img img {
			transform: none !important;
		}

		.cta-content {
			opacity: 1;
			transform: none;
		}

		.scroll-hint {
			display: none;
		}
	}
</style>
