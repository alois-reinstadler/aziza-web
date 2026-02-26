<script lang="ts">
	import type { Snippet } from 'svelte';

	type Props = { title: string; children: Snippet };
	let { title, children }: Props = $props();
</script>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-prose px-6">
		<h1 class="mb-12 font-serif text-4xl font-light lg:text-5xl">{title}</h1>
		<div class="space-y-6 leading-relaxed text-muted-foreground">
			{@render children()}
		</div>
	</div>
</section>
