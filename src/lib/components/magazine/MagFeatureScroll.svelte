<script lang="ts">
	import imgBreakfast from '$lib/assets/lookbook/breakfast-table.jpg';
	import imgLiving from '$lib/assets/lookbook/living-room-throws.jpg';
	import imgBedroom from '$lib/assets/lookbook/bedroom-linen.jpg';
	import imgCurtains from '$lib/assets/lookbook/curtains-light.jpg';
	import imgDining from '$lib/assets/lookbook/dining-setting.jpg';
	import imgCozy from '$lib/assets/lookbook/cozy-corner.jpg';
	import imgBotanical from '$lib/assets/lookbook/botanical-shelf.jpg';
	import imgTerrace from '$lib/assets/lookbook/terrace-textiles.jpg';
	import imgCta from '$lib/assets/lookbook/lookbook-cta.jpg';

	/* ── helpers ──────────────────────────────────────── */
	function clamp(v: number, min: number, max: number) {
		return Math.min(Math.max(v, min), max);
	}

	function lerp(start: number, end: number, factor: number) {
		return start * (1 - factor) + end * factor;
	}

	/**
	 * Codrops-style horizontal parallax gallery.
	 * Uses lerp for buttery momentum and per-card parallax.
	 */
	function hScroll(node: HTMLElement) {
		const track = node.querySelector<HTMLElement>('.hscroll-track');
		if (!track) return { destroy() {} };

		const el = track;
		const EASE = 0.07;
		const PARALLAX_INTENSITY = 0.15;

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

			scrollCurrent = lerp(scrollCurrent, scrollTarget, EASE);

			if (Math.abs(scrollCurrent - scrollTarget) < 0.5) {
				scrollCurrent = scrollTarget;
			}

			el.style.transform = `translateX(${-scrollCurrent}px)`;

			const vw = window.innerWidth || 1;
			const center = vw / 2;

			for (let i = 0; i < cards.length; i++) {
				const card = cards[i];
				const img = images[i];
				if (!img) continue;

				const cardRect = card.getBoundingClientRect();
				const cardCenter = cardRect.left + cardRect.width / 2;
				const distance = (cardCenter - center) / center;
				const parallax = distance * PARALLAX_INTENSITY * cardRect.width;

				img.style.transform = `translateX(${parallax}px) scale(1.15)`;
			}

			requestAnimationFrame(render);
		}

		setLimit();
		onScroll();
		scrollCurrent = scrollTarget;

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

	const scenes = [
		{
			kicker: 'Morning Light',
			title: 'The breakfast\ntable, set softly',
			copy: 'Linen napkins and a hand-printed runner — enough to make coffee feel like an occasion.',
			image: imgBreakfast
		},
		{
			kicker: 'Living Room',
			title: 'Layered for\nquiet afternoons',
			copy: 'Throws draped, cushions scattered — the kind of room you sink into and stay.',
			image: imgLiving
		},
		{
			kicker: 'The Bedroom',
			title: 'Where softness\ncomes first',
			copy: 'Organic cotton sheets that get better with every wash, paired with botanical prints.',
			image: imgBedroom
		},
		{
			kicker: 'Golden Hour',
			title: 'Curtains that\ncatch the light',
			copy: 'Belgian linen panels that filter the day into something warm and still.',
			image: imgCurtains
		},
		{
			kicker: 'The Dinner Table',
			title: 'Set for\nthe evening',
			copy: 'Hand-woven placemats and printed napkins that make every meal feel considered.',
			image: imgDining
		},
		{
			kicker: 'Reading Nook',
			title: 'A corner\nto disappear into',
			copy: "A cushion, a throw, a quiet hour — sometimes that's all a room needs.",
			image: imgCozy
		},
		{
			kicker: 'The Shelf',
			title: 'Botanicals\nand linen folds',
			copy: 'Even storage becomes a still life when the textures are right.',
			image: imgBotanical
		},
		{
			kicker: 'Outdoor Living',
			title: 'Textiles that\nstep outside',
			copy: 'Sun-washed linen on a terrace chair — summer living, made tangible.',
			image: imgTerrace
		}
	];

	const ctaCard = {
		title: 'See the full\nlookbook',
		copy: 'All the styled moments from our Spring 2025 collection, in one place.',
		image: imgCta,
		href: '/journal'
	};
</script>

<section data-navbar-dark class="hscroll-section" use:hScroll>
	<div class="hscroll-sticky">
		<div class="hscroll-header">
			<p class="kicker">Spring Lookbook</p>
			<h2>Styled for the season</h2>
		</div>
		<div class="hscroll-track">
			{#each scenes as scene}
				<article class="hscroll-card">
					<div class="hscroll-card-img">
						<img src={scene.image} alt={scene.title} />
					</div>
					<div class="hscroll-card-overlay"></div>
					<div class="hscroll-card-body">
						<span class="hscroll-card-kicker">{scene.kicker}</span>
						<h3>{@html scene.title.replace('\n', '<br />')}</h3>
						<p>{scene.copy}</p>
					</div>
				</article>
			{/each}

			<!-- CTA card — links to full lookbook -->
			<a href={ctaCard.href} class="hscroll-card hscroll-cta">
				<div class="hscroll-card-img">
					<img src={ctaCard.image} alt={ctaCard.title} />
				</div>
				<div class="hscroll-cta-overlay"></div>
				<div class="hscroll-cta-body">
					<h3>{@html ctaCard.title.replace('\n', '<br />')}</h3>
					<p>{ctaCard.copy}</p>
					<span class="hscroll-cta-link">View Lookbook &rarr;</span>
				</div>
			</a>
		</div>
	</div>
</section>

<style>
	.kicker {
		font-size: 0.7rem;
		letter-spacing: 0.25em;
		text-transform: uppercase;
		color: rgba(255, 255, 255, 0.45);
		font-weight: 500;
	}

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
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(2.2rem, 5vw, 3.8rem);
		font-weight: 300;
		line-height: 1;
		color: white;
	}

	.hscroll-track {
		display: flex;
		gap: clamp(16px, 2vw, 28px);
		padding-left: clamp(24px, 5vw, 80px);
		will-change: transform;
		flex-shrink: 0;
	}

	.hscroll-track::after {
		content: '';
		flex: 0 0 clamp(24px, 5vw, 80px);
	}

	.hscroll-card {
		position: relative;
		flex: 0 0 clamp(300px, 38vw, 480px);
		aspect-ratio: 4 / 5;
		overflow: hidden;
		cursor: pointer;
	}

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
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(1.2rem, 2vw, 1.6rem);
		font-weight: 300;
		line-height: 1.1;
		color: white;
	}

	.hscroll-card-body p {
		margin-top: 10px;
		font-size: clamp(0.85rem, 1.1vw, 0.95rem);
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.6);
	}

	/* CTA card — always visible text, distinct styling */
	.hscroll-cta {
		text-decoration: none;
	}

	.hscroll-cta-overlay {
		position: absolute;
		inset: 0;
		background: linear-gradient(
			to top,
			rgba(6, 6, 8, 0.85) 0%,
			rgba(6, 6, 8, 0.4) 50%,
			rgba(6, 6, 8, 0.2) 100%
		);
		transition: background 500ms ease;
		pointer-events: none;
		z-index: 1;
	}

	.hscroll-cta:hover .hscroll-cta-overlay {
		background: linear-gradient(
			to top,
			rgba(6, 6, 8, 0.9) 0%,
			rgba(6, 6, 8, 0.5) 50%,
			rgba(6, 6, 8, 0.3) 100%
		);
	}

	.hscroll-cta-body {
		position: absolute;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 2;
		padding: clamp(20px, 3vw, 32px);
	}

	.hscroll-cta-body h3 {
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(1.4rem, 2.2vw, 1.8rem);
		font-weight: 300;
		line-height: 1.1;
		color: white;
	}

	.hscroll-cta-body p {
		margin-top: 10px;
		font-size: clamp(0.85rem, 1.1vw, 0.95rem);
		line-height: 1.55;
		color: rgba(255, 255, 255, 0.6);
	}

	.hscroll-cta-link {
		display: inline-block;
		margin-top: 16px;
		font-size: 0.8rem;
		letter-spacing: 0.15em;
		text-transform: uppercase;
		color: white;
		border-bottom: 1px solid rgba(255, 255, 255, 0.4);
		padding-bottom: 2px;
		transition: border-color 300ms ease;
	}

	.hscroll-cta:hover .hscroll-cta-link {
		border-color: white;
	}

	/* Touch / small screens — always show text */
	@media (max-width: 900px) {
		.hscroll-card {
			flex: 0 0 clamp(240px, 65vw, 340px);
		}

		.hscroll-card-body {
			opacity: 1;
			transform: translateY(0);
		}

		.hscroll-card-overlay {
			opacity: 0.8;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.hscroll-section {
			height: auto;
		}

		.hscroll-sticky {
			position: relative;
			height: auto;
			min-height: 80svh;
		}

		.hscroll-track {
			flex-wrap: wrap;
			transform: none !important;
		}

		.hscroll-card-img img {
			transform: none !important;
		}
	}
</style>
