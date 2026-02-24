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

<section data-navbar-dark class="relative py-24 lg:py-36 overflow-hidden">
	<div class="absolute inset-0">
		<img src={bgImage} alt="" class="w-full h-full object-cover" aria-hidden="true" />
		<div class="absolute inset-0 bg-stone-950/82"></div>
	</div>

	<div class="relative z-10 max-w-xl mx-auto px-6 lg:px-8 text-center">
		<p class="text-xs font-medium tracking-[0.3em] uppercase text-stone-400 mb-4">
			Stay Connected
		</p>
		<h2 class="font-serif text-3xl lg:text-5xl font-light text-white mb-5">
			Join the Aziza Circle
		</h2>
		<p class="text-stone-400 leading-relaxed mb-10">
			Be the first to hear about new collections, exclusive offers, and stories from behind the loom.
		</p>

		{#if submitted}
			<p class="font-serif text-xl font-light text-white italic">Thank you for joining.</p>
		{:else}
			<form onsubmit={handleSubmit} class="flex flex-col sm:flex-row gap-3">
				<Input
					type="email"
					placeholder="Your email address"
					bind:value={email}
					required
					class="rounded-none bg-white/5 border-white/20 text-white placeholder:text-stone-500 focus-visible:border-white/60 flex-1"
				/>
				<Button
					type="submit"
					class="rounded-none px-8 bg-white text-stone-950 hover:bg-stone-100 shrink-0 text-sm tracking-wide"
				>
					Subscribe
				</Button>
			</form>
			<p class="text-xs text-stone-600 mt-4">No spam. Unsubscribe at any time.</p>
		{/if}
	</div>
</section>
