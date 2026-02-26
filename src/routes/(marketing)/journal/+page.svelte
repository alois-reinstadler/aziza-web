<script lang="ts">
	import { inView } from '$lib/components/magazine/animations';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';
	import { journalPosts } from '$lib/config/journal';

	const featured = journalPosts.find((p) => p.featured) ?? journalPosts[0];
	const rest = journalPosts.filter((p) => p !== featured);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Journal — Aziza</title>
	<meta
		name="description"
		content="Stories from behind the loom — lookbooks, styling guides, and the craft behind Aziza."
	/>
</svelte:head>

<!-- Header -->
<section data-navbar-dark class="pt-32 pb-12">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<p
			use:inView
			class="reveal-up mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase"
		>
			Stories & Inspiration
		</p>
		<h1 use:inView class="reveal-up mb-4 font-serif text-4xl font-light lg:text-5xl">Journal</h1>
		<p use:inView class="reveal-up max-w-lg text-muted-foreground">
			Lookbooks, behind-the-scenes stories, and styling guides — from behind the loom.
		</p>
	</div>
</section>

<!-- Featured Post -->
<section data-navbar-dark class="pb-16">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<a href="/journal/{featured.slug}" class="group block" use:inView>
			<div class="reveal-up relative overflow-hidden">
				<div class="aspect-21/9 overflow-hidden">
					<img
						src={featured.image}
						alt={featured.title}
						class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
					/>
				</div>
				<div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent"></div>
				<div class="absolute bottom-0 left-0 p-6 lg:p-10">
					<span
						class="mb-2 inline-block text-xs font-medium tracking-[0.2em] text-white/60 uppercase"
					>
						{featured.category}
					</span>
					<h2 class="mb-2 font-serif text-3xl font-light text-white lg:text-4xl">
						{featured.title}
					</h2>
					<time class="text-sm text-white/50">{formatDate(featured.date)}</time>
				</div>
			</div>
		</a>
	</div>
</section>

<!-- Post Grid -->
<section data-navbar-dark class="pb-24">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:gap-12">
			{#each rest as post, i (post.slug)}
				<a href="/journal/{post.slug}" class="group block" use:inView>
					<div class="reveal-up" style="transition-delay: {i * 120}ms">
						<div class="mb-4 overflow-hidden">
							<img
								src={post.image}
								alt={post.title}
								class="aspect-3/4 w-full object-cover transition-transform duration-700 group-hover:scale-105"
							/>
						</div>
						<span
							class="mb-1 block text-xs font-medium tracking-[0.2em] text-muted-foreground/60 uppercase"
						>
							{post.category}
						</span>
						<h3 class="mb-1 font-serif text-xl font-light">{post.title}</h3>
						<time class="text-xs text-muted-foreground">{formatDate(post.date)}</time>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<!-- Newsletter -->
<MagNewsletter />

<style>
	.reveal-up {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 700ms ease-out,
			transform 700ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}
</style>
