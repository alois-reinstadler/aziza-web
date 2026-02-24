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
