<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { inView, splitChars } from './animations';
	import circleImg from '$lib/assets/lookbook/cozy-corner.jpg';

	let email = $state('');
	let submitted = $state(false);

	const headline = splitChars('Join the Circle');

	function handleSubmit(e: SubmitEvent) {
		e.preventDefault();
		submitted = true;
		email = '';
	}
</script>

<section class="light relative overflow-hidden bg-background py-32 lg:py-48">
	<div class="relative z-10 mx-auto max-w-7xl px-6 lg:px-8">
		<div class="newsletter-grid">
		<div class="max-w-lg">
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
				class="reveal-up mb-12 max-w-md text-base leading-relaxed text-muted-foreground"
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
					class="reveal-up flex max-w-md flex-col gap-3 sm:flex-row"
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

		<!-- Circle with image -->
		<div class="circle-wrap" aria-hidden="true">
			<div class="circle-spinner">
				<svg viewBox="0 0 200 200">
					<defs>
						<path
							id="circle-path"
							d="M100,100 m-85,0 a85,85 0 1,1 170,0 a85,85 0 1,1 -170,0"
							fill="none"
						/>
					</defs>
					<text>
						<textPath href="#circle-path">
							AZIZA · AZIZA · AZIZA · AZIZA · AZIZA · AZIZA · AZIZA · AZIZA · AZIZA · AZIZA ·{' '}
						</textPath>
					</text>
				</svg>
			</div>
			<div class="circle-image">
				<img src={circleImg} alt="" />
			</div>
		</div>
		</div>
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

	.newsletter-grid {
		display: flex;
		flex-direction: column;
		align-items: flex-start;
		gap: 3rem;
	}

	@media (min-width: 1024px) {
		.newsletter-grid {
			flex-direction: row;
			align-items: center;
			justify-content: space-between;
		}
	}

	.circle-wrap {
		position: relative;
		width: clamp(280px, 40vw, 420px);
		height: clamp(280px, 40vw, 420px);
		flex-shrink: 0;
		align-self: center;
	}

	.circle-spinner {
		position: absolute;
		inset: 0;
		animation: spin 20s linear infinite;
	}

	.circle-spinner svg {
		width: 100%;
		height: 100%;
	}

	.circle-spinner text {
		fill: black;
		font-size: 11px;
		letter-spacing: 0.3em;
		text-transform: uppercase;
		font-family: sans-serif;
	}

	.circle-image {
		position: absolute;
		inset: 15%;
		border-radius: 50%;
		overflow: hidden;
	}

	.circle-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
	}

	@keyframes spin {
		to {
			transform: rotate(360deg);
		}
	}
</style>
