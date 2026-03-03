<script lang="ts">
	import logo from '$lib/assets/logo_regular.svg';
	import { Separator } from '$lib/components/ui/separator';

	const columns = [
		{
			title: 'Collections',
			links: [
				{ label: 'Bedding', href: '/collections/bedding' },
				{ label: 'Bath', href: '/collections/bath' },
				{ label: 'Living', href: '/collections/living' },
				{ label: 'New In', href: '/collections/new' }
			]
		},
		{
			title: 'Company',
			links: [
				{ label: 'About', href: '/about' },
				{ label: 'Journal', href: '/journal' },
				{ label: 'Sustainability', href: '/sustainability' },
				{ label: 'Contact', href: '/contact' }
			]
		},
		{
			title: 'Help',
			links: [
				{ label: 'Shipping & Returns', href: '/shipping' },
				{ label: 'Size Guide', href: '/size-guide' },
				{ label: 'Care Instructions', href: '/care' },
				{ label: 'FAQ', href: '/faq' }
			]
		}
	];
</script>

<footer class="bg-stone-950 text-stone-300">
	<div class="mx-auto max-w-7xl px-6 py-16 lg:px-8 lg:py-20">
		<div class="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
			<div>
				<img src={logo} alt="Aziza" class="mb-5 h-8 w-auto invert" />
				<p class="max-w-xs text-sm leading-relaxed text-stone-400">
					Thoughtfully crafted home textiles for a life well-lived.
				</p>
			</div>

			{#each columns as col (col.title)}
				<div>
					<h3 class="mb-5 text-xs font-semibold tracking-widest text-stone-200 uppercase">
						{col.title}
					</h3>
					<ul class="space-y-3">
						{#each col.links as link (link.href)}
							<li>
								<a
									href={link.href}
									class="text-sm text-stone-400 transition-colors hover:text-white"
								>
									{link.label}
								</a>
							</li>
						{/each}
					</ul>
				</div>
			{/each}
		</div>

		<Separator class="my-10 bg-stone-800" />

		<div
			class="flex flex-col items-center justify-between gap-4 text-xs text-stone-500 sm:flex-row"
		>
			<p>© 2025 Aziza. All rights reserved.</p>
			<div class="flex gap-6">
				<a href="/privacy" class="transition-colors hover:text-stone-300">Privacy Policy</a>
				<a href="/terms" class="transition-colors hover:text-stone-300">Terms of Service</a>
			</div>
		</div>
	</div>
</footer>
