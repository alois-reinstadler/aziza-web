<script lang="ts">
	import { page } from '$app/state';
	import { locales, localizeHref } from '$lib/paraglide/runtime';
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import { Ssgoi, type SsgoiConfig } from '@ssgoi/svelte';
	import { drill, fade, hero } from '@ssgoi/svelte/view-transitions';
	import Navbar from '$lib/components/marketing/Navbar.svelte';
	import Footer from '$lib/components/marketing/Footer.svelte';
	import MagCursorGlow from '$lib/components/magazine/MagCursorGlow.svelte';

	let { children } = $props();

	const config = {
		transitions: [
			{
				from: '/',
				to: '/collections/*',
				transition: hero(),
				symmetric: true
			}
		],
		defaultTransition: fade()
	} satisfies SsgoiConfig;
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

<MagCursorGlow />
<Navbar />
<Ssgoi {config}>
	<div class="relative min-h-screen">
		{@render children()}
	</div>
</Ssgoi>
<Footer />

<div style="display:none">
	{#each locales as locale}
		<a href={localizeHref(page.url.pathname, { locale })}>{locale}</a>
	{/each}
</div>
