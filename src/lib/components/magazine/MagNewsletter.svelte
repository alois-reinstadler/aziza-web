<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { inView, splitChars } from './animations';

	let email = $state('');
	let submitted = $state(false);

	const headline = splitChars('Join the Circle');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitted = true;
		email = '';
	}
</script>

<section class="light bg-background py-32 lg:py-48">
	<div class="mx-auto max-w-2xl px-6 text-center lg:px-8">
		<!-- Letter-by-letter headline -->
		<h2
			use:inView
			class="headline-container mb-6 font-serif text-[8vw] leading-[0.9] font-light text-foreground lg:text-[5vw]"
		>
			{#each headline as { char, index }}
				<span class="headline-char inline-block" style="transition-delay: {index * 40}ms"
					>{char === ' ' ? '\u00A0' : char}</span
				>
			{/each}
		</h2>

		<p
			use:inView
			class="reveal-up mx-auto mb-12 max-w-md text-base leading-relaxed text-muted-foreground"
		>
			Be the first to hear about new collections, exclusive offers, and stories from behind the
			loom.
		</p>

		{#if submitted}
			<p class="font-serif text-2xl font-light text-foreground italic">Thank you for joining.</p>
		{:else}
			<form
				onsubmit={handleSubmit}
				use:inView={{ threshold: 0.3 }}
				class="reveal-up mx-auto flex max-w-md flex-col gap-3 sm:flex-row"
			>
				<Input
					type="email"
					placeholder="Your email address"
					bind:value={email}
					required
					class="flex-1 rounded-none border-foreground/20 focus-visible:border-foreground/60"
				/>
				<Button type="submit" class="shrink-0 rounded-none px-8 text-sm tracking-wide">
					Subscribe
				</Button>
			</form>
			<p class="mt-4 text-xs text-muted-foreground/50">No spam. Unsubscribe at any time.</p>
		{/if}
	</div>
</section>

<style>
	.headline-char {
		opacity: 0;
		transform: translateY(20px);
		transition:
			opacity 500ms ease-out,
			transform 500ms ease-out;
	}
	.headline-container:global(.in-view) .headline-char {
		opacity: 1;
		transform: translateY(0);
	}

	.reveal-up {
		opacity: 0;
		transform: translateY(30px);
		transition:
			opacity 600ms ease-out,
			transform 600ms ease-out;
	}
	.reveal-up:global(.in-view) {
		opacity: 1;
		transform: translateY(0);
	}
</style>
