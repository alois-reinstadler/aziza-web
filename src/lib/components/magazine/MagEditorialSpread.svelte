<script lang="ts">
	import { inView, scrollProgress } from './animations';
	import { collections } from '$lib/config/collections';
	import mainImage from '$lib/assets/stock-images/AdobeStock_1710340739.webp';
	import accentImage from '$lib/assets/stock-images/AdobeStock_1705702729.webp';

	const featured = collections.slice(0, 2);
</script>

<section class="light relative overflow-hidden bg-background py-24 lg:py-0">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1px_3fr] lg:gap-0">
			<!-- Left column — sticky on desktop -->
			<div class="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pr-16">
				<p
					use:inView
					class="reveal-up mb-6 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					Editorial
				</p>
				<h2
					use:inView
					class="reveal-up mb-8 font-serif text-4xl leading-[1.05] font-light text-black lg:text-6xl"
				>
					Where craft<br />meets quiet<br />luxury.
				</h2>
				<p
					use:inView={{ threshold: 0.3 }}
					class="reveal-up max-w-sm leading-relaxed text-muted-foreground"
				>
					Aziza was born from a deep belief that the home should feel like a sanctuary — a place of
					warmth, calm, and quiet beauty.
				</p>
			</div>

			<!-- Vertical divider — draws itself on scroll -->
			<div use:scrollProgress class="hidden lg:block">
				<div
					class="mx-auto h-full w-px bg-border"
					style="transform: scaleY(var(--scroll-progress, 0)); transform-origin: top"
				></div>
			</div>

			<!-- Right column — scrolling content -->
			<div class="space-y-20 lg:py-32 lg:pl-16">
				<!-- Main brand image -->
				<div use:inView class="reveal-up overflow-hidden">
					<img src={mainImage} alt="Aziza craftsmanship" class="aspect-4/5 w-full object-cover" />
				</div>

				<!-- Brand text block -->
				<div use:inView class="reveal-up max-w-md">
					<p class="mb-4 leading-relaxed text-muted-foreground">
						Our collections draw on botanical heritage and artisan craft, balancing timeless design
						with the demands of modern living.
					</p>
					<p class="leading-relaxed text-muted-foreground">
						Every piece is made to be lived in and loved for years to come.
					</p>
				</div>

				<!-- Pull-Quote -->
				<blockquote use:inView class="reveal-wipe py-4">
					<p
						class="font-serif text-2xl leading-snug font-light text-foreground/80 italic lg:text-3xl"
					>
						"We believe the details you live with should always be beautiful."
					</p>
				</blockquote>

				<!-- Accent image -->
				<div use:inView class="reveal-slide-right overflow-hidden lg:ml-auto lg:w-3/4">
					<img
						src={accentImage}
						alt="Botanical textile detail"
						class="aspect-3/2 w-full object-cover"
					/>
				</div>

				<!-- Process Story: From Field to Home -->
				<div use:inView class="reveal-up">
					<p class="mb-8 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
						From Field to Home
					</p>
					<div class="grid grid-cols-1 gap-8 sm:grid-cols-3">
						{#each [{ num: '01', title: 'Sourced', text: 'Organic cotton and Belgian linen, responsibly gathered from trusted growers.' }, { num: '02', title: 'Woven', text: 'Skilled mills and careful craft — every thread placed with intention.' }, { num: '03', title: 'Home', text: 'Made to last, made to love. Pieces that become part of your story.' }] as step, i (step.num)}
							<div use:inView class="reveal-up" style="transition-delay: {i * 150}ms">
								<span class="mb-2 block font-serif text-3xl font-light text-foreground/20"
									>{step.num}</span
								>
								<h4 class="mb-2 text-sm font-medium tracking-wide uppercase">
									{step.title}
								</h4>
								<p class="text-sm leading-relaxed text-muted-foreground">{step.text}</p>
							</div>
						{/each}
					</div>
				</div>

				<!-- Key Facts -->
				<div class="grid grid-cols-3 gap-6 border-y border-border/50 py-12">
					{#each [{ value: '100%', label: 'Organic materials' }, { value: '3', label: 'Master weavers' }, { value: '∞', label: 'Heirloom quality' }] as fact, i (fact.label)}
						<div use:inView class="reveal-up text-center" style="transition-delay: {i * 100}ms">
							<span class="block font-serif text-4xl font-light text-foreground lg:text-5xl"
								>{fact.value}</span
							>
							<span class="mt-2 block text-xs tracking-wide text-muted-foreground uppercase"
								>{fact.label}</span
							>
						</div>
					{/each}
				</div>

				<!-- Featured collections preview -->
				{#each featured as col, i (col.id)}
					<div use:inView class={i % 2 === 0 ? 'reveal-slide-left' : 'reveal-slide-right'}>
						<a href={col.href} class="group block">
							<div class="overflow-hidden">
								<img
									src={col.images.hero}
									alt={col.label}
									class="aspect-16/9 w-full object-cover transition-transform duration-700 group-hover:scale-105"
								/>
							</div>
							<div class="mt-4">
								<span class="text-xs tracking-[0.2em] text-muted-foreground uppercase"
									>{col.tag}</span
								>
								<h3 class="mt-1 font-serif text-2xl font-light">{col.label}</h3>
							</div>
						</a>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>

<style>
	.reveal-wipe {
		clip-path: inset(0 100% 0 0);
		transition: clip-path 800ms cubic-bezier(0.77, 0, 0.175, 1);
	}
	.reveal-wipe:global(.in-view) {
		clip-path: inset(0 0% 0 0);
	}

	.reveal-up {
		opacity: 0;
		transform: translateY(40px);
		transition:
			opacity 700ms ease-out,
			transform 700ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}

	.reveal-slide-left {
		opacity: 0;
		transform: translateX(-40px);
		transition:
			opacity 700ms ease-out,
			transform 700ms ease-out;
	}
	.reveal-slide-left:global(.in-view) {
		opacity: 1;
		transform: translateX(0);
	}

	.reveal-slide-right {
		opacity: 0;
		transform: translateX(40px);
		transition:
			opacity 700ms ease-out,
			transform 700ms ease-out;
	}
	.reveal-slide-right:global(.in-view) {
		opacity: 1;
		transform: translateX(0);
	}
</style>
