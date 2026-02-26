<script lang="ts">
	let x = $state(0);
	let y = $state(0);
	let visible = $state(false);

	function handleMove(e: MouseEvent) {
		x = e.clientX;
		y = e.clientY;
		if (!visible) visible = true;
	}

	function handleLeave() {
		visible = false;
	}
</script>

<svelte:window onmousemove={handleMove} onmouseleave={handleLeave} />

<div
	class="pointer-events-none fixed inset-0 z-50 hidden transition-opacity duration-500 lg:block"
	style="opacity: {visible ? 1 : 0}"
	aria-hidden="true"
>
	<div
		class="absolute h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full"
		style="
			left: {x}px;
			top: {y}px;
			background: radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%);
		"
	></div>
</div>
