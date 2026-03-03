<script lang="ts">
	import { onMount } from 'svelte';

	// Images — 12 total for a 3×4 grid
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

	const images = [img01, img02, img03, img04, img05, img06, img07, img08, img09, img10, img11, img12];

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
		const lenis = new Lenis({
			lerp: 0.08,
			wheelMultiplier: 1.4
		});

		lenis.on('scroll', ScrollTrigger.update);
		gsap.ticker.add((time) => lenis.raf(time * 1000));
		gsap.ticker.lagSmoothing(0);

		// ── Elements ──
		const block = document.querySelector<HTMLElement>('.block--main')!;
		const content = block.querySelector<HTMLElement>('.content')!;
		const title = block.querySelector<HTMLElement>('.content__title')!;
		const description = block.querySelector<HTMLElement>('.content__description')!;
		const button = block.querySelector<HTMLElement>('.content__button')!;
		const grid = block.querySelector<HTMLElement>('.gallery__grid')!;
		const items = Array.from(block.querySelectorAll<HTMLElement>('.gallery__item'));

		// ── Group items by column (3 cols) ──
		const numColumns = 3;
		const columns: HTMLElement[][] = Array.from({ length: numColumns }, () => []);
		items.forEach((item, index) => {
			columns[index % numColumns].push(item);
		});

		// ── Initial content state ──
		gsap.set([description, button], { opacity: 0, pointerEvents: 'none' });

		// Center title vertically, then offset it
		const dy = (content.offsetHeight - title.offsetHeight) / 2;
		const titleOffsetY = (dy / content.offsetHeight) * 100;
		gsap.set(title, { yPercent: titleOffsetY });

		// ── Parallax: wrapper slides up into view ──
		const wrapper = block.querySelector<HTMLElement>('.block__wrapper')!;
		gsap.from(wrapper, {
			yPercent: -100,
			ease: 'none',
			scrollTrigger: {
				trigger: block,
				start: 'top bottom',
				end: 'top top',
				scrub: true
			}
		});

		// ── Title fade in ──
		gsap.from(title, {
			opacity: 0,
			duration: 0.7,
			ease: 'power1.out',
			scrollTrigger: {
				trigger: block,
				start: 'top 57%',
				toggleActions: 'play none none reset'
			}
		});

		// ── Grid reveal: columns slide in from top/bottom ──
		function gridRevealTimeline() {
			const tl = gsap.timeline();
			const wh = window.innerHeight;
			const gridDy = wh - (wh - grid.offsetHeight) / 2;

			columns.forEach((column, colIndex) => {
				const fromTop = colIndex % 2 === 0;
				tl.from(
					column,
					{
						y: gridDy * (fromTop ? -1 : 1),
						stagger: {
							each: 0.06,
							from: fromTop ? 'end' : 'start'
						},
						ease: 'power1.inOut'
					},
					'grid-reveal'
				);
			});

			return tl;
		}

		// ── Grid zoom: scale up + spread columns ──
		function gridZoomTimeline() {
			const tl = gsap.timeline({ defaults: { duration: 1, ease: 'power3.inOut' } });

			tl.to(grid, { scale: 2.05 });
			tl.to(columns[0], { xPercent: -40 }, '<');
			tl.to(columns[2], { xPercent: 40 }, '<');
			tl.to(
				columns[1],
				{
					yPercent: (index: number) =>
						(index < Math.floor(columns[1].length / 2) ? -1 : 1) * 40,
					duration: 0.5,
					ease: 'power1.inOut'
				},
				'-=0.5'
			);

			return tl;
		}

		// ── Content toggle ──
		function toggleContent(isVisible: boolean) {
			gsap
				.timeline({ defaults: { overwrite: true } })
				.to(title, {
					yPercent: isVisible ? 0 : titleOffsetY,
					duration: 0.7,
					ease: 'power2.inOut'
				})
				.to(
					[description, button],
					{
						opacity: isVisible ? 1 : 0,
						duration: 0.4,
						ease: `power1.${isVisible ? 'inOut' : 'out'}`,
						pointerEvents: isVisible ? 'all' : 'none'
					},
					isVisible ? '-=90%' : '<'
				);
		}

		// ── Main scroll-driven timeline ──
		const mainTimeline = gsap.timeline({
			scrollTrigger: {
				trigger: block,
				start: 'top 25%',
				end: 'bottom bottom',
				scrub: true
			}
		});

		mainTimeline
			.add(gridRevealTimeline())
			.add(gridZoomTimeline(), '-=0.6')
			.add(
				() => toggleContent(mainTimeline.scrollTrigger!.direction === 1),
				'-=0.32'
			);

		// ── Cleanup ──
		cleanup = () => {
			lenis.destroy();
			ScrollTrigger.getAll().forEach((st) => st.kill());
		};
	}
</script>

<svelte:head>
	<title>Aziza — Sticky Grid Scroll</title>
</svelte:head>

<!-- Spacer before -->
<section class="block block--intro">
	<div class="intro-content">
		<p class="intro-kicker">Scroll down</p>
		<h1>Sticky Grid<br />Scroll</h1>
		<p class="intro-sub">A scroll-driven animated grid built with GSAP + Lenis</p>
	</div>
</section>

<!-- Main sticky grid section -->
<section class="block block--main">
	<div class="block__wrapper">
		<div class="content">
			<h2 class="content__title">Styled for<br />the Season</h2>
			<p class="content__description">
				Our Spring lookbook — textiles styled in the spaces they were made for.
				From morning light to golden hour.
			</p>
			<a href="/journal" class="content__button">View Lookbook</a>
		</div>
		<div class="gallery">
			<ul class="gallery__grid">
				{#each images as src, i}
					<li class="gallery__item">
						<img class="gallery__image" {src} alt="Lookbook image {i + 1}" />
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<!-- Spacer after -->
<section class="block block--outro">
	<div class="outro-content">
		<p>End of demo</p>
	</div>
</section>

<style>
	/* ── Reset & base ─────────────────────────── */
	:global(body) {
		overflow-x: hidden;
	}

	* {
		box-sizing: border-box;
		margin: 0;
	}

	/* ── Intro ────────────────────────────────── */
	.block--intro {
		height: 100vh;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		padding-bottom: 12vh;
		background: #060608;
	}

	.intro-content {
		text-align: center;
	}

	.intro-kicker {
		font-size: 0.7rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.4);
		margin-bottom: 16px;
	}

	.intro-content h1 {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(3rem, 8vw, 7rem);
		font-weight: 300;
		line-height: 1;
		color: white;
	}

	.intro-sub {
		margin-top: 20px;
		font-size: 0.95rem;
		color: rgba(255, 255, 255, 0.45);
		line-height: 1.5;
	}

	/* ── Main block ───────────────────────────── */
	.block--main {
		height: 425vh;
		position: relative;
		background: #060608;
	}

	.block__wrapper {
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	/* ── Content (text overlay) ───────────────── */
	.content {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100vh;
		text-align: center;
		z-index: 1;
		padding: 0 24px;
	}

	.content__title {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(2.5rem, 6vw, 5.5rem);
		font-weight: 300;
		line-height: 1.05;
		color: white;
	}

	.content__description {
		margin-top: 20px;
		font-size: clamp(0.9rem, 1.3vw, 1.05rem);
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.55);
		max-width: 420px;
	}

	.content__button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		margin-top: 28px;
		padding: 14px 36px;
		font-family: inherit;
		font-size: 0.82rem;
		font-weight: 500;
		letter-spacing: 0.12em;
		text-transform: uppercase;
		text-decoration: none;
		color: #0a0a0c;
		background: white;
		border: none;
		cursor: pointer;
		transition: background 300ms ease;
	}

	.content__button:hover {
		background: #f0ece4;
	}

	/* ── Gallery ──────────────────────────────── */
	.gallery {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		/* Grid width: 3 cols × ~220px + gaps */
		width: min(736px, 55vw);
	}

	.gallery__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		column-gap: clamp(16px, 2.2vw, 32px);
		row-gap: clamp(20px, 2.8vw, 40px);
		list-style: none;
		padding: 0;
	}

	.gallery__item {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		will-change: transform;
	}

	.gallery__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	/* ── Outro ────────────────────────────────── */
	.block--outro {
		height: 60vh;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #060608;
	}

	.outro-content p {
		font-size: 0.8rem;
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.3);
	}

	/* ── Responsive ───────────────────────────── */
	@media (max-width: 768px) {
		.gallery {
			width: 80vw;
		}

		.content__title {
			font-size: clamp(2rem, 9vw, 3.5rem);
		}
	}
</style>
