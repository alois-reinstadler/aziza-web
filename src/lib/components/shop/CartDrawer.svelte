<script lang="ts">
	import {
		Drawer,
		DrawerContent,
		DrawerHeader,
		DrawerTitle,
		DrawerFooter,
		DrawerClose
	} from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import { Minus, Plus, X } from '@lucide/svelte';
	import { invalidateAll } from '$app/navigation';
	import type { ShopifyCart } from '$lib/types/shopify';

	type Props = {
		open: boolean;
		cart: ShopifyCart | null;
	};

	let { open = $bindable(false), cart }: Props = $props();

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

<Drawer bind:open>
	<DrawerContent>
		<DrawerHeader class="text-left">
			<DrawerTitle class="font-serif text-xl font-light">Your Cart</DrawerTitle>
		</DrawerHeader>

		<div class="px-4 pb-4">
			{#if !cart || cart.lines.nodes.length === 0}
				<div class="py-12 text-center">
					<p class="mb-4 text-muted-foreground">Your cart is empty</p>
					<DrawerClose>
						<a href="/shop">
							<Button variant="outline" class="rounded-none text-sm tracking-wide">
								Continue Shopping
							</Button>
						</a>
					</DrawerClose>
				</div>
			{:else}
				<div class="max-h-[50vh] space-y-4 overflow-y-auto">
					{#each cart.lines.nodes as line (line.id)}
						<div class="flex gap-4 border-b border-border/30 pb-4">
							<!-- Product image -->
							{#if line.merchandise.product.featuredImage}
								<a href="/shop/{line.merchandise.product.handle}" class="shrink-0">
									<img
										src={line.merchandise.product.featuredImage.url}
										alt={line.merchandise.product.title}
										class="h-20 w-16 object-cover"
									/>
								</a>
							{/if}

							<!-- Details -->
							<div class="flex flex-1 flex-col">
								<div class="flex items-start justify-between">
									<div>
										<a
											href="/shop/{line.merchandise.product.handle}"
											class="text-sm font-medium hover:underline"
										>
											{line.merchandise.product.title}
										</a>
										{#if line.merchandise.title !== 'Default Title'}
											<p class="text-xs text-muted-foreground">
												{line.merchandise.title}
											</p>
										{/if}
									</div>
									<button
										onclick={() => removeLine(line.id)}
										class="text-muted-foreground/60 hover:text-foreground"
										disabled={loading}
										aria-label="Remove item"
									>
										<X class="h-4 w-4" />
									</button>
								</div>

								<div class="mt-auto flex items-center justify-between pt-2">
									<!-- Quantity controls -->
									<div class="flex items-center gap-2">
										<button
											onclick={() => updateQuantity(line.id, line.quantity - 1)}
											class="flex h-7 w-7 items-center justify-center border border-border text-xs hover:bg-muted"
											disabled={loading}
											aria-label="Decrease quantity"
										>
											<Minus class="h-3 w-3" />
										</button>
										<span class="w-6 text-center text-sm">{line.quantity}</span>
										<button
											onclick={() => updateQuantity(line.id, line.quantity + 1)}
											class="flex h-7 w-7 items-center justify-center border border-border text-xs hover:bg-muted"
											disabled={loading}
											aria-label="Increase quantity"
										>
											<Plus class="h-3 w-3" />
										</button>
									</div>

									<span class="text-sm">
										{formatMoney(line.cost.totalAmount.amount)}
									</span>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<DrawerFooter class="px-0">
					<div class="flex items-center justify-between border-t border-border/30 pt-4">
						<span class="text-sm text-muted-foreground">Subtotal</span>
						<span class="font-serif text-lg font-light">
							{formatMoney(cart.cost.subtotalAmount.amount)}
						</span>
					</div>
					<p class="text-xs text-muted-foreground/60">
						Shipping calculated at checkout
					</p>
					<a href={cart.checkoutUrl} class="block">
						<Button class="w-full rounded-none text-sm tracking-wide">
							Proceed to Checkout
						</Button>
					</a>
				</DrawerFooter>
			{/if}
		</div>
	</DrawerContent>
</Drawer>
