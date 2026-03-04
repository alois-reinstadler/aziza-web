<script lang="ts">
	import { onMount } from 'svelte';

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
		const { gsap } = await import('gsap');
		const { ScrollTrigger } = await import('gsap/ScrollTrigger');
		gsap.registerPlugin(ScrollTrigger);

		const block = document.querySelector<HTMLElement>('.sticky-grid-block')!;
		const content = block.querySelector<HTMLElement>('.sg-content')!;
		const title = block.querySelector<HTMLElement>('.sg-content__title')!;
		const description = block.querySelector<HTMLElement>('.sg-content__description')!;
		const button = block.querySelector<HTMLElement>('.sg-content__button')!;
		const grid = block.querySelector<HTMLElement>('.sg-gallery__grid')!;
		const items = Array.from(block.querySelectorAll<HTMLElement>('.sg-gallery__item'));

		const numColumns = 3;
		const columns: HTMLElement[][] = Array.from({ length: numColumns }, () => []);
		items.forEach((item, index) => {
			columns[index % numColumns].push(item);
		});

		gsap.set([description, button], { opacity: 0, pointerEvents: 'none' });

		const dy = (content.offsetHeight - title.offsetHeight) / 2;
		const titleOffsetY = (dy / content.offsetHeight) * 100;
		gsap.set(title, { yPercent: titleOffsetY });

		// Parallax: wrapper slides up into view
		const wrapper = block.querySelector<HTMLElement>('.sg-block__wrapper')!;
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

		// Grid reveal: columns slide in from top/bottom
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

		// Grid zoom: scale up + spread columns
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

		// Content toggle
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

		// Main scroll-driven timeline
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

		cleanup = () => {
			ScrollTrigger.getAll().forEach((st) => st.kill());
		};
	}
</script>

<section class="sticky-grid-block" data-navbar-dark>
	<div class="sg-block__wrapper">
		<div class="sg-content">
			<h2 class="sg-content__title">Styled for<br />the Season</h2>
			<p class="sg-content__description">
				Our Spring lookbook — textiles styled in the spaces they were made for.
				From morning light to golden hour.
			</p>
			<a href="/journal" class="sg-content__button">View Lookbook</a>
		</div>
		<div class="sg-gallery">
			<ul class="sg-gallery__grid">
				{#each images as src, i}
					<li class="sg-gallery__item">
						<img class="sg-gallery__image" {src} alt="Lookbook image {i + 1}" />
					</li>
				{/each}
			</ul>
		</div>
	</div>
</section>

<style>
	* {
		box-sizing: border-box;
		margin: 0;
	}

	.sticky-grid-block {
		height: 425vh;
		position: relative;
		background: #060608;
	}

	.sg-block__wrapper {
		position: sticky;
		top: 0;
		width: 100%;
		height: 100vh;
		overflow: hidden;
	}

	.sg-content {
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

	.sg-content__title {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(2.5rem, 6vw, 5.5rem);
		font-weight: 300;
		line-height: 1.05;
		color: white;
	}

	.sg-content__description {
		margin-top: 20px;
		font-size: clamp(0.9rem, 1.3vw, 1.05rem);
		line-height: 1.65;
		color: rgba(255, 255, 255, 0.55);
		max-width: 420px;
	}

	.sg-content__button {
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

	.sg-content__button:hover {
		background: #f0ece4;
	}

	.sg-gallery {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		width: min(736px, 55vw);
	}

	.sg-gallery__grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		column-gap: clamp(16px, 2.2vw, 32px);
		row-gap: clamp(20px, 2.8vw, 40px);
		list-style: none;
		padding: 0;
	}

	.sg-gallery__item {
		width: 100%;
		aspect-ratio: 1;
		overflow: hidden;
		will-change: transform;
	}

	.sg-gallery__image {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}

	@media (max-width: 768px) {
		.sg-gallery {
			width: 80vw;
		}

		.sg-content__title {
			font-size: clamp(2rem, 9vw, 3.5rem);
		}
	}
</style>
