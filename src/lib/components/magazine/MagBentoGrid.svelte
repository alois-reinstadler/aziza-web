<script lang="ts">
	import { inView } from './animations';
	import { collections } from '$lib/config/collections';

	const layoutClasses = [
		'col-span-2 row-span-2',
		'col-span-1 row-span-1',
		'col-span-1 row-span-1',
		'col-span-2 row-span-1'
	];
	const aspectClasses = ['aspect-square', 'aspect-3/4', 'aspect-3/4', 'aspect-[2/1]'];
</script>

<section data-navbar-dark class="py-24 lg:py-32">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="mb-12 flex items-end justify-between">
			<div use:inView class="reveal-up">
				<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
					Collections
				</p>
				<h2 class="font-serif text-3xl font-light lg:text-5xl">The Edit</h2>
			</div>
			<a
				href="/collections"
				use:inView
				class="reveal-up hidden text-sm text-muted-foreground underline-offset-4 hover:underline sm:inline"
			>
				View all
			</a>
		</div>

		<div class="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
			{#each collections as col, i (col.id)}
				<a
					href={col.href}
					use:inView={{ threshold: 0.1 }}
					class="bento-tile group relative block overflow-hidden {layoutClasses[i]}"
					style="transition-delay: {i * 100}ms"
				>
					<div class="relative h-full w-full overflow-hidden {aspectClasses[i]}">
						<img
							src={col.images.hero}
							alt={col.label}
							class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
						/>
						<div
							class="absolute inset-0 bg-black/20 transition-colors duration-500 group-hover:bg-black/40"
						></div>

						<span
							class="absolute top-4 left-4 text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase"
						>
							{col.tag}
						</span>

						<div class="absolute inset-x-0 bottom-0 p-4 lg:p-6">
							<h3
								class="font-serif text-xl font-light text-white lg:text-2xl {i === 0
									? 'lg:text-3xl'
									: ''}"
							>
								{col.label}
							</h3>
							<p
								class="mt-2 max-w-xs text-sm text-white/0 transition-colors duration-500 group-hover:text-white/70"
							>
								{col.description}
							</p>
						</div>
					</div>
				</a>
			{/each}
		</div>
	</div>
</section>

<style>
	.bento-tile {
		opacity: 0;
		transform: scale(0.95);
		transition:
			opacity 600ms ease-out,
			transform 600ms ease-out;
	}
	.bento-tile:global(.in-view) {
		opacity: 1;
		transform: scale(1);
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
