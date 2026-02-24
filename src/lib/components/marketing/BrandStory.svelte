<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import mainImage from '$lib/assets/stock-images/AdobeStock_1710340739.webp';
	import accentImage from '$lib/assets/stock-images/AdobeStock_1705702729.webp';
</script>

<section class="py-20 lg:py-28 bg-stone-50 overflow-hidden">
	<div class="max-w-7xl mx-auto px-6 lg:px-8">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
			<div class="relative">
				<div class="aspect-[4/5] overflow-hidden">
					<img
						src={mainImage}
						alt="Aziza — warmth and craft"
						class="w-full h-full object-cover"
					/>
				</div>
				<div
					class="absolute -bottom-5 -right-5 w-44 h-44 overflow-hidden border-[5px] border-stone-50 hidden lg:block shadow-lg"
				>
					<img src={accentImage} alt="Botanical detail" class="w-full h-full object-cover" />
				</div>
			</div>

			<div class="lg:pl-4">
				<p class="text-xs font-medium tracking-[0.2em] uppercase text-muted-foreground mb-4">
					Our Story
				</p>
				<h2 class="font-serif text-3xl lg:text-5xl font-light leading-[1.1] mb-6">
					Crafted with<br />intention,<br />designed to last
				</h2>
				<p class="text-muted-foreground leading-relaxed mb-4">
					Aziza was born from a deep belief that the home should feel like a sanctuary — a place of
					warmth, calm, and quiet beauty. We work with skilled mills and responsible suppliers to
					bring that vision to life in every thread.
				</p>
				<p class="text-muted-foreground leading-relaxed mb-8">
					Our collections draw on botanical heritage and artisan craft, balancing timeless design
					with the demands of modern living. Every piece is made to be lived in and loved for years
					to come.
				</p>
				<Button href="/about" variant="outline" class="rounded-none px-8 text-sm tracking-wide">
					Read Our Story
				</Button>
			</div>
		</div>
	</div>
</section>
