<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import { ShoppingBag, Search } from '@lucide/svelte';
	import logo from '$lib/assets/logo_regular.svg';
	import { scrollY } from 'svelte/reactivity/window';
	import { cn } from '$lib/utils';
	import { onMount } from 'svelte';

	import imgBreakfast from '$lib/assets/lookbook/breakfast-table.jpg';
	import imgLiving from '$lib/assets/lookbook/living-room-throws.jpg';
	import imgBedroom from '$lib/assets/lookbook/bedroom-linen.jpg';
	import imgCurtains from '$lib/assets/lookbook/curtains-light.jpg';
	import imgDining from '$lib/assets/lookbook/dining-setting.jpg';
	import imgCozy from '$lib/assets/lookbook/cozy-corner.jpg';
	import imgBotanical from '$lib/assets/lookbook/botanical-shelf.jpg';
	import imgTerrace from '$lib/assets/lookbook/terrace-textiles.jpg';

	type Props = {
		cartCount?: number;
		onCartClick?: () => void;
	};

	let { cartCount = 0, onCartClick }: Props = $props();

	let menuOpen = $state(false);
	let scrolled = $derived(scrollY.current && scrollY.current > 60);
	let isDark = $state(true);
	let isShopRoute = $derived(
		page.url.pathname.startsWith('/shop') || page.url.pathname.startsWith('/cart')
	);

	$effect(() => {
		const update = () => {
			if (menuOpen) return;
			const darkSections = document.querySelectorAll<HTMLElement>('[data-navbar-dark]');
			isDark = [...darkSections].some((el) => {
				const rect = el.getBoundingClientRect();
				return rect.top <= 80 && rect.bottom > 0;
			});
		};
		window.addEventListener('scroll', update, { passive: true });
		update();
		return () => window.removeEventListener('scroll', update);
	});

	afterNavigate(() => {
		if (menuOpen) toggleMenu();
	});

	const navLinks = [
		{ label: 'Shop', href: '/shop', num: '01', imgLeft: imgBreakfast, imgRight: imgLiving },
		{
			label: 'Collections',
			href: '/collections',
			num: '02',
			imgLeft: imgBedroom,
			imgRight: imgCurtains
		},
		{ label: 'About', href: '/about', num: '03', imgLeft: imgDining, imgRight: imgCozy },
		{ label: 'Journal', href: '/journal', num: '04', imgLeft: imgBotanical, imgRight: imgTerrace }
	];

	let openTl: gsap.core.Timeline | undefined;
	let closeTl: gsap.core.Timeline | undefined;
	let splitInstances: any[] = [];
	let hoverCleanups: (() => void)[] = [];

	onMount(() => {
		initGsap();
		return () => {
			openTl?.kill();
			closeTl?.kill();
			hoverCleanups.forEach((fn) => fn());
			splitInstances.forEach((s) => s.revert?.());
		};
	});

	async function initGsap() {
		const [gsapMod, splitMod] = await Promise.all([import('gsap'), import('split-type')]);
		const { gsap } = gsapMod;
		const SplitType = splitMod.default;

		const navBottom = document.querySelector<HTMLElement>('[data-nav="bottom-wrapper"]');
		const bottomLinks = document.querySelectorAll<HTMLElement>('[data-nav="bottom-link"]');
		const allLines = document.querySelectorAll<HTMLElement>('[data-nav="bottom-line"]');
		const linkImgWrappers = document.querySelectorAll<HTMLElement>('[data-nav="link-img"]');
		const linkImgs = document.querySelectorAll<HTMLElement>('[data-nav="link-img"] img');
		const menuLines = document.querySelectorAll<HTMLElement>('[data-nav="menu-line"]');
		const logoImg = document.querySelector<HTMLElement>('[data-nav="logo"]');

		if (!navBottom) return;

		const bottomSplits = Array.from(bottomLinks, (el) => new SplitType(el, { types: 'chars' }));
		splitInstances = bottomSplits;

		gsap.set(navBottom, { display: 'flex' });
		gsap.set(linkImgWrappers, {
			clipPath: (_: number, el: HTMLElement, targets: HTMLElement[]) => {
				const idx = Array.from(targets).indexOf(el);
				return idx % 2 === 0 ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)';
			}
		});

		// Open timeline
		openTl = gsap
			.timeline({ paused: true })
			.fromTo(
				navBottom,
				{ clipPath: 'inset(0 0 100% 0)' },
				{ clipPath: 'inset(0 0 0% 0)', duration: 1.25, ease: 'expo.inOut' }
			)
			.from(
				allLines,
				{
					clipPath: (_: number, el: HTMLElement, targets: HTMLElement[]) => {
						const idx = Array.from(targets).indexOf(el);
						return idx % 2 === 0
							? 'inset(1px 0% 1.15px 100%)'
							: 'inset(1px 100% 1.15px 0%)';
					},
					duration: 1.25,
					ease: 'power3.inOut'
				},
				0.25
			)
			.fromTo(
				bottomSplits.map((s) => s.chars).flat(),
				{ y: '100%' },
				{ y: '0%', duration: 1.5, ease: 'power3.inOut', stagger: 0.015 },
				0
			)
			.to(menuLines, { backgroundColor: '#1e1d1a', duration: 0.125, ease: 'power2.out' }, 0.5)
			.to(
				menuLines,
				{
					y: (_: number, el: HTMLElement, targets: HTMLElement[]) => {
						const idx = Array.from(targets).indexOf(el);
						return idx === 0 ? 4 : -5;
					},
					duration: 0.5,
					ease: 'power2.out'
				},
				0.5
			)
			.to(logoImg, { filter: 'invert(0)', duration: 0.125, ease: 'power2.out' }, 0.5);

		// Close timeline
		closeTl = gsap
			.timeline({ paused: true })
			.to(navBottom, { clipPath: 'inset(0 0 100% 0)', duration: 1.5, ease: 'expo.inOut' })
			.to(
				allLines,
				{
					clipPath: (_: number, el: HTMLElement, targets: HTMLElement[]) => {
						const idx = Array.from(targets).indexOf(el);
						return idx % 2 === 0
							? 'inset(1px 0% 1.15px 100%)'
							: 'inset(1px 100% 1.15px 0%)';
					},
					duration: 1,
					ease: 'power3.inOut'
				},
				0
			)
			.to(
				bottomSplits.map((s) => s.chars).flat(),
				{ y: '100%', duration: 1, ease: 'power3.inOut', stagger: 0.01 },
				0
			)
			.to(menuLines, { backgroundColor: 'white', duration: 0.125, ease: 'power2.out' }, '-=0.6')
			.to(menuLines, { y: 0, duration: 0.75, ease: 'power2.out' }, '-=0.6')
			.to(logoImg, { filter: 'invert(1)', duration: 0.125, ease: 'power2.out' }, '-=0.6');

		// Hover animations (desktop only)
		const isTouch = window.matchMedia('(pointer: coarse)').matches;
		if (isTouch) return;

		bottomLinks.forEach((link, index) => {
			const chars = bottomSplits[index].chars;
			if (!chars) return;
			const staggerFrom = index % 2 === 0 ? 'start' : 'end';
			const imgL = linkImgWrappers[index * 2];
			const imgR = linkImgWrappers[index * 2 + 1];
			const imgElL = linkImgs[index * 2];
			const imgElR = linkImgs[index * 2 + 1];

			const onEnter = () => {
				const tl = gsap.timeline();
				tl.to(chars, { y: '-100%', stagger: { each: 0.02, from: staggerFrom } });
				if (imgL && imgR) {
					tl.to([imgL, imgR], { clipPath: 'inset(0% 0% 0% 0%)' }, 0.2);
				}
				if (imgElL && imgElR) {
					tl.fromTo(
						[imgElL, imgElR],
						{ scale: 1.5 },
						{ scale: 1, duration: 0.75, ease: 'expo.out' },
						0.2
					);
				}
			};

			const onLeave = () => {
				const tl = gsap.timeline();
				tl.to(chars, {
					y: '0%',
					overwrite: true,
					stagger: { each: 0.02, from: staggerFrom }
				});
				if (imgL && imgR) {
					tl.to(
						[imgL, imgR],
						{
							clipPath: (_: number, el: HTMLElement) =>
								el === imgL ? 'inset(0% 0% 0% 100%)' : 'inset(0% 100% 0% 0%)'
						},
						0.2
					);
				}
				if (imgElL && imgElR) {
					tl.fromTo(
						[imgElL, imgElR],
						{ scale: 1 },
						{ scale: 1.5, duration: 0.75, ease: 'power2.out' },
						0.2
					);
				}
			};

			const row = link.closest('.nav-link-row');
			if (row) {
				row.addEventListener('mouseenter', onEnter);
				row.addEventListener('mouseleave', onLeave);
				hoverCleanups.push(() => {
					row.removeEventListener('mouseenter', onEnter);
					row.removeEventListener('mouseleave', onLeave);
				});
			}
		});
	}

	function toggleMenu() {
		if (menuOpen) {
			closeTl?.restart();
			menuOpen = false;
		} else {
			openTl?.restart();
			menuOpen = true;
		}
	}
</script>

<!-- Top bar -->
<header
	class={cn(
		'fixed top-0 right-0 left-0 z-60 transition-all duration-300',
		!menuOpen && scrolled ? 'backdrop-blur-sm' : 'bg-transparent'
	)}
	style="view-transition-name: navbar;"
>
	<div class="nav-top-wrapper mx-auto max-w-7xl px-6 lg:px-8">
		<div class="nav-top">
			<a href="/" class="nav-top-link">
				<img
					src={logo}
					alt="Aziza"
					data-nav="logo"
					class={cn('h-7 w-auto lg:h-8', isDark ? 'invert' : '')}
				/>
			</a>

			<div class="nav-top-right">
				{#if isShopRoute}
					<Button
						variant="ghost"
						size="icon"
						aria-label="Search"
						href="/shop/search"
						class={cn(
							'transition-colors duration-300',
							menuOpen ? 'text-[#1e1d1a]' : isDark ? 'text-white' : 'text-black'
						)}
					>
						<Search class="h-5 w-5" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						aria-label="Cart"
						class={cn(
							'transition-colors duration-300',
							menuOpen ? 'text-[#1e1d1a]' : isDark ? 'text-white' : 'text-black'
						)}
						onclick={onCartClick}
					>
						<div class="relative">
							<ShoppingBag />
							{#if cartCount > 0}
								<span
									class="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-foreground text-[10px] font-medium text-background"
								>
									{cartCount}
								</span>
							{/if}
						</div>
					</Button>
				{/if}

				<button
					class="nav-menu-btn"
					aria-label={menuOpen ? 'Close menu' : 'Open menu'}
					onclick={toggleMenu}
				>
					<div class="nav-menu-line top" data-nav="menu-line"></div>
					<div class="nav-menu-line bottom" data-nav="menu-line"></div>
				</button>
			</div>
		</div>
	</div>
	<div class="nav-top-line" class:nav-top-line--visible={scrolled && !menuOpen}></div>
</header>

<!-- Fullscreen overlay -->
<div class="nav-bottom-wrapper is-hidden" data-nav="bottom-wrapper">
	{#each navLinks as link, i (link.href)}
		<div class="nav-link-row">
			<div class="nav-link-img-wrapper" data-nav="link-img">
				<img src={link.imgLeft} alt="" class="nav-link-img" loading="lazy" />
			</div>
			<div class="nav-link-text-wrapper">
				<a
					href={link.href}
					class="nav-link-large"
					data-nav="bottom-link"
					data-nav-number={link.num}
					>
					{link.label}
				</a>
			</div>
			<div class="nav-link-img-wrapper" data-nav="link-img">
				<img src={link.imgRight} alt="" class="nav-link-img" loading="lazy" />
			</div>
		</div>
		{#if i < navLinks.length - 1}
			<div class="nav-bottom-line" data-nav="bottom-line"></div>
		{/if}
	{/each}
</div>

<style>
	:global(::view-transition-group(navbar)) {
		z-index: 100;
	}

	/* ── Top bar ───────────────────────────── */
	.nav-top-wrapper {
		z-index: 60;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		position: relative;
	}

	.nav-top {
		justify-content: space-between;
		align-items: center;
		width: 100%;
		padding: 1.25rem 0;
		display: flex;
		position: relative;
	}

	@media (min-width: 1024px) {
		.nav-top {
			padding: 1.5rem 0;
		}
	}

	.nav-top-link {
		z-index: 2;
		text-decoration: none;
		flex-shrink: 0;
	}

	.nav-top-right {
		z-index: 2;
		display: flex;
		align-items: center;
		gap: 0.25rem;
	}

	.nav-top-line {
		width: 100%;
		height: 1px;
		background: rgba(153, 153, 153, 0.3);
		opacity: 0;
		transition: opacity 0.3s ease;
	}

	.nav-top-line--visible {
		opacity: 1;
	}

	/* ── Hamburger button ──────────────────── */
	.nav-menu-btn {
		position: relative;
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: stretch;
		width: 1.5rem;
		height: 0.85rem;
		background: none;
		border: none;
		cursor: pointer;
		padding: 0;
		z-index: 2;
	}

	.nav-menu-btn::before {
		content: '';
		position: absolute;
		inset: -0.75rem;
	}

	.nav-menu-line {
		background-color: white;
		width: 100%;
		height: 3px;
		clip-path: inset(0.5px 0% 0.5px 0%);
		will-change: transform, background-color;
	}

	.nav-menu-line.top {
		position: absolute;
		top: 0;
	}

	.nav-menu-line.bottom {
		position: absolute;
		bottom: 0;
	}

	/* ── Bottom overlay ────────────────────── */
	.nav-bottom-wrapper {
		z-index: 55;
		background-color: #fff9ee;
		flex-flow: column;
		justify-content: space-evenly;
		align-items: stretch;
		width: 100%;
		height: 100svh;
		padding-top: 4.5rem;
		padding-bottom: 1.5rem;
		display: flex;
		position: fixed;
		inset: 0%;
		will-change: clip-path;
	}

	.nav-bottom-wrapper.is-hidden {
		display: none;
	}

	/* ── Link row ──────────────────────────── */
	.nav-link-row {
		flex: 1;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5svh;
		width: 100%;
		position: relative;
	}

	/* ── Link images ───────────────────────── */
	.nav-link-img-wrapper {
		aspect-ratio: 3 / 2;
		flex: none;
		width: 17.5svh;
		position: relative;
		overflow: hidden;
		will-change: clip-path;
	}

	.nav-link-img {
		object-fit: cover;
		width: 100%;
		height: 100%;
	}

	/* ── Link text ─────────────────────────── */
	.nav-link-text-wrapper {
		padding: 0 3svh;
		position: relative;
		overflow: hidden;
	}

	.nav-link-large {
		color: #1e1d1a;
		font-family: 'Cormorant Garamond', Georgia, serif;
		font-size: clamp(3rem, 12svh, 12svh);
		font-weight: 300;
		line-height: 1;
		text-decoration: none;
		text-transform: uppercase;
		letter-spacing: 0.02em;
		flex: none;
		position: relative;
		overflow: hidden;
		text-shadow: 0px 1em 0px oklch(0.7 0.12 75);
	}

	.nav-link-large::before {
		content: attr(data-nav-number);
		font-family: inherit;
		font-size: 0.15em;
		position: absolute;
		top: 0.7em;
		text-shadow: none;
		opacity: 0;
		transition: opacity 0.3s ease-out;
	}

	.nav-link-row:nth-child(odd) .nav-link-large::before {
		right: -1.2em;
	}

	.nav-link-row:nth-child(even) .nav-link-large::before {
		left: -1.2em;
	}

	.nav-link-row:hover .nav-link-large::before {
		opacity: 1;
	}

	/* ── Separator lines ───────────────────── */
	.nav-bottom-line {
		width: calc(100% - 2rem);
		height: 3px;
		margin: 0 auto;
		background: rgba(153, 153, 153, 0.3);
		clip-path: inset(1px 0% 1.15px 0%);
		will-change: clip-path;
	}

	/* ── Mobile ────────────────────────────── */
	@media screen and (max-width: 640px) {
		.nav-link-img-wrapper {
			display: none;
		}

		.nav-link-large {
			font-size: clamp(2.5rem, 10vw, 4rem);
		}
	}
</style>
