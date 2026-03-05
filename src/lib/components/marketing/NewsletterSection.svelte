<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import bgImage from '$lib/assets/stock-images/AdobeStock_1868479109.webp';

	let email = $state('');
	let submitted = $state(false);

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitted = true;
		email = '';
	}
</script>

<section data-navbar-dark class="relative overflow-hidden py-24 lg:py-36">
	<div class="absolute inset-0">
		<img src={bgImage} alt="" class="h-full w-full object-cover" aria-hidden="true" />
		<div class="absolute inset-0 bg-stone-950/82"></div>
	</div>

	<div class="relative z-10 mx-auto max-w-xl px-6 text-center lg:px-8">
		<p class="mb-4 text-xs font-medium tracking-[0.3em] text-stone-400 uppercase">Stay Connected</p>
		<h2 class="mb-5 font-serif text-3xl font-light text-white lg:text-5xl">
			Join the Aziza Circle
		</h2>
		<p class="mb-10 leading-relaxed text-stone-400">
			Be the first to hear about new collections, exclusive offers, and stories from behind the
			loom.
		</p>

		{#if submitted}
			<p class="font-serif text-xl font-light text-white italic">Thank you for joining.</p>
		{:else}
			<form onsubmit={handleSubmit} class="flex flex-col gap-3 sm:flex-row">
				<Input
					type="email"
					placeholder="Your email address"
					bind:value={email}
					required
					class="flex-1 rounded-none border-white/20 bg-white/5 text-white placeholder:text-stone-500 focus-visible:border-white/60"
				/>
				<Button
					type="submit"
					class="shrink-0 rounded-none bg-white px-8 text-sm tracking-wide text-stone-950 hover:bg-stone-100"
				>
					Subscribe
				</Button>
			</form>
			<p class="mt-4 text-xs text-stone-600">No spam. Unsubscribe at any time.</p>
		{/if}
	</div>
</section>

