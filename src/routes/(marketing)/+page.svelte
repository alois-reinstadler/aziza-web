<script lang="ts">
	import { SsgoiTransition } from '@ssgoi/svelte';
	import HeroSection from '$lib/components/marketing/HeroSection.svelte';
	import CollectionsSection from '$lib/components/marketing/CollectionsSection.svelte';
	import BrandStory from '$lib/components/marketing/BrandStory.svelte';
	import ValuesSection from '$lib/components/marketing/ValuesSection.svelte';
	import NewsletterSection from '$lib/components/marketing/NewsletterSection.svelte';
</script>

<svelte:head>
	<title>Aziza — Home Textiles</title>
	<meta name="description" content="Thoughtfully crafted home textiles for modern living." />
</svelte:head>

<SsgoiTransition id="/">
	<HeroSection />
	<CollectionsSection />
	<BrandStory />
	<ValuesSection />
	<NewsletterSection />
</SsgoiTransition>
