<script lang="ts">
	import Check from '@lucide/svelte/icons/check';

	let { title, image }: { title: string; image: string | null } = $props();
</script>

<div class="flex items-center gap-4 border border-border bg-background p-3">
	{#if image}
		<img src={image} alt={title} class="h-16 w-12 shrink-0 object-cover" />
	{/if}
	<div class="min-w-0 flex-1">
		<p class="mb-1 flex items-center gap-1.5 text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
			<Check class="size-3" />
			Added to cart
		</p>
		<p class="truncate text-sm">{title}</p>
	</div>
</div>
