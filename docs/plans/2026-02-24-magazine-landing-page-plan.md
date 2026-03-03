# Magazine Landing Page Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build an alternative magazine-style landing page on `feature/magazine-landing` branch with cinematic animations, editorial layouts, and a bento grid.

**Architecture:** Five new Svelte 5 components in `src/lib/components/magazine/` plus a shared animation utility. The existing `+page.svelte` is modified to import the new components instead of the current marketing ones. All animations use native CSS + IntersectionObserver + Svelte transitions (no heavy libraries).

**Tech Stack:** SvelteKit, Svelte 5 (runes), Tailwind CSS v4, Cormorant Garamond serif font, CSS clip-path animations, IntersectionObserver API

**Design doc:** `docs/plans/2026-02-24-magazine-landing-page-design.md`

---

### Task 1: Create feature branch and animation utilities

**Files:**

- Create: `src/lib/components/magazine/animations.ts`

**Step 1: Create the feature branch**

```bash
git checkout -b feature/magazine-landing
```

**Step 2: Create the shared animation utility file**

Create `src/lib/components/magazine/animations.ts` with:

```typescript
/**
 * Shared animation utilities for the magazine landing page.
 * Uses IntersectionObserver to trigger CSS class toggles on scroll.
 */

/** Svelte action: adds `in-view` class when element enters viewport */
export function inView(
	node: HTMLElement,
	options: { threshold?: number; rootMargin?: string; once?: boolean } = {}
) {
	const { threshold = 0.15, rootMargin = '0px', once = true } = options;

	const observer = new IntersectionObserver(
		(entries) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					node.classList.add('in-view');
					if (once) observer.unobserve(node);
				} else if (!once) {
					node.classList.remove('in-view');
				}
			}
		},
		{ threshold, rootMargin }
	);

	observer.observe(node);

	return {
		destroy() {
			observer.disconnect();
		}
	};
}

/** Svelte action: tracks scroll progress through an element (0-1) as a CSS variable */
export function scrollProgress(node: HTMLElement, varName = '--scroll-progress') {
	function update() {
		const rect = node.getBoundingClientRect();
		const windowH = window.innerHeight;
		// 0 when element top hits viewport bottom, 1 when element bottom hits viewport top
		const progress = Math.min(Math.max((windowH - rect.top) / (windowH + rect.height), 0), 1);
		node.style.setProperty(varName, String(progress));
	}

	update();
	window.addEventListener('scroll', update, { passive: true });
	window.addEventListener('resize', update, { passive: true });

	return {
		destroy() {
			window.removeEventListener('scroll', update);
			window.removeEventListener('resize', update);
		}
	};
}

/** Split text into individual character spans for stagger animation */
export function splitChars(text: string): { char: string; index: number }[] {
	return text.split('').map((char, index) => ({ char, index }));
}
```

**Step 3: Commit**

```bash
git add src/lib/components/magazine/animations.ts
git commit -m "feat: add shared animation utilities for magazine landing"
```

---

### Task 2: Build MagHero — Cinematic Cover

**Files:**

- Create: `src/lib/components/magazine/MagHero.svelte`

**Step 1: Create the MagHero component**

Create `src/lib/components/magazine/MagHero.svelte`:

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { splitChars } from './animations';
	import hero1 from '$lib/assets/hero-01.jpeg';

	// Animation state
	let revealed = $state(false);
	let showText = $state(false);
	let showCta = $state(false);
	let scrollY = $state(0);

	const titleTop = splitChars('SPRING');
	const titleBottom = splitChars('COLLECTION');

	$effect(() => {
		// Sequence: curtain (300ms) -> text (800ms) -> cta (1100ms)
		const t1 = setTimeout(() => (revealed = true), 300);
		const t2 = setTimeout(() => (showText = true), 800);
		const t3 = setTimeout(() => (showCta = true), 1100);
		return () => {
			clearTimeout(t1);
			clearTimeout(t2);
			clearTimeout(t3);
		};
	});

	function handleScroll() {
		scrollY = window.scrollY;
	}
</script>

<svelte:window onscroll={handleScroll} />

<section data-navbar-dark class="relative h-screen w-full overflow-hidden bg-black">
	<!-- Curtain reveal via clip-path -->
	<div
		class="absolute inset-0 transition-[clip-path] duration-[1200ms] ease-[cubic-bezier(0.77,0,0.175,1)]"
		style="clip-path: inset({revealed ? '0%' : '0 50% 0 50%'})"
	>
		<img
			src={hero1}
			alt="Aziza Spring Collection"
			class="h-full w-full object-cover transition-transform duration-[2000ms] ease-out"
			style="transform: scale({revealed ? 1 : 1.05}) translateY({scrollY * 0.3}px)"
		/>
		<div class="absolute inset-0 bg-black/30"></div>
	</div>

	<!-- Issue label — top right -->
	<div
		class="absolute top-8 right-8 z-10 transition-opacity duration-700 lg:top-12 lg:right-12"
		style="opacity: {showText ? 1 : 0}"
	>
		<p class="text-xs tracking-[0.35em] text-white/50 uppercase">Issue 01 — Spring 2025</p>
	</div>

	<!-- Staggered headline — offset layout -->
	<div class="absolute inset-0 z-10 flex flex-col justify-between p-8 lg:p-16">
		<!-- "SPRING" top-left -->
		<div class="mt-24 lg:mt-32" style="transform: translateY({scrollY * -0.15}px)">
			<h1 class="font-serif text-[12vw] leading-[0.85] font-light text-white lg:text-[10vw]">
				{#each titleTop as { char, index }}
					<span
						class="inline-block transition-all duration-700 ease-out"
						style="
							opacity: {showText ? 1 : 0};
							transform: translateY({showText ? 0 : 40}px);
							transition-delay: {index * 60}ms;
						">{char}</span
					>
				{/each}
			</h1>
		</div>

		<!-- "COLLECTION" bottom-right + CTA bottom-left -->
		<div class="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
			<!-- Subtext + CTA -->
			<div
				class="order-2 max-w-sm lg:order-1"
				style="opacity: {showCta ? 1 : 0}; transform: translateY({showCta
					? 0
					: 20}px); transition: all 700ms ease-out"
			>
				<p class="mb-6 text-sm leading-relaxed text-white/60 lg:text-base">
					Thoughtfully crafted textiles that transform everyday living into something extraordinary.
				</p>
				<div class="flex flex-wrap gap-4">
					<Button
						href="/collections"
						size="lg"
						class="rounded-none bg-white px-10 text-sm tracking-wide text-black hover:bg-stone-100"
					>
						Shop Collections
					</Button>
					<Button
						href="/about"
						variant="ghost"
						size="lg"
						class="rounded-none border border-white/40 px-10 text-sm tracking-wide text-white hover:bg-white/10 hover:text-white"
					>
						Our Story
					</Button>
				</div>
			</div>

			<!-- "COLLECTION" bottom-right -->
			<div class="order-1 text-right lg:order-2" style="transform: translateY({scrollY * -0.1}px)">
				<h1 class="font-serif text-[10vw] leading-[0.85] font-light text-white lg:text-[8vw]">
					{#each titleBottom as { char, index }}
						<span
							class="inline-block transition-all duration-700 ease-out"
							style="
								opacity: {showText ? 1 : 0};
								transform: translateY({showText ? 0 : 40}px);
								transition-delay: {(index + titleTop.length) * 50}ms;
							">{char}</span
						>
					{/each}
				</h1>
			</div>
		</div>
	</div>

	<!-- Scroll indicator -->
	<div
		class="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 transition-opacity duration-700"
		style="opacity: {showCta && scrollY < 50 ? 0.5 : 0}"
	>
		<div class="h-12 w-px animate-pulse bg-white/40"></div>
	</div>
</section>
```

**Step 2: Commit**

```bash
git add src/lib/components/magazine/MagHero.svelte
git commit -m "feat: add cinematic hero with curtain reveal and staggered typography"
```

---

### Task 3: Build MagEditorialSpread — Brand Story + Featured Collections

**Files:**

- Create: `src/lib/components/magazine/MagEditorialSpread.svelte`

**Step 1: Create the component**

Create `src/lib/components/magazine/MagEditorialSpread.svelte`:

```svelte
<script lang="ts">
	import { inView, scrollProgress } from './animations';
	import { collections } from '$lib/config/collections';
	import mainImage from '$lib/assets/stock-images/AdobeStock_1710340739.webp';
	import accentImage from '$lib/assets/stock-images/AdobeStock_1705702729.webp';

	const featured = collections.slice(0, 2); // Imperial Bloom + Maison Jardin
</script>

<section class="light relative overflow-hidden bg-background py-24 lg:py-0">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-12 lg:grid-cols-[2fr_1px_3fr] lg:gap-0">
			<!-- Left column — sticky on desktop -->
			<div class="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pr-16">
				<p
					use:inView
					class="reveal-wipe mb-6 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
				>
					Editorial
				</p>
				<h2
					use:inView
					class="reveal-wipe mb-8 font-serif text-4xl leading-[1.05] font-light text-foreground lg:text-6xl"
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

				<!-- Accent image -->
				<div use:inView class="reveal-slide-right overflow-hidden lg:ml-auto lg:w-3/4">
					<img
						src={accentImage}
						alt="Botanical textile detail"
						class="aspect-3/2 w-full object-cover"
					/>
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
	/* Wipe reveal: left to right */
	.reveal-wipe {
		clip-path: inset(0 100% 0 0);
		transition: clip-path 800ms cubic-bezier(0.77, 0, 0.175, 1);
	}
	.reveal-wipe:global(.in-view) {
		clip-path: inset(0 0% 0 0);
	}

	/* Fade up */
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

	/* Slide from left */
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

	/* Slide from right */
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
```

**Step 2: Commit**

```bash
git add src/lib/components/magazine/MagEditorialSpread.svelte
git commit -m "feat: add editorial spread with sticky layout and scroll animations"
```

---

### Task 4: Build MagBentoGrid — Collections Bento

**Files:**

- Create: `src/lib/components/magazine/MagBentoGrid.svelte`

**Step 1: Create the component**

Create `src/lib/components/magazine/MagBentoGrid.svelte`:

```svelte
<script lang="ts">
	import { inView } from './animations';
	import { collections } from '$lib/config/collections';

	// Bento layout classes: first tile large, two medium, one wide
	const layoutClasses = [
		'col-span-2 row-span-2', // large feature
		'col-span-1 row-span-1', // medium
		'col-span-1 row-span-1', // medium
		'col-span-2 row-span-1' // wide
	];
	const aspectClasses = ['aspect-square', 'aspect-3/4', 'aspect-3/4', 'aspect-[2/1]'];
</script>

<section data-navbar-dark class="py-24 lg:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-12 flex items-end justify-between">
			<div use:inView class="reveal-up">
				<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
					Collections
				</p>
				<h2 class="font-serif text-3xl font-light lg:text-5xl">The Edit</h2>
			</div>
			<a
				href="/collections"
				use:inView
				class="reveal-up hidden text-sm text-muted-foreground underline-offset-4 hover:underline sm:inline"
			>
				View all
			</a>
		</div>

		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
			{#each collections as col, i (col.id)}
				<a
					href={col.href}
					use:inView={{ threshold: 0.1 }}
					class="bento-tile group relative block overflow-hidden {layoutClasses[i]}"
					style="transition-delay: {i * 100}ms"
				>
					<div class="relative h-full w-full overflow-hidden {aspectClasses[i]}">
						<img
							src={col.images.hero}
							alt={col.label}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"
						></div>

						<!-- Tag -->
						<span
							class="absolute top-4 left-4 text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase"
						>
							{col.tag}
						</span>

						<!-- Title overlay -->
						<div class="absolute inset-x-0 bottom-0 p-4 lg:p-6">
							<h3
								class="font-serif text-xl font-light text-white lg:text-2xl {i === 0
									? 'lg:text-3xl'
									: ''}"
							>
								{col.label}
							</h3>
							<!-- Description appears on hover -->
							<p
								class="mt-2 max-w-xs text-sm text-white/0 transition-colors duration-500 group-hover:text-white/70"
							>
								{col.description}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.bento-tile {
		opacity: 0;
		transform: scale(0.95);
		transition:
			opacity 600ms ease-out,
			transform 600ms ease-out;
	}
	.bento-tile:global(.in-view) {
		opacity: 1;
		transform: scale(1);
	}

	.reveal-up {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 600ms ease-out,
			transform 600ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}
</style>
```

**Step 2: Commit**

```bash
git add src/lib/components/magazine/MagBentoGrid.svelte
git commit -m "feat: add bento grid collections with staggered scroll reveals"
```

---

### Task 5: Build MagCraftStrip — Horizontal Values Filmstrip

**Files:**

- Create: `src/lib/components/magazine/MagCraftStrip.svelte`

**Step 1: Create the component**

Create `src/lib/components/magazine/MagCraftStrip.svelte`:

```svelte
<script lang="ts">
	import { Leaf, Sparkles, Clock } from '@lucide/svelte';
	import { scrollProgress } from './animations';
	import type { Component } from 'svelte';

	const values: { icon: Component; title: string; description: string }[] = [
		{
			icon: Leaf,
			title: 'Natural Fibres',
			description:
				'Certified organic cotton, Belgian linen, and responsibly sourced materials — gentle on you and the planet.'
		},
		{
			icon: Sparkles,
			title: 'Botanical Craft',
			description:
				'Each pattern is hand-drawn, each piece woven with care. We believe the details you live with should always be beautiful.'
		},
		{
			icon: Clock,
			title: 'Made to Last',
			description:
				'We design against the throwaway. Our textiles are built to become heirlooms, not seasonal casualties.'
		}
	];
</script>

<section data-navbar-dark class="relative overflow-hidden py-24 lg:py-0">
	<!-- Desktop: scroll-driven horizontal strip -->
	<div class="hidden lg:block">
		<div use:scrollProgress class="relative h-[300vh]">
			<div class="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
				<div class="mb-12 px-16">
					<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
						Our Values
					</p>
					<h2 class="font-serif text-4xl font-light lg:text-5xl">The Aziza Craft</h2>
				</div>

				<div
					class="flex gap-8 px-16 transition-transform duration-100 ease-linear"
					style="transform: translateX(calc(-1 * var(--scroll-progress, 0) * 60%))"
				>
					{#each values as value, i (value.title)}
						{@const Icon = value.icon}
						<div
							class="flex w-[500px] shrink-0 items-start gap-8 rounded-none border border-border/30 p-10"
						>
							<div class="flex h-16 w-16 shrink-0 items-center justify-center border border-border">
								<Icon class="h-6 w-6 text-foreground/50" />
							</div>
							<div>
								<h3 class="mb-3 font-serif text-2xl font-light">{value.title}</h3>
								<p class="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>

	<!-- Mobile: vertical stack -->
	<div class="lg:hidden">
		<div class="mx-auto max-w-7xl px-6">
			<div class="mb-12">
				<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
					Our Values
				</p>
				<h2 class="font-serif text-3xl font-light">The Aziza Craft</h2>
			</div>

			<div class="space-y-8">
				{#each values as value (value.title)}
					{@const Icon = value.icon}
					<div class="flex items-start gap-6 border border-border/30 p-6">
						<div class="flex h-12 w-12 shrink-0 items-center justify-center border border-border">
							<Icon class="h-5 w-5 text-foreground/50" />
						</div>
						<div>
							<h3 class="mb-2 font-serif text-xl font-light">{value.title}</h3>
							<p class="text-sm leading-relaxed text-muted-foreground">{value.description}</p>
						</div>
					</div>
				{/each}
			</div>
		</div>
	</div>
</section>
```

**Step 2: Commit**

```bash
git add src/lib/components/magazine/MagCraftStrip.svelte
git commit -m "feat: add horizontal filmstrip values section with scroll-driven motion"
```

---

### Task 6: Build MagNewsletter — Typography-Focused Newsletter

**Files:**

- Create: `src/lib/components/magazine/MagNewsletter.svelte`

**Step 1: Create the component**

Create `src/lib/components/magazine/MagNewsletter.svelte`:

```svelte
<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { inView, splitChars } from './animations';

	let email = $state('');
	let submitted = $state(false);

	const headline = splitChars('Join the Circle');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitted = true;
		email = '';
	}
</script>

<section class="light bg-background py-32 lg:py-48">
	<div class="mx-auto max-w-2xl px-6 text-center lg:px-8">
		<!-- Letter-by-letter headline -->
		<h2
			use:inView
			class="headline-container mb-6 font-serif text-[8vw] leading-[0.9] font-light text-foreground lg:text-[5vw]"
		>
			{#each headline as { char, index }}
				<span class="headline-char inline-block" style="transition-delay: {index * 40}ms"
					>{char === ' ' ? '\u00A0' : char}</span
				>
			{/each}
		</h2>

		<p
			use:inView
			class="reveal-up mx-auto mb-12 max-w-md text-base leading-relaxed text-muted-foreground"
		>
			Be the first to hear about new collections, exclusive offers, and stories from behind the
			loom.
		</p>

		{#if submitted}
			<p class="font-serif text-2xl font-light text-foreground italic">Thank you for joining.</p>
		{:else}
			<form
				onsubmit={handleSubmit}
				use:inView={{ threshold: 0.3 }}
				class="reveal-up mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
			>
				<Input
					type="email"
					placeholder="Your email address"
					bind:value={email}
					required
					class="flex-1 rounded-none border-foreground/20 focus-visible:border-foreground/60"
				/>
				<Button type="submit" class="shrink-0 rounded-none px-8 text-sm tracking-wide">
					Subscribe
				</Button>
			</form>
			<p class="mt-4 text-xs text-muted-foreground/50">No spam. Unsubscribe at any time.</p>
		{/if}
	</div>
</section>

<style>
	.headline-char {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 500ms ease-out,
			transform 500ms ease-out;
	}
	.headline-container:global(.in-view) .headline-char {
		opacity: 1;
		transform: translateY(0);
	}

	.reveal-up {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 600ms ease-out,
			transform 600ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}
</style>
```

**Step 2: Commit**

```bash
git add src/lib/components/magazine/MagNewsletter.svelte
git commit -m "feat: add typography-focused newsletter with staggered letter animation"
```

---

### Task 7: Wire up the landing page

**Files:**

- Modify: `src/routes/(marketing)/+page.svelte`

**Step 1: Replace page content with magazine components**

Replace the contents of `src/routes/(marketing)/+page.svelte`:

```svelte
<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import MagHero from '$lib/components/magazine/MagHero.svelte';
	import MagEditorialSpread from '$lib/components/magazine/MagEditorialSpread.svelte';
	import MagBentoGrid from '$lib/components/magazine/MagBentoGrid.svelte';
	import MagCraftStrip from '$lib/components/magazine/MagCraftStrip.svelte';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';
</script>

<svelte:head>
	<title>Aziza — Home Textiles</title>
	<meta name="description" content="Thoughtfully crafted home textiles for modern living." />
</svelte:head>

<SsgoiTransition id="/">
	<MagHero />
	<MagEditorialSpread />
	<MagBentoGrid />
	<MagCraftStrip />
	<MagNewsletter />
</SsgoiTransition>
```

**Step 2: Commit**

```bash
git add src/routes/(marketing)/+page.svelte
git commit -m "feat: wire magazine components into landing page"
```

---

### Task 8: Visual QA and polish

**Step 1: Start dev server**

```bash
bun dev
```

**Step 2: Check each section visually**

Verify in browser at `http://localhost:5173`:

- Hero curtain animation plays on load
- Hero letter stagger works
- Hero parallax on scroll
- Editorial spread sticky column works on desktop
- Editorial divider line animates
- Editorial images reveal on scroll
- Bento grid tiles stagger in
- Bento hover effects work
- Craft strip scrolls horizontally on desktop
- Craft strip stacks vertically on mobile
- Newsletter letter animation triggers on scroll
- All sections look correct on mobile (< 768px)
- Navbar dark/light detection works on all sections

**Step 3: Run type checker**

```bash
bun check
```

Fix any TypeScript errors.

**Step 4: Run linter**

```bash
bun lint
```

Fix any linting issues.

**Step 5: Final commit**

```bash
git add -A
git commit -m "fix: polish magazine landing page after visual QA"
```

(Only if there were changes needed.)
