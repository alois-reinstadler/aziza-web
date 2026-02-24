<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Menu, X, Search, ShoppingBag } from '@lucide/svelte';
	import logo from '$lib/assets/logo_regular.svg';
	import { scrollY } from 'svelte/reactivity/window';

	let menuOpen = $state(false);
	let scrolled = $derived(scrollY.current && scrollY.current > 60);
	let isDark = $state(true);

	$effect(() => {
		const update = () => {
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

	const navLinks = [
		{ label: 'Collections', href: '/collections' },
		{ label: 'About', href: '/about' },
		{ label: 'Journal', href: '/journal' }
	];
</script>

<header
	class="fixed top-0 right-0 left-0 z-50 transition-all duration-300 {scrolled
		? 'border-b border-border shadow-sm backdrop-blur-sm'
		: 'bg-transparent'}"
>
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="flex h-16 items-center justify-between lg:h-20">
			<a href="/" class="flex shrink-0 items-center">
				<img
					src={logo}
					alt="Aziza"
					class="h-7 w-auto transition-all duration-300 lg:h-8 {isDark ? 'invert' : ''}"
				/>
			</a>

			<nav class="hidden items-center gap-10 lg:flex">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="text-sm font-medium tracking-wide transition-colors {isDark
							? 'text-white hover:text-white'
							: 'text-black hover:text-black'}"
					>
						{link.label}
					</a>
				{/each}
			</nav>

			<div
				class="flex items-center gap-1 {isDark
					? 'text-white hover:text-white'
					: 'text-black hover:text-black'}"
			>
				<Button variant="ghost" size="icon" aria-label="Search">
					<Search />
				</Button>
				<Button variant="ghost" size="icon" aria-label="Cart">
					<ShoppingBag />
				</Button>
				<Button
					variant="ghost"
					size="icon"
					class="lg:hidden"
					aria-label="Toggle menu"
					onclick={() => (menuOpen = !menuOpen)}
				>
					{#if menuOpen}
						<X />
					{:else}
						<Menu />
					{/if}
				</Button>
			</div>
		</div>
	</div>

	{#if menuOpen}
		<div class="border-t border-border bg-white px-6 py-6 lg:hidden">
			<nav class="flex flex-col gap-5">
				{#each navLinks as link (link.href)}
					<a
						href={link.href}
						class="text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
						onclick={() => (menuOpen = false)}
					>
						{link.label}
					</a>
				{/each}
			</nav>
		</div>
	{/if}
</header>
