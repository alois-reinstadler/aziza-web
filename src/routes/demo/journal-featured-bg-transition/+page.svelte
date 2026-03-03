<script lang="ts">
	import imgFloral from '$lib/assets/collections/collection-03-xl.jpg';
	import imgIvory from '$lib/assets/collections/collection-02-xl.jpg';
	import imgBloom from '$lib/assets/collections/collection-01-xl.jpg';
	import imgAtelier from '$lib/assets/collections/collection-04-xl.jpg';
	import imgCraft from '$lib/assets/placeholder/craft-01.jpg';
	import imgStory from '$lib/assets/placeholder/story-01.jpg';

	type HandoffConfig = {
		label: string;
		title: string;
		description: string;
		hero: string;
		mode?: 'grid' | 'cta';
	};

	const handoffs: HandoffConfig[] = [
		{
			label: 'Marketing Section 01',
			title: 'Featured image handoff into an editorial story grid',
			description:
				'The framed image scales to full-screen, then the next section rides on top of it as a darkened background.',
			hero: imgFloral,
			mode: 'grid'
		},
		{
			label: 'Marketing Section 02',
			title: 'Collection image handoff into a campaign CTA panel',
			description:
				'Use the same scroll transition to carry visual momentum into a newsletter or campaign conversion block.',
			hero: imgIvory,
			mode: 'cta'
		}
	];

	const gridCards = [
		{
			image: imgBloom,
			tag: 'Styling Guide',
			title: 'How to layer prints without losing calm',
			copy: 'Mix floral statements with quiet neutrals while keeping the room composed and breathable.'
		},
		{
			image: imgAtelier,
			tag: 'Behind the Loom',
			title: 'From painterly motif to woven repeat',
			copy: 'How hand-drawn florals become repeat systems that still feel organic on finished textiles.'
		},
		{
			image: imgCraft,
			tag: 'Studio Notes',
			title: 'Three ways we test color before production',
			copy: 'Why the same print shifts across fibers and finishes, and what the team validates before sign-off.'
		},
		{
			image: imgStory,
			tag: 'Material Story',
			title: 'Why hand-feel matters more than thread count',
			copy: 'A practical explanation of softness, weight, and drape in real bedrooms and real use.'
		}
	];

	function clamp(v: number, min: number, max: number) {
		return Math.min(Math.max(v, min), max);
	}

	/**
	 * Progress for sticky "scroll-handoff" sections.
	 * Maps 0..1 across the actual sticky scroll distance (section height - viewport height).
	 */
	function stickyProgress(node: HTMLElement, cssVar = '--p') {
		let raf = 0;

		const update = () => {
			raf = 0;
			const rect = node.getBoundingClientRect();
			const viewport = window.innerHeight || 1;
			const travel = Math.max(rect.height - viewport, 1);
			const progress = clamp(-rect.top / travel, 0, 1);
			node.style.setProperty(cssVar, progress.toFixed(4));
		};

		const requestUpdate = () => {
			if (raf) return;
			raf = requestAnimationFrame(update);
		};

		update();
		window.addEventListener('scroll', requestUpdate, { passive: true });
		window.addEventListener('resize', requestUpdate, { passive: true });

		return {
			destroy() {
				if (raf) cancelAnimationFrame(raf);
				window.removeEventListener('scroll', requestUpdate);
				window.removeEventListener('resize', requestUpdate);
			}
		};
	}
</script>

<svelte:head>
	<title>Demo: Scroll Handoff Marketing Sections</title>
</svelte:head>

<div class="demo">
	<header class="intro shell">
		<p class="eyebrow">Demo / Scroll Handoff</p>
		<h1>1-2 marketing sections built around a featured image scale transition</h1>
		<p class="lede">
			These demos show the pattern you described: a framed image scales up to full screen during scroll,
			and the section after it uses that image as the background.
		</p>
	</header>

	{#each handoffs as handoff, handoffIndex (handoff.title)}
		<section
			class="scroll-handoff"
			use:stickyProgress
			style={`--hero-url: url(${handoff.hero}); --seed: ${handoffIndex};`}
		>
			<div class="sticky-stage">
				<div class="bg-layer"></div>
				<div class="vignette"></div>

				<div class="frame-layer">
					<div class="frame-window"></div>
				</div>

				<div class="frame-copy shell">
					<p class="eyebrow">{handoff.label}</p>
					<h2>{handoff.title}</h2>
					<p>{handoff.description}</p>
				</div>
			</div>

			{#if handoff.mode === 'grid'}
				<section class="handoff-content handoff-grid shell">
					<div class="section-head">
						<p class="eyebrow">Journal / Lookbook</p>
						<h3>Stories living on top of the expanded image</h3>
						<p>
							The image now behaves like atmosphere rather than content. Cards remain readable with glassy
							panels and a top fade.
						</p>
					</div>

					<div class="grid">
						{#each gridCards as card}
							<article class="card">
								<img src={card.image} alt={card.title} />
								<div class="card-copy">
									<p class="eyebrow">{card.tag}</p>
									<h4>{card.title}</h4>
									<p>{card.copy}</p>
								</div>
							</article>
						{/each}
					</div>
				</section>
			{:else}
				<section class="handoff-content handoff-cta shell">
					<div class="cta-panel">
						<div class="cta-copy">
							<p class="eyebrow">Campaign / Conversion</p>
							<h3>Bring the collection story into the conversion moment</h3>
							<p>
								This works well for newsletter capture, launch waitlists, or a collection CTA. The
								background transition keeps the section feeling intentional instead of dropped in.
							</p>
						</div>

						<form class="cta-form" onsubmit={(e) => e.preventDefault()}>
							<label>
								<span>Email Address</span>
								<input type="email" placeholder="you@example.com" />
							</label>
							<button type="submit">Join The Launch List</button>
							<p class="micro">No spam. Early access and studio notes only.</p>
						</form>
					</div>
				</section>
			{/if}
		</section>
	{/each}
</div>

<style>
	.demo {
		--demo-bg: #09090b;
		--demo-fg: #efe9dd;
		--demo-muted: rgb(239 233 221 / 72%);
		--demo-line: rgb(239 233 221 / 14%);
		--p: 0;
		background: var(--demo-bg);
		color: var(--demo-fg);
		min-height: 100vh;
		padding-bottom: 8rem;
	}

	* {
		box-sizing: border-box;
	}

	.shell {
		width: min(1200px, calc(100vw - 48px));
		margin-inline: auto;
	}

	.eyebrow {
		margin: 0;
		font-size: 0.72rem;
		letter-spacing: 0.22em;
		text-transform: uppercase;
		color: var(--demo-muted);
	}

	.intro {
		padding: 5.5rem 0 2.5rem;
	}

	.intro h1 {
		margin: 0.8rem 0 0;
		max-width: 14ch;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(2rem, 6vw, 4.6rem);
		font-weight: 400;
		line-height: 0.95;
	}

	.lede {
		margin: 1rem 0 0;
		max-width: 58ch;
		color: var(--demo-muted);
		line-height: 1.6;
	}

	.scroll-handoff {
		position: relative;
		height: 235svh;
		margin-top: 2rem;
		--p: 0;
	}

	.sticky-stage {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: clip;
		background: #050506;
	}

	.bg-layer {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to top, rgb(6 6 7 / 78%), rgb(6 6 7 / 8%) 55%),
			var(--hero-url);
		background-size: cover;
		background-position: center;
		transform-origin: center;
		transform: scale(calc(0.74 + var(--p) * 0.43));
		filter:
			saturate(calc(0.92 + var(--p) * 0.22))
			brightness(calc(0.96 - var(--p) * 0.18));
		will-change: transform, filter;
	}

	.vignette {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 50% 38%, transparent 36%, rgb(0 0 0 / 52%) 100%),
			linear-gradient(to bottom, rgb(3 3 4 / 6%), rgb(3 3 4 / calc(0.15 + var(--p) * 0.55)));
		pointer-events: none;
	}

	.frame-layer {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 24px;
		pointer-events: none;
	}

	.frame-window {
		width: min(1160px, calc(100vw - 48px));
		aspect-ratio: 21 / 9;
		border-radius: calc(22px * (1 - min(1, var(--p) * 1.25)));
		overflow: hidden;
		border: 1px solid color-mix(in oklab, white calc((1 - var(--p)) * 16%), transparent);
		box-shadow:
			0 36px 90px rgb(0 0 0 / calc(0.42 - var(--p) * 0.2)),
			inset 0 0 0 1px rgb(255 255 255 / 4%);
		opacity: calc(1 - max(0, (var(--p) - 0.8) * 5));
		transform: translateY(calc((1 - var(--p)) * 14px));
	}

	.frame-window::before {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		background-image:
			linear-gradient(to top, rgb(0 0 0 / 64%), rgb(0 0 0 / 8%)),
			var(--hero-url);
		background-size: cover;
		background-position: center;
		transform: scale(calc(1 + var(--p) * 0.12));
	}

	.frame-copy {
		position: absolute;
		left: 0;
		right: 0;
		bottom: clamp(18px, 4vw, 42px);
		opacity: calc(1 - min(1, var(--p) * 1.6));
		transform: translateY(calc(var(--p) * -10px));
		pointer-events: none;
	}

	.frame-copy h2 {
		margin: 0.65rem 0 0;
		max-width: 16ch;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.6rem, 4vw, 3.1rem);
		font-weight: 400;
		line-height: 0.98;
	}

	.frame-copy > p:last-child {
		margin: 0.85rem 0 0;
		max-width: 50ch;
		color: rgb(255 255 255 / 74%);
		line-height: 1.55;
	}

	.handoff-content {
		position: relative;
		z-index: 2;
		margin-top: -100svh;
		padding-top: 14svh;
		padding-bottom: 6rem;
	}

	.handoff-content::before {
		content: '';
		position: absolute;
		inset: 0;
		z-index: -1;
		background: linear-gradient(to bottom, rgb(8 8 9 / 18%), rgb(8 8 9 / 90%) 22%);
	}

	.section-head h3 {
		margin: 0.7rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.6rem, 4vw, 2.9rem);
		font-weight: 400;
		line-height: 0.98;
	}

	.section-head > p:last-child {
		margin: 0.8rem 0 0;
		max-width: 56ch;
		color: var(--demo-muted);
		line-height: 1.55;
	}

	.handoff-grid .grid {
		margin-top: 1.8rem;
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 16px;
	}

	.card {
		grid-column: span 6;
		overflow: hidden;
		border-radius: 18px;
		border: 1px solid var(--demo-line);
		background: rgb(13 13 15 / 70%);
		backdrop-filter: blur(12px);
		transition:
			transform 240ms ease,
			border-color 240ms ease;
	}

	.card:hover {
		transform: translateY(-3px);
		border-color: rgb(255 255 255 / 20%);
	}

	.card img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.card-copy {
		padding: 14px 14px 16px;
	}

	.card-copy .eyebrow {
		font-size: 0.64rem;
		margin-bottom: 0.45rem;
	}

	.card-copy h4 {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: 1.15rem;
		font-weight: 400;
		line-height: 1.08;
	}

	.card-copy > p:last-child {
		margin: 0.65rem 0 0;
		color: var(--demo-muted);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.handoff-cta .cta-panel {
		margin-top: 1.8rem;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 18px;
		padding: 18px;
		border-radius: 20px;
		border: 1px solid var(--demo-line);
		background: rgb(13 13 15 / 70%);
		backdrop-filter: blur(14px);
	}

	.cta-copy {
		padding: 12px 12px 12px 10px;
	}

	.cta-copy h3 {
		margin: 0.7rem 0 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-size: clamp(1.5rem, 3vw, 2.5rem);
		font-weight: 400;
		line-height: 1.02;
		max-width: 18ch;
	}

	.cta-copy > p:last-child {
		margin: 0.85rem 0 0;
		max-width: 46ch;
		color: var(--demo-muted);
		line-height: 1.55;
	}

	.cta-form {
		display: grid;
		align-content: start;
		gap: 12px;
		padding: 12px;
		border-radius: 16px;
		border: 1px solid rgb(255 255 255 / 8%);
		background: rgb(255 255 255 / 2%);
	}

	.cta-form label {
		display: grid;
		gap: 8px;
	}

	.cta-form span {
		font-size: 0.75rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--demo-muted);
	}

	.cta-form input {
		width: 100%;
		border: 1px solid rgb(255 255 255 / 14%);
		background: rgb(8 8 9 / 55%);
		color: var(--demo-fg);
		border-radius: 12px;
		padding: 12px 13px;
		font: inherit;
	}

	.cta-form input::placeholder {
		color: rgb(239 233 221 / 42%);
	}

	.cta-form button {
		border: 0;
		border-radius: 12px;
		padding: 12px 14px;
		font: inherit;
		font-weight: 600;
		background: var(--demo-fg);
		color: #0e0d0b;
		cursor: pointer;
	}

	.cta-form .micro {
		margin: 2px 0 0;
		font-size: 0.78rem;
		color: rgb(239 233 221 / 58%);
	}

	@media (max-width: 900px) {
		.scroll-handoff {
			height: 215svh;
		}

		.frame-window {
			width: min(560px, calc(100vw - 32px));
			aspect-ratio: 5 / 7;
		}

		.frame-copy {
			bottom: 22px;
		}

		.frame-copy h2 {
			max-width: 12ch;
		}

		.frame-copy > p:last-child {
			max-width: 42ch;
		}

		.handoff-grid .grid {
			gap: 12px;
		}

		.card {
			grid-column: span 12;
		}

		.handoff-cta .cta-panel {
			grid-template-columns: 1fr;
			gap: 12px;
		}

		.shell {
			width: min(1200px, calc(100vw - 32px));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.scroll-handoff {
			height: auto;
		}

		.sticky-stage {
			position: relative;
			height: auto;
			min-height: 0;
		}

		.bg-layer {
			position: relative;
			aspect-ratio: 16 / 10;
			transform: none;
			filter: none;
		}

		.frame-layer,
		.frame-copy,
		.vignette {
			display: none;
		}

		.handoff-content {
			margin-top: 0;
			padding-top: 1.4rem;
		}
	}
</style>
