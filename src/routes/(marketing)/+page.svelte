<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import MagHero from '$lib/components/magazine/MagHero.svelte';
	import MagLogoReveal from '$lib/components/magazine/MagLogoReveal.svelte';
	import MagEditorialSpread from '$lib/components/magazine/MagEditorialSpread.svelte';
	import MagBentoGrid from '$lib/components/magazine/MagBentoGrid.svelte';
	import MagCraftStrip from '$lib/components/magazine/MagCraftStrip.svelte';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';
	import MagMarquee from '$lib/components/magazine/MagMarquee.svelte';
</script>

<svelte:head>
	<title>Aziza — Home Textiles</title>
	<meta name="description" content="Thoughtfully crafted home textiles for modern living." />
</svelte:head>

<SsgoiTransition id="/">
	<MagHero />
	<MagMarquee />
	<MagEditorialSpread />
	<MagLogoReveal />
	<MagBentoGrid />
	<MagMarquee
		items={['Handcrafted', 'Organic Cotton', 'Belgian Linen', 'GOTS Certified', 'Made in Europe']}
		speed={25}
	/>
	<MagCraftStrip />
	<MagNewsletter />
</SsgoiTransition>
