<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import { Button } from '$lib/components/ui/button';
	import { inView } from '$lib/components/magazine/animations';

	let name = $state('');
	let email = $state('');
	let subject = $state('');
	let message = $state('');
	let submitted = $state(false);
</script>

<svelte:head>
	<title>Contact — Aziza</title>
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<!-- Header -->
		<div>
			<p class="text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">Contact</p>
			<h1 class="mb-4 font-serif text-4xl font-light lg:text-5xl">Get in Touch</h1>
			<p class="mb-16 max-w-lg text-muted-foreground">
				We'd love to hear from you. Whether you have a question about our collections, need styling
				advice, or want to visit our showroom.
			</p>
		</div>

		<!-- Two-column grid -->
		<div class="grid grid-cols-1 gap-16 lg:grid-cols-2">
			<!-- Left column — Contact form -->
			<div class="reveal-up" use:inView>
				{#if submitted}
					<p class="text-sm text-muted-foreground">
						Thank you for your message. We'll be in touch shortly.
					</p>
				{:else}
					<form
						class="space-y-6"
						onsubmit={(e) => {
							e.preventDefault();
							submitted = true;
						}}
					>
						<div>
							<label class="mb-2 block text-sm font-medium" for="name">Name</label>
							<Input id="name" type="text" bind:value={name} required />
						</div>
						<div>
							<label class="mb-2 block text-sm font-medium" for="email">Email</label>
							<Input id="email" type="email" bind:value={email} required />
						</div>
						<div>
							<label class="mb-2 block text-sm font-medium" for="subject">Subject</label>
							<Input id="subject" type="text" bind:value={subject} required />
						</div>
						<div>
							<label class="mb-2 block text-sm font-medium" for="message">Message</label>
							<textarea
								id="message"
								class="min-h-[150px] w-full rounded-none border border-foreground/20 bg-transparent px-3 py-2 text-sm focus:border-foreground/60 focus:outline-none"
								bind:value={message}
								required
							></textarea>
						</div>
						<Button type="submit" class="rounded-none px-8 text-sm tracking-wide"
							>Send Message</Button
						>
					</form>
				{/if}
			</div>

			<!-- Right column — Contact info -->
			<div class="reveal-up space-y-8" use:inView>
				<div>
					<h3 class="mb-2 text-sm font-medium">Email</h3>
					<a
						href="mailto:hello@aziza-home.com"
						class="text-sm text-muted-foreground hover:underline"
					>
						hello@aziza-home.com
					</a>
				</div>

				<div>
					<h3 class="mb-2 text-sm font-medium">Visit Us</h3>
					<p class="text-sm text-muted-foreground">
						Aziza Home GmbH<br />
						Musterstra&szlig;e 42<br />
						10115 Berlin, Germany
					</p>
				</div>

				<div>
					<h3 class="mb-2 text-sm font-medium">Follow Us</h3>
					<div class="space-y-1">
						<a href="#" class="block text-sm text-muted-foreground hover:underline">Instagram</a>
						<a href="#" class="block text-sm text-muted-foreground hover:underline">Pinterest</a>
					</div>
				</div>

				<div>
					<h3 class="mb-2 text-sm font-medium">Showroom</h3>
					<p class="text-sm text-muted-foreground">
						Open by appointment<br />
						Monday – Friday, 10:00 – 18:00
					</p>
				</div>
			</div>
		</div>
	</div>
</section>

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
