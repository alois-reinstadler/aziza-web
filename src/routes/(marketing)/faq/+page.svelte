<script lang="ts">
	import * as Accordion from '$lib/components/ui/accordion';
	import { inView } from '$lib/components/magazine/animations';
	import MagNewsletter from '$lib/components/magazine/MagNewsletter.svelte';

	const categories = [
		{
			title: 'Orders & Shipping',
			items: [
				{
					q: 'How long does shipping take?',
					a: 'Standard shipping within Germany takes 2-4 business days. European orders arrive within 5-8 business days. We ship from Berlin using carbon-neutral delivery partners.'
				},
				{
					q: 'Do you ship internationally?',
					a: 'Yes, we ship to most countries in the EU and select international destinations. Shipping costs and delivery times vary by location and are calculated at checkout.'
				},
				{
					q: 'Can I track my order?',
					a: 'Absolutely. Once your order ships, you will receive an email with a tracking number and a link to follow your parcel in real time.'
				},
				{
					q: 'What are the shipping costs?',
					a: 'We offer free standard shipping on all orders over €120 within Germany. For orders below that threshold, shipping is €5.90. European shipping starts at €9.90.'
				}
			]
		},
		{
			title: 'Returns & Exchanges',
			items: [
				{
					q: 'What is your return policy?',
					a: 'We offer a 30-day return window for unused items in their original packaging. Simply contact us at hello@aziza-home.com to initiate a return, and we will send you a prepaid shipping label.'
				},
				{
					q: 'Can I exchange an item?',
					a: 'Yes. If you would like a different size or colour, get in touch and we will arrange an exchange. We recommend placing a new order right away so your preferred item is not sold out, and we will refund the original once we receive it back.'
				},
				{
					q: 'How long do refunds take?',
					a: 'Once we receive your return, refunds are processed within 5 business days. It may take an additional 2-3 days for the amount to appear on your statement, depending on your bank.'
				}
			]
		},
		{
			title: 'Product & Care',
			items: [
				{
					q: 'What materials do you use?',
					a: 'Our collections are crafted from certified organic cotton, Belgian linen, and other responsibly sourced natural fibres. Every material is chosen for its feel, durability, and environmental footprint.'
				},
				{
					q: 'How should I care for my textiles?',
					a: 'We recommend washing at 30-40°C on a gentle cycle. Avoid bleach and tumble drying when possible — line drying helps preserve the fibres and softness. Linen pieces become softer with every wash. Detailed care instructions are included with each product.'
				},
				{
					q: 'Are your products certified?',
					a: 'Yes. Our organic cotton is GOTS-certified and our linen is sourced from OEKO-TEX certified mills. We work only with suppliers who meet our strict environmental and ethical standards.'
				},
				{
					q: 'Will linen wrinkle?',
					a: 'Linen has a natural, relaxed texture — that is part of its beauty. Light creasing is normal and adds to the lived-in character. If you prefer a smoother look, a quick steam or iron on a medium setting does the trick.'
				}
			]
		},
		{
			title: 'About Aziza',
			items: [
				{
					q: 'Where are your products made?',
					a: 'Our textiles are woven at family-run mills in Portugal and Belgium, where traditional craftsmanship meets modern quality standards. We visit our production partners regularly.'
				},
				{
					q: 'Do you have a physical store?',
					a: 'We have a showroom in Berlin, open by appointment Monday through Friday, 10:00-18:00. You are welcome to come see and feel our collections in person — just drop us a line to book a visit.'
				},
				{
					q: 'Can I see your products in other stores?',
					a: 'We partner with a select number of design-led boutiques and concept stores across Europe. Contact us for a list of current stockists in your area.'
				}
			]
		}
	];
</script>

<svelte:head>
	<title>FAQ — Aziza</title>
	<meta
		name="description"
		content="Frequently asked questions about Aziza — shipping, returns, care instructions, and more."
	/>
</svelte:head>

<section data-navbar-dark class="pt-32 pb-20">
	<div class="mx-auto max-w-3xl px-6 lg:px-8">
		<!-- Header -->
		<div use:inView class="reveal-up mb-16">
			<p class="mb-3 text-xs font-medium tracking-[0.3em] text-muted-foreground uppercase">
				Help
			</p>
			<h1 class="mb-4 font-serif text-4xl font-light lg:text-5xl">
				Frequently Asked Questions
			</h1>
			<p class="max-w-lg text-muted-foreground">
				Everything you need to know about our products, shipping, and care. Can't find what you're
				looking for? <a href="/contact" class="underline hover:text-foreground">Get in touch</a>.
			</p>
		</div>

		<!-- FAQ Categories -->
		{#each categories as category, ci}
			<div use:inView class="reveal-up mb-12" style="transition-delay: {ci * 100}ms">
				<h2 class="mb-4 text-xs font-medium tracking-[0.3em] text-muted-foreground/60 uppercase">
					{category.title}
				</h2>
				<Accordion.Root type="single" class="border-t border-border/30">
					{#each category.items as item, i}
						<Accordion.Item value="{ci}-{i}" class="border-b border-border/30">
							<Accordion.Trigger class="py-5 text-left font-serif text-lg font-light">
								{item.q}
							</Accordion.Trigger>
							<Accordion.Content>
								<p class="pb-5 leading-relaxed text-muted-foreground">
									{item.a}
								</p>
							</Accordion.Content>
						</Accordion.Item>
					{/each}
				</Accordion.Root>
			</div>
		{/each}

		<!-- CTA -->
		<div use:inView class="reveal-up mt-8 border-t border-border/30 pt-12 text-center">
			<p class="mb-2 font-serif text-xl font-light">Still have questions?</p>
			<p class="mb-6 text-sm text-muted-foreground">
				We're happy to help — reach out any time.
			</p>
			<a
				href="/contact"
				class="inline-block border border-foreground px-8 py-3 text-xs tracking-wide transition-colors hover:bg-foreground hover:text-background"
			>
				Contact Us
			</a>
		</div>
	</div>
</section>

<!-- Newsletter -->
<MagNewsletter />

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
