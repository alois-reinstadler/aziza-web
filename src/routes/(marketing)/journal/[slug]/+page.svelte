<script lang="ts">
	import { page } from '$app/state';
	import { journalPosts } from '$lib/config/journal';
	import { inView } from '$lib/components/magazine/animations';

	const post = $derived(journalPosts.find((p) => p.slug === page.params.slug) ?? journalPosts[0]);

	function formatDate(dateStr: string) {
		return new Date(dateStr).toLocaleDateString('en-GB', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>{post.title} — Aziza Journal</title>
	<meta name="description" content={post.content?.intro ?? ''} />
</svelte:head>

<div class="bg-background text-foreground">
	<!-- Article Header -->
	<section data-navbar-dark class="pt-32 pb-12">
		<div class="mx-auto max-w-prose px-6">
			<span
				class="mb-3 block text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase"
			>
				{post.category}
			</span>
			<h1 class="mb-4 font-serif text-4xl font-light lg:text-5xl">{post.title}</h1>
			<time class="text-sm text-muted-foreground">{formatDate(post.date)}</time>
		</div>
	</section>

	<!-- Hero Image -->
	<section data-navbar-dark class="pb-12">
		<div class="mx-auto max-w-7xl px-6 lg:px-8">
			<div use:inView class="reveal-up overflow-hidden">
				<img src={post.image} alt={post.title} class="aspect-21/9 w-full object-cover" />
			</div>
		</div>
	</section>

	<!-- Content Body -->
	{#if post.content}
		<article data-navbar-dark class="pb-20">
			<div class="mx-auto max-w-prose px-6">
				<!-- Intro -->
				<p use:inView class="reveal-up mb-8 text-lg leading-relaxed text-foreground">
					{post.content.intro}
				</p>

				<!-- Body paragraphs -->
				{#each post.content.body as paragraph, i (i)}
					<p use:inView class="reveal-up mb-6 leading-relaxed text-muted-foreground">
						{paragraph}
					</p>

					<!-- Pull quote after second paragraph -->
					{#if i === 1 && post.content.pullQuote}
						<blockquote use:inView class="reveal-up my-10 border-l-2 border-foreground/20 pl-6">
							<p
								class="font-serif text-xl leading-snug font-light text-foreground/80 italic lg:text-2xl"
							>
								"{post.content.pullQuote}"
							</p>
						</blockquote>
					{/if}
				{/each}
			</div>
		</article>
	{/if}

	<!-- Back Link -->
	<section data-navbar-dark class="border-t border-border/30 py-12">
		<div class="mx-auto max-w-prose px-6">
			<a
				href="/journal"
				class="text-sm text-muted-foreground transition-colors hover:text-foreground"
			>
				← Back to Journal
			</a>
		</div>
	</section>
</div>

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
