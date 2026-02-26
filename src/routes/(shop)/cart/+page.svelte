<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { inView } from '$lib/components/magazine/animations';
	import { invalidateAll } from '$app/navigation';
	import { Minus, Plus, X } from '@lucide/svelte';

	let { data } = $props();

	const cart = $derived(data.cart);
	let loading = $state(false);

	function formatMoney(amount: string) {
		return `€${parseFloat(amount).toFixed(2)}`;
	}

	async function updateQuantity(lineId: string, quantity: number) {
		loading = true;
		try {
			await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					action: quantity === 0 ? 'remove' : 'update',
					lineId,
					quantity
				})
			});
			await invalidateAll();
		} finally {
			loading = false;
		}
	}

	async function removeLine(lineId: string) {
		loading = true;
		try {
			await fetch('/api/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ action: 'remove', lineId })
			});
			await invalidateAll();
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>Cart — Aziza</title>
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-3xl px-6 lg:px-8">
		<h1 use:inView class="reveal-up mb-12 font-serif text-4xl font-light lg:text-5xl">Your Cart</h1>

		{#if !cart || cart.lines.nodes.length === 0}
			<div use:inView class="reveal-up py-20 text-center">
				<p class="mb-6 text-muted-foreground">Your cart is empty</p>
				<a href="/shop">
					<Button variant="outline" class="rounded-none text-sm tracking-wide">
						Continue Shopping
					</Button>
				</a>
			</div>
		{:else}
			<div use:inView class="reveal-up">
				<!-- Line items -->
				<div class="divide-y divide-border/30">
					{#each cart.lines.nodes as line (line.id)}
						<div class="flex gap-6 py-6">
							{#if line.merchandise.product.featuredImage}
								<a href="/shop/{line.merchandise.product.handle}" class="shrink-0">
									<img
										src={line.merchandise.product.featuredImage.url}
										alt={line.merchandise.product.title}
										class="h-32 w-24 object-cover"
									/>
								</a>
							{/if}

							<div class="flex flex-1 flex-col">
								<div class="flex items-start justify-between">
									<div>
										<a
											href="/shop/{line.merchandise.product.handle}"
											class="font-serif text-lg font-light hover:underline"
										>
											{line.merchandise.product.title}
										</a>
										{#if line.merchandise.title !== 'Default Title'}
											<p class="mt-1 text-sm text-muted-foreground">
												{line.merchandise.title}
											</p>
										{/if}
									</div>
									<button
										onclick={() => removeLine(line.id)}
										class="text-muted-foreground/60 hover:text-foreground"
										disabled={loading}
										aria-label="Remove {line.merchandise.product.title}"
									>
										<X class="h-4 w-4" />
									</button>
								</div>

								<div class="mt-auto flex items-center justify-between pt-4">
									<div class="flex items-center gap-3">
										<button
											onclick={() => updateQuantity(line.id, line.quantity - 1)}
											class="flex h-9 w-9 items-center justify-center border border-border hover:bg-muted"
											disabled={loading}
											aria-label="Decrease quantity"
										>
											<Minus class="h-4 w-4" />
										</button>
										<span class="w-8 text-center">{line.quantity}</span>
										<button
											onclick={() => updateQuantity(line.id, line.quantity + 1)}
											class="flex h-9 w-9 items-center justify-center border border-border hover:bg-muted"
											disabled={loading}
											aria-label="Increase quantity"
										>
											<Plus class="h-4 w-4" />
										</button>
									</div>

									<span class="font-serif text-lg font-light">
										{formatMoney(line.cost.totalAmount.amount)}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Summary -->
				<div class="mt-8 border-t border-border pt-8">
					<div class="flex items-center justify-between">
						<span class="text-muted-foreground">Subtotal</span>
						<span class="font-serif text-2xl font-light">
							{formatMoney(cart.cost.subtotalAmount.amount)}
						</span>
					</div>
					<p class="mt-2 text-sm text-muted-foreground/60">
						Shipping and taxes calculated at checkout
					</p>

					<div class="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
						<a href="/shop">
							<Button
								variant="outline"
								class="w-full rounded-none text-sm tracking-wide sm:w-auto sm:px-10"
							>
								Continue Shopping
							</Button>
						</a>
						<a href={cart.checkoutUrl}>
							<Button class="w-full rounded-none py-6 text-sm tracking-wide sm:w-auto sm:px-16">
								Proceed to Checkout
							</Button>
						</a>
					</div>
				</div>
			</div>
		{/if}
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
