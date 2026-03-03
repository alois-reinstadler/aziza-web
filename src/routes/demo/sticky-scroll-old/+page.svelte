<script lang="ts">
	import floralHero from '$lib/assets/collections/collection-03-xl.jpg';
	import ivoryHero from '$lib/assets/collections/collection-02-xl.jpg';
	import bloomHero from '$lib/assets/collections/collection-01-xl.jpg';
	import atelierHero from '$lib/assets/collections/collection-04-xl.jpg';
	import craftImg from '$lib/assets/placeholder/craft-01.jpg';
	import storyImg from '$lib/assets/placeholder/story-01.jpg';

	type StoryStep = {
		kicker: string;
		title: string;
		copy: string;
		stat: string;
	};

	const storySteps: StoryStep[] = [
		{
			kicker: '01 / Materials',
			title: 'Natural fibers chosen for drape, not just softness',
			copy: 'We test hand-feel, crease behavior, and light response before anything reaches production. The result is fabric that looks composed in motion and at rest.',
			stat: '12 fabric trials'
		},
		{
			kicker: '02 / Motif',
			title: 'Painterly florals translated into woven rhythm',
			copy: 'Our repeats are designed to feel irregular from a distance and detailed up close. You get visual depth without the room becoming busy.',
			stat: '7 motif passes'
		},
		{
			kicker: '03 / Finish',
			title: 'A soft finish that gets better over time',
			copy: 'We bias toward finishes that age well with washing and daily use. The goal is a lived-in look, not a showroom-only moment.',
			stat: '50+ wash tests'
		}
	];

	const tiles = [
		{
			image: bloomHero,
			tag: 'Bedroom',
			title: 'Layered floral bedding in a warm neutral room',
			copy: 'A full system of duvet, pillowcases, and accents designed to work together.'
		},
		{
			image: craftImg,
			tag: 'Studio',
			title: 'Palette and weave sampling before final production',
			copy: 'Color and texture are tested together because they change each other.'
		},
		{
			image: storyImg,
			tag: 'Editorial',
			title: 'Quiet styling with shape, contrast, and texture',
			copy: 'A calmer composition built from restraint instead of excess.'
		},
		{
			image: atelierHero,
			tag: 'Collection',
			title: 'High-contrast florals for a richer visual mood',
			copy: 'Designed for spaces that can carry a bolder statement piece.'
		}
	];

	function clamp(v: number, min: number, max: number) {
		return Math.min(Math.max(v, min), max);
	}

	function stickyProgress(node: HTMLElement, cssVar = '--p') {
		let raf = 0;

		const update = () => {
			raf = 0;
			const rect = node.getBoundingClientRect();
			const vh = window.innerHeight || 1;
			const travel = Math.max(rect.height - vh, 1);
			const progress = clamp(-rect.top / travel, 0, 1);
			node.style.setProperty(cssVar, progress.toFixed(4));
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
</script>

<svelte:head>
	<title>Demo: Sticky Scroll Landing Page</title>
	<meta
		name="description"
		content="Sticky scroll landing page demo with cinematic image handoffs and pinned storytelling sections."
	/>
</svelte:head>

<div class="demo">
	<section class="hero">
		<div class="hero-noise"></div>
		<div class="shell hero-grid">
			<div>
				<p class="eyebrow">Demo / Sticky Scroll</p>
				<h1>Sticky-driven landing page concepts without the journal framing</h1>
				<p class="lede">
					A full landing page demo built around scroll handoffs, pinned visuals, and layered content. The
					point is the motion language: each section uses sticky scroll to carry visual continuity into the
					next conversion or content block.
				</p>
				<div class="hero-actions">
					<a href="#handoff" class="btn btn-primary">See Handoff Section</a>
					<a href="#story" class="btn btn-secondary">See Pinned Story</a>
				</div>
			</div>

			<div class="hero-panel">
				<div class="hero-image" style={`background-image: url(${floralHero})`}></div>
				<div class="hero-panel-copy">
					<p class="eyebrow">Motion Principle</p>
					<h2>Keep the same image alive across section boundaries</h2>
					<p>
						Instead of hard cuts between modules, use scroll to transform the featured visual into atmosphere
						for the section below.
					</p>
				</div>
			</div>
		</div>
	</section>

	<section id="handoff" class="handoff" use:stickyProgress={'--handoff-p'} style={`--handoff-url: url(${floralHero})`}>
		<div class="handoff-sticky">
			<div class="handoff-bg"></div>
			<div class="handoff-vignette"></div>
			<div class="handoff-frame-wrap">
				<div class="handoff-frame"></div>
			</div>
			<div class="shell handoff-copy">
				<p class="eyebrow">Section 01 / Cinematic Handoff</p>
				<h2>Featured image scales to full-screen and becomes the next section background</h2>
				<p>
					This is the exact pattern you asked for. A framed visual fills the screen during scroll, then the
					following content rides on top of it using a top fade and glass panels for readability.
				</p>
			</div>
		</div>

		<section class="handoff-content shell">
			<div class="section-head">
				<p class="eyebrow">Landing Page / Showcase Grid</p>
				<h3>Content block that inherits the same visual world</h3>
				<p>
					These cards sit over the transitioned image, so the section feels connected rather than appended.
				</p>
			</div>

			<div class="tile-grid">
				{#each tiles as tile}
					<article class="tile">
						<img src={tile.image} alt={tile.title} />
						<div class="tile-copy">
							<p class="eyebrow">{tile.tag}</p>
							<h4>{tile.title}</h4>
							<p>{tile.copy}</p>
						</div>
					</article>
				{/each}
			</div>
		</section>
	</section>

	<section id="story" class="story-wrap" use:stickyProgress={'--story-p'}>
		<div class="story-sticky">
			<div class="shell story-grid">
				<div class="story-visual">
					<div class="story-visual-bg" style={`--story-image-a: url(${ivoryHero}); --story-image-b: url(${atelierHero})`}></div>
					<div class="story-card story-card-a">
						<img src={ivoryHero} alt="Ivory collection" />
					</div>
					<div class="story-card story-card-b">
						<img src={atelierHero} alt="Atelier collection" />
					</div>
					<div class="story-stat">
						<span>Sticky Progress</span>
						<strong>{'{'}scroll-driven{'}'}</strong>
					</div>
				</div>

				<div class="story-copy">
					<p class="eyebrow">Section 02 / Pinned Storytelling</p>
					<h2>One pinned visual, multiple narrative beats</h2>
					<p class="story-intro">
						Use sticky scroll to animate the visual while text steps progress. This works well for product
						storytelling, feature education, or craftsmanship narratives.
					</p>

					<div class="step-list">
						{#each storySteps as step, i}
							<div class="step" style={`--i:${i};`}>
								<p class="eyebrow">{step.kicker}</p>
								<h3>{step.title}</h3>
								<p>{step.copy}</p>
								<div class="step-stat">{step.stat}</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="story-overlay shell">
		<div class="section-head">
			<p class="eyebrow">Landing Page / Feature Bands</p>
			<h3>Follow the pinned sequence with a denser conversion block</h3>
			<p>
				A sticky narrative sequence is a strong setup for a higher-intent section. The user arrives already
				primed with context.
			</p>
		</div>

		<div class="feature-bands">
			<div class="band">
				<h4>Launch Collection</h4>
				<p>Preview pieces, styling notes, and production diary in one curated destination.</p>
			</div>
			<div class="band">
				<h4>Designer Notes</h4>
				<p>Share material rationale and visual references without breaking the page rhythm.</p>
			</div>
			<div class="band">
				<h4>Private List</h4>
				<p>Collect signups after the motion sequence while visual momentum is still high.</p>
			</div>
		</div>
	</section>

	<section class="cta-handoff" use:stickyProgress={'--cta-p'} style={`--cta-url: url(${bloomHero})`}>
		<div class="cta-sticky">
			<div class="cta-bg"></div>
			<div class="cta-glow"></div>
			<div class="shell cta-layout">
				<div class="cta-block">
					<p class="eyebrow">Section 03 / Closing Conversion</p>
					<h2>A sticky zoom can also power the final CTA</h2>
					<p>
						Use a slower zoom and stronger overlay for the closing section so the email form or CTA feels
						anchored and intentional.
					</p>
					<form class="cta-form" onsubmit={(e) => e.preventDefault()}>
						<input type="email" placeholder="Email address" />
						<button type="submit">Request Early Access</button>
					</form>
					<p class="micro">No spam. Collection updates and release windows only.</p>
				</div>
				<div class="cta-side-card">
					<p class="eyebrow">Recommended Uses</p>
					<ul>
						<li>Product launches</li>
						<li>Lookbook reveals</li>
						<li>Brand campaigns</li>
						<li>Founder stories</li>
					</ul>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	.demo {
		--bg: #070709;
		--panel: rgb(13 13 16 / 70%);
		--panel-strong: rgb(14 14 17 / 84%);
		--line: rgb(243 238 229 / 14%);
		--fg: #f3eee5;
		--muted: rgb(243 238 229 / 70%);
		background: radial-gradient(circle at 20% 0%, #17151f 0%, var(--bg) 42%);
		color: var(--fg);
		min-height: 100vh;
		padding-bottom: 7rem;
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
		letter-spacing: 0.2em;
		text-transform: uppercase;
		color: var(--muted);
	}

	h1,
	h2,
	h3,
	h4 {
		margin: 0;
		font-family: Georgia, 'Times New Roman', serif;
		font-weight: 400;
		line-height: 0.96;
	}

	p {
		margin: 0;
	}

	.hero {
		position: relative;
		padding: 4.75rem 0 2.25rem;
	}

	.hero-noise {
		position: absolute;
		inset: 0;
		background-image:
			radial-gradient(circle at 15% 15%, rgb(255 255 255 / 6%) 0, transparent 36%),
			radial-gradient(circle at 80% 10%, rgb(228 185 120 / 10%) 0, transparent 38%);
		pointer-events: none;
	}

	.hero-grid {
		position: relative;
		display: grid;
		grid-template-columns: 1.05fr 0.95fr;
		gap: 20px;
		align-items: start;
	}

	.hero h1 {
		margin-top: 0.8rem;
		max-width: 14ch;
		font-size: clamp(2.1rem, 6.4vw, 4.85rem);
	}

	.lede {
		margin-top: 1rem;
		max-width: 58ch;
		color: var(--muted);
		line-height: 1.6;
	}

	.hero-actions {
		display: flex;
		gap: 10px;
		margin-top: 1.25rem;
		flex-wrap: wrap;
	}

	.btn {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 11px 14px;
		border-radius: 12px;
		border: 1px solid var(--line);
		text-decoration: none;
		font-size: 0.92rem;
	}

	.btn-primary {
		background: var(--fg);
		color: #0b0a09;
		border-color: transparent;
	}

	.btn-secondary {
		background: rgb(255 255 255 / 3%);
		color: var(--fg);
	}

	.hero-panel {
		border: 1px solid var(--line);
		border-radius: 18px;
		overflow: hidden;
		background: var(--panel);
		backdrop-filter: blur(14px);
	}

	.hero-image {
		aspect-ratio: 4 / 3;
		background-size: cover;
		background-position: center;
	}

	.hero-panel-copy {
		padding: 14px 14px 16px;
	}

	.hero-panel-copy h2 {
		margin-top: 0.6rem;
		font-size: 1.35rem;
		line-height: 1.05;
	}

	.hero-panel-copy p:last-child {
		margin-top: 0.75rem;
		color: var(--muted);
		line-height: 1.55;
		font-size: 0.94rem;
	}

	.handoff {
		position: relative;
		height: 240svh;
		margin-top: 1rem;
		--handoff-p: 0;
	}

	.handoff-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: clip;
		background: #050506;
	}

	.handoff-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to top, rgb(6 6 7 / 80%), rgb(6 6 7 / 8%) 56%),
			var(--handoff-url);
		background-position: center;
		background-size: cover;
		transform-origin: center;
		transform: scale(calc(0.74 + var(--handoff-p) * 0.44));
		filter:
			brightness(calc(0.98 - var(--handoff-p) * 0.18))
			saturate(calc(0.95 + var(--handoff-p) * 0.18));
		will-change: transform, filter;
	}

	.handoff-vignette {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 50% 36%, transparent 36%, rgb(0 0 0 / 54%) 100%),
			linear-gradient(to bottom, rgb(5 5 6 / 4%), rgb(5 5 6 / calc(0.12 + var(--handoff-p) * 0.55)));
	}

	.handoff-frame-wrap {
		position: absolute;
		inset: 0;
		display: grid;
		place-items: center;
		padding: 24px;
		pointer-events: none;
	}

	.handoff-frame {
		width: min(1160px, calc(100vw - 48px));
		aspect-ratio: 21 / 9;
		border-radius: calc(22px * (1 - min(1, var(--handoff-p) * 1.25)));
		overflow: hidden;
		border: 1px solid color-mix(in oklab, white calc((1 - var(--handoff-p)) * 16%), transparent);
		box-shadow:
			0 30px 90px rgb(0 0 0 / calc(0.42 - var(--handoff-p) * 0.18)),
			inset 0 0 0 1px rgb(255 255 255 / 4%);
		opacity: calc(1 - max(0, (var(--handoff-p) - 0.8) * 5));
		transform: translateY(calc((1 - var(--handoff-p)) * 14px));
	}

	.handoff-frame::before {
		content: '';
		display: block;
		width: 100%;
		height: 100%;
		background-image:
			linear-gradient(to top, rgb(0 0 0 / 64%), rgb(0 0 0 / 8%)),
			var(--handoff-url);
		background-size: cover;
		background-position: center;
		transform: scale(calc(1 + var(--handoff-p) * 0.12));
	}

	.handoff-copy {
		position: absolute;
		left: 0;
		right: 0;
		bottom: clamp(20px, 4vw, 40px);
		opacity: calc(1 - min(1, var(--handoff-p) * 1.65));
		transform: translateY(calc(var(--handoff-p) * -10px));
		pointer-events: none;
	}

	.handoff-copy h2 {
		margin-top: 0.65rem;
		max-width: 18ch;
		font-size: clamp(1.7rem, 4vw, 3.25rem);
	}

	.handoff-copy p:last-child {
		margin-top: 0.85rem;
		max-width: 54ch;
		line-height: 1.55;
		color: rgb(255 255 255 / 74%);
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
		margin-top: 0.7rem;
		font-size: clamp(1.55rem, 4vw, 2.9rem);
	}

	.section-head p:last-child {
		margin-top: 0.8rem;
		max-width: 56ch;
		color: var(--muted);
		line-height: 1.55;
	}

	.tile-grid {
		margin-top: 1.8rem;
		display: grid;
		grid-template-columns: repeat(12, minmax(0, 1fr));
		gap: 16px;
	}

	.tile {
		grid-column: span 6;
		border-radius: 18px;
		overflow: hidden;
		border: 1px solid var(--line);
		background: var(--panel);
		backdrop-filter: blur(12px);
	}

	.tile img {
		display: block;
		width: 100%;
		aspect-ratio: 4 / 3;
		object-fit: cover;
	}

	.tile-copy {
		padding: 14px 14px 16px;
	}

	.tile-copy .eyebrow {
		font-size: 0.64rem;
		margin-bottom: 0.45rem;
	}

	.tile-copy h4 {
		font-size: 1.15rem;
		line-height: 1.08;
	}

	.tile-copy p:last-child {
		margin-top: 0.65rem;
		color: var(--muted);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.story-wrap {
		position: relative;
		height: 260svh;
		margin-top: 0.5rem;
		--story-p: 0;
	}

	.story-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		display: grid;
		align-items: center;
		background:
			radial-gradient(circle at 78% 18%, rgb(218 155 90 / 12%), transparent 40%),
			#070709;
		overflow: clip;
	}

	.story-grid {
		display: grid;
		grid-template-columns: 0.95fr 1.05fr;
		gap: 20px;
		align-items: center;
	}

	.story-visual {
		position: relative;
		height: min(72svh, 760px);
		border-radius: 20px;
		border: 1px solid var(--line);
		overflow: hidden;
		background: #08080a;
	}

	.story-visual-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to top, rgb(7 7 8 / 70%), rgb(7 7 8 / 14%)),
			var(--story-image-a);
		background-size: cover;
		background-position: center;
		opacity: calc(1 - min(1, var(--story-p) * 1.2));
		transform: scale(calc(1 + var(--story-p) * 0.08));
	}

	.story-visual-bg::after {
		content: '';
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to top, rgb(7 7 8 / 76%), rgb(7 7 8 / 12%)),
			var(--story-image-b);
		background-size: cover;
		background-position: center;
		opacity: clamp(0, calc((var(--story-p) - 0.28) * 2.2), 1);
		transform: scale(calc(1.08 - clamp(0, calc((var(--story-p) - 0.28) * 2.2), 1) * 0.05));
	}

	.story-card {
		position: absolute;
		width: min(62%, 360px);
		border-radius: 16px;
		overflow: hidden;
		border: 1px solid rgb(255 255 255 / 10%);
		box-shadow: 0 20px 70px rgb(0 0 0 / 35%);
		background: #0b0b0e;
	}

	.story-card img {
		display: block;
		width: 100%;
		aspect-ratio: 3 / 4;
		object-fit: cover;
	}

	.story-card-a {
		top: calc(14% + (1 - var(--story-p)) * 18px);
		left: 8%;
		transform: rotate(calc(-5deg + var(--story-p) * 4deg))
			scale(calc(1 - clamp(0, calc((var(--story-p) - 0.34) * 2), 1) * 0.08));
		opacity: calc(1 - clamp(0, calc((var(--story-p) - 0.52) * 2.2), 1));
	}

	.story-card-b {
		right: 8%;
		bottom: calc(10% + (1 - var(--story-p)) * 20px);
		transform: rotate(calc(6deg - var(--story-p) * 5deg))
			translateY(calc((1 - clamp(0, calc((var(--story-p) - 0.18) * 1.8), 1)) * 22px));
		opacity: clamp(0, calc((var(--story-p) - 0.08) * 2.1), 1);
	}

	.story-stat {
		position: absolute;
		right: 14px;
		top: 14px;
		padding: 10px 12px;
		border-radius: 12px;
		border: 1px solid rgb(255 255 255 / 8%);
		background: rgb(8 8 10 / 58%);
		backdrop-filter: blur(12px);
		display: grid;
		gap: 2px;
	}

	.story-stat span {
		font-size: 0.68rem;
		letter-spacing: 0.08em;
		text-transform: uppercase;
		color: var(--muted);
	}

	.story-stat strong {
		font-weight: 600;
		font-size: 0.88rem;
	}

	.story-copy h2 {
		margin-top: 0.7rem;
		font-size: clamp(1.7rem, 4vw, 3rem);
		max-width: 15ch;
	}

	.story-intro {
		margin-top: 0.9rem;
		max-width: 52ch;
		color: var(--muted);
		line-height: 1.55;
	}

	.step-list {
		margin-top: 1.15rem;
		display: grid;
		gap: 10px;
	}

	.step {
		border-radius: 16px;
		border: 1px solid var(--line);
		background: rgb(13 13 16 / 66%);
		backdrop-filter: blur(12px);
		padding: 14px;
		opacity: 1;
	}

	.step h3 {
		margin-top: 0.55rem;
		font-size: 1.15rem;
		line-height: 1.08;
	}

	.step p:last-of-type {
		margin-top: 0.65rem;
		color: var(--muted);
		font-size: 0.92rem;
		line-height: 1.5;
	}

	.step-stat {
		margin-top: 0.8rem;
		display: inline-flex;
		align-items: center;
		padding: 7px 10px;
		border-radius: 999px;
		border: 1px solid rgb(255 255 255 / 10%);
		font-size: 0.8rem;
		color: rgb(255 255 255 / 88%);
		background: rgb(255 255 255 / 3%);
	}

	.story-overlay {
		margin-top: -58svh;
		position: relative;
		z-index: 2;
		padding-bottom: 5rem;
	}

	.feature-bands {
		margin-top: 1.4rem;
		display: grid;
		grid-template-columns: repeat(3, minmax(0, 1fr));
		gap: 12px;
	}

	.band {
		border-radius: 16px;
		border: 1px solid var(--line);
		background: var(--panel-strong);
		padding: 14px;
		backdrop-filter: blur(12px);
	}

	.band h4 {
		font-size: 1rem;
	}

	.band p {
		margin-top: 0.55rem;
		color: var(--muted);
		font-size: 0.9rem;
		line-height: 1.45;
	}

	.cta-handoff {
		position: relative;
		height: 180svh;
		margin-top: 1rem;
		--cta-p: 0;
	}

	.cta-sticky {
		position: sticky;
		top: 0;
		height: 100svh;
		overflow: clip;
		display: grid;
		align-items: center;
	}

	.cta-bg {
		position: absolute;
		inset: 0;
		background-image:
			linear-gradient(to top, rgb(6 6 7 / 85%), rgb(6 6 7 / 20%)),
			var(--cta-url);
		background-size: cover;
		background-position: center;
		transform: scale(calc(1 + var(--cta-p) * 0.12));
		filter:
			brightness(calc(0.68 - var(--cta-p) * 0.05))
			saturate(calc(0.92 + var(--cta-p) * 0.08));
	}

	.cta-glow {
		position: absolute;
		inset: 0;
		background:
			radial-gradient(circle at 20% 20%, rgb(255 211 145 / calc(0.12 + var(--cta-p) * 0.1)), transparent 42%),
			linear-gradient(to top, rgb(5 5 6 / 70%), rgb(5 5 6 / 20%));
	}

	.cta-layout {
		position: relative;
		display: grid;
		grid-template-columns: 1.15fr 0.85fr;
		gap: 16px;
		align-items: start;
	}

	.cta-block,
	.cta-side-card {
		border-radius: 18px;
		border: 1px solid var(--line);
		background: var(--panel);
		backdrop-filter: blur(14px);
	}

	.cta-block {
		padding: 18px;
		transform: translateY(calc((1 - var(--cta-p)) * 18px));
		opacity: clamp(0.6, calc(0.84 + var(--cta-p) * 0.3), 1);
	}

	.cta-block h2 {
		margin-top: 0.7rem;
		font-size: clamp(1.7rem, 4vw, 3rem);
		max-width: 15ch;
	}

	.cta-block p:nth-of-type(2) {
		margin-top: 0.85rem;
		max-width: 52ch;
		color: var(--muted);
		line-height: 1.55;
	}

	.cta-form {
		margin-top: 1rem;
		display: grid;
		grid-template-columns: 1fr auto;
		gap: 10px;
	}

	.cta-form input {
		min-width: 0;
		border-radius: 12px;
		border: 1px solid rgb(255 255 255 / 14%);
		background: rgb(8 8 9 / 55%);
		color: var(--fg);
		padding: 12px 14px;
		font: inherit;
	}

	.cta-form input::placeholder {
		color: rgb(243 238 229 / 42%);
	}

	.cta-form button {
		border: 0;
		border-radius: 12px;
		padding: 12px 14px;
		font: inherit;
		font-weight: 600;
		background: var(--fg);
		color: #0d0c0a;
		cursor: pointer;
	}

	.micro {
		margin-top: 0.55rem;
		font-size: 0.82rem;
		color: rgb(243 238 229 / 58%);
	}

	.cta-side-card {
		padding: 16px;
		transform: translateY(calc((1 - var(--cta-p)) * 28px));
	}

	.cta-side-card ul {
		margin: 0.85rem 0 0;
		padding-left: 1rem;
		color: var(--muted);
		line-height: 1.8;
	}

	@media (max-width: 980px) {
		.hero-grid,
		.story-grid,
		.cta-layout {
			grid-template-columns: 1fr;
		}

		.hero-panel {
			order: -1;
		}

		.handoff {
			height: 220svh;
		}

		.handoff-frame {
			width: min(560px, calc(100vw - 32px));
			aspect-ratio: 5 / 7;
		}

		.handoff-copy h2 {
			max-width: 12ch;
		}

		.tile {
			grid-column: span 12;
		}

		.story-wrap {
			height: 285svh;
		}

		.story-visual {
			height: min(56svh, 520px);
		}

		.story-overlay {
			margin-top: -38svh;
		}

		.feature-bands {
			grid-template-columns: 1fr;
		}

		.cta-form {
			grid-template-columns: 1fr;
		}

		.shell {
			width: min(1200px, calc(100vw - 32px));
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.handoff,
		.story-wrap,
		.cta-handoff {
			height: auto;
		}

		.handoff-sticky,
		.story-sticky,
		.cta-sticky {
			position: relative;
			height: auto;
			min-height: 0;
		}

		.handoff-frame-wrap,
		.handoff-copy,
		.handoff-vignette {
			display: none;
		}

		.handoff-bg {
			position: relative;
			aspect-ratio: 16 / 10;
			transform: none;
			filter: none;
		}

		.handoff-content {
			margin-top: 0;
			padding-top: 1.5rem;
		}

		.story-overlay {
			margin-top: 0;
			padding-top: 1.5rem;
		}

		.cta-bg {
			position: absolute;
			transform: none;
		}
	}
</style>
