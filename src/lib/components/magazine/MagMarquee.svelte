<script lang="ts">
	type Props = {
		items?: string[];
		speed?: number;
		separator?: string;
		class?: string;
	};

	let {
		items = [
			'Spring Collection 2025',
			'Now Available',
			'Free Shipping Over €100',
			'Organic & Sustainable',
			'Crafted in Europe'
		],
		speed = 30,
		separator = '—',
		class: className = ''
	}: Props = $props();

	// Duplicate items enough times to fill the screen and loop seamlessly
	const repeated = [...items, ...items, ...items, ...items];
</script>

<div
	class="overflow-hidden border-y border-border/20 py-4 select-none {className}"
	aria-hidden="true"
>
	<div class="marquee-track flex whitespace-nowrap" style="--speed: {speed}s">
		{#each repeated as item, i (i)}
			<span class="mx-6 text-xs font-medium tracking-[0.25em] text-muted-foreground/60 uppercase">
				{item}
			</span>
			<span class="mx-6 text-muted-foreground/30">{separator}</span>
		{/each}
	</div>
</div>

<style>
	.marquee-track {
		animation: marquee var(--speed, 30s) linear infinite;
		width: max-content;
	}

	@keyframes marquee {
		from {
			transform: translateX(0);
		}
		to {
			transform: translateX(-25%);
		}
	}

	/* Pause on hover for accessibility */
	div:hover .marquee-track {
		animation-play-state: paused;
	}
</style>
