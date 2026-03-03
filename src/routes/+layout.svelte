<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { onNavigate } from '$app/navigation';
	import Navbar from '$lib/components/marketing/Navbar.svelte';
	import Footer from '$lib/components/marketing/Footer.svelte';
	import MagCursorGlow from '$lib/components/magazine/MagCursorGlow.svelte';
	import CartDrawer from '$lib/components/shop/CartDrawer.svelte';
	import Toaster from '$lib/components/ui/sonner/sonner.svelte';

	let { children, data } = $props();

	let cartOpen = $state(false);
	const cart = $derived(data.cart);
	const cartCount = $derived(cart?.totalQuantity ?? 0);

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;
		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300;1,400&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<ModeWatcher defaultMode="dark" />
<Toaster position="bottom-right" />

<MagCursorGlow />
<Navbar {cartCount} onCartClick={() => (cartOpen = true)} />
<CartDrawer bind:open={cartOpen} {cart} />
<div class="relative min-h-screen">
	{@render children()}
</div>
<Footer />

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
