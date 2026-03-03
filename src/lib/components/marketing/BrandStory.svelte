<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	import mainImage from '$lib/assets/stock-images/AdobeStock_1710340739.webp';
	import accentImage from '$lib/assets/stock-images/AdobeStock_1705702729.webp';
</script>

<section class="light overflow-hidden bg-background py-20 lg:py-28">
	<div class="mx-auto max-w-7xl px-6 lg:px-8">
		<div class="grid grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-24">
			<div class="relative">
				<div class="aspect-4/5 overflow-hidden">
					<img src={mainImage} alt="Aziza — warmth and craft" class="h-full w-full object-cover" />
				</div>
				<div
					class="absolute -right-5 -bottom-5 hidden h-44 w-44 overflow-hidden border-[5px] border-stone-50 shadow-lg lg:block"
				>
					<img src={accentImage} alt="Botanical detail" class="h-full w-full object-cover" />
				</div>
			</div>

			<div class="lg:pl-4">
				<p class="mb-4 text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
					Our Story
				</p>
				<h2 class="mb-6 font-serif text-3xl leading-[1.1] font-light text-foreground lg:text-5xl">
					Crafted with<br />intention,<br />designed to last
				</h2>
				<p class="mb-4 leading-relaxed text-muted-foreground">
					Aziza was born from a deep belief that the home should feel like a sanctuary — a place of
					warmth, calm, and quiet beauty. We work with skilled mills and responsible suppliers to
					bring that vision to life in every thread.
				</p>
				<p class="mb-8 leading-relaxed text-muted-foreground">
					Our collections draw on botanical heritage and artisan craft, balancing timeless design
					with the demands of modern living. Every piece is made to be lived in and loved for years
					to come.
				</p>
				<Button href="/about" class="rounded-none px-8 text-sm tracking-wide">
					Read Our Story
				</Button>
			</div>
		</div>
	</div>
</section>
