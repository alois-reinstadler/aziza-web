import imperialBloomHero from '$lib/assets/collections/collection-01-xl.webp';
import imperialBloomThumbnail from '$lib/assets/collections/collection-01.webp';

import maisonJardinHero from '$lib/assets/collections/collection-02-xl.webp';
import maisonJardinThumbnail from '$lib/assets/collections/collection-02.webp';

import alpineHeritageHero from '$lib/assets/collections/collection-03-xl.webp';
import alpineHeritageThumbnail from '$lib/assets/collections/collection-03.webp';

import azizaAtelierHero from '$lib/assets/collections/collection-04-xl.webp';
import azizaAtelierThumbnail from '$lib/assets/collections/collection-04.webp';

import prod1 from '$lib/assets/stock-images/AdobeStock_1632366276.webp';
import prod2 from '$lib/assets/stock-images/AdobeStock_1710340739.webp';
import prod3 from '$lib/assets/stock-images/AdobeStock_1868479109.webp';
import prod4 from '$lib/assets/stock-images/AdobeStock_1705702729.webp';

import lifestyle1 from '$lib/assets/stock-images/AdobeStock_1552940722.webp';
import lifestyle2 from '$lib/assets/placeholder/lifestyle-01.jpg';
import storyImage from '$lib/assets/placeholder/story-01.jpg';

export interface CollectionProduct {
	name: string;
	size: string;
	price: string;
	image: string;
}

export interface CollectionStory {
	inspiration: string;
	process: string;
	quote: string;
	quoteAuthor: string;
	materials: string[];
	image: string;
}

export interface Collection {
	id: string;
	label: string;
	description: string;
	tag: string;
	href: string;
	images: {
		hero: string;
		thumbnail: string;
	};
	story: CollectionStory;
	products: CollectionProduct[];
	lifestyleImages: { src: string; alt: string }[];
}

export const collections: Collection[] = [
	{
		id: 'imperial-bloom',
		label: 'Imperial Bloom',
		description:
			'A celebration of the garden in full flower — peonies and petals translated into the softest cotton and linen weaves.',
		href: '/collections/imperial-bloom',
		tag: 'New Collection',
		images: {
			hero: imperialBloomHero,
			thumbnail: imperialBloomThumbnail
		},
		story: {
			inspiration:
				'Imperial Bloom was born during a spring visit to the Boboli Gardens in Florence. The overwhelming beauty of peonies in full bloom — their layered petals, their soft blush tones — became the starting point for our most expressive collection yet.',
			process:
				'Each motif is hand-drawn in our Berlin studio, then translated into jacquard weaves at a family-run mill in Portugal. The result is a pattern that feels alive — organic, never rigid.',
			quote: 'I wanted to capture that fleeting moment when a garden is at its most generous.',
			quoteAuthor: 'Amira Kessler, Creative Director',
			materials: ['100% organic cotton', 'GOTS certified', 'Jacquard woven in Portugal'],
			image: storyImage
		},
		products: [
			{ name: 'Duvet Cover', size: 'Double / King', price: '€145', image: prod1 },
			{ name: 'Pillowcase Set', size: 'Standard × 2', price: '€65', image: prod2 },
			{ name: 'Fitted Sheet', size: 'Double / King', price: '€95', image: prod3 },
			{ name: 'Throw Cushion', size: '50 × 50 cm', price: '€55', image: prod4 }
		],
		lifestyleImages: [
			{ src: lifestyle1, alt: 'Styled bedroom with Aziza textiles' },
			{ src: lifestyle2, alt: 'Living space with Aziza cushions and throws' }
		]
	},
	{
		id: 'maison-jardin',
		label: 'Maison Jardin',
		description:
			'Clean, luminous whites and quiet creams. Timeless pieces that work in every room, in every light.',
		href: '/collections/maison-jardin',
		tag: 'Bestseller',
		images: {
			hero: maisonJardinHero,
			thumbnail: maisonJardinThumbnail
		},
		story: {
			inspiration:
				'Maison Jardin is our love letter to simplicity. Inspired by the quiet elegance of French country houses — where every surface breathes and light plays across white linen — this collection strips everything back to what matters.',
			process:
				'We spent months perfecting the weight and hand-feel of each piece. The result is a cotton-linen blend that softens with every wash, developing a beautiful patina over the years.',
			quote:
				'The hardest thing in design is knowing when to stop. Maison Jardin is our answer.',
			quoteAuthor: 'Amira Kessler, Creative Director',
			materials: ['Cotton-linen blend', 'Stone-washed finish', 'Woven in Belgium'],
			image: storyImage
		},
		products: [
			{ name: 'Duvet Cover', size: 'Double / King', price: '€145', image: prod1 },
			{ name: 'Pillowcase Set', size: 'Standard × 2', price: '€65', image: prod2 },
			{ name: 'Fitted Sheet', size: 'Double / King', price: '€95', image: prod3 },
			{ name: 'Throw Cushion', size: '50 × 50 cm', price: '€55', image: prod4 }
		],
		lifestyleImages: [
			{ src: lifestyle1, alt: 'Styled bedroom with Aziza textiles' },
			{ src: lifestyle2, alt: 'Living space with Aziza cushions and throws' }
		]
	},
	{
		id: 'alpine-heritage',
		label: 'Alpine Heritage',
		description:
			'Soft botanical prints inspired by meadow flowers — for those who want a little nature inside.',
		href: '/collections/alpine-heritage',
		tag: 'Spring Edit',
		images: {
			hero: alpineHeritageHero,
			thumbnail: alpineHeritageThumbnail
		},
		story: {
			inspiration:
				'On a hiking trip through the Austrian Alps, we discovered pressed flower collections in a 19th-century mountain lodge. Delicate edelweiss, gentian, and alpine roses — preserved between pages for over a hundred years. Alpine Heritage brings that same reverence for nature into your home.',
			process:
				'The prints are developed from original botanical illustrations, digitally refined and printed using reactive dyes that bond permanently with the fibre — no fading, no washing out.',
			quote:
				'These flowers have been telling their story for centuries. We just gave them a new medium.',
			quoteAuthor: 'Lena Hofer, Textile Designer',
			materials: ['100% Belgian linen', 'Reactive dye printing', 'Pre-washed for softness'],
			image: storyImage
		},
		products: [
			{ name: 'Duvet Cover', size: 'Double / King', price: '€145', image: prod1 },
			{ name: 'Pillowcase Set', size: 'Standard × 2', price: '€65', image: prod2 },
			{ name: 'Fitted Sheet', size: 'Double / King', price: '€95', image: prod3 },
			{ name: 'Throw Cushion', size: '50 × 50 cm', price: '€55', image: prod4 }
		],
		lifestyleImages: [
			{ src: lifestyle1, alt: 'Styled bedroom with Aziza textiles' },
			{ src: lifestyle2, alt: 'Living space with Aziza cushions and throws' }
		]
	},
	{
		id: 'aziza-atelier',
		label: 'Aziza Atelier',
		description:
			'Our most considered collection. Rich, dramatic florals drawn from 17th-century botanical paintings.',
		href: '/collections/aziza-atelier',
		tag: 'Limited Edition',
		images: {
			hero: azizaAtelierHero,
			thumbnail: azizaAtelierThumbnail
		},
		story: {
			inspiration:
				'Aziza Atelier began in the print room of the Rijksmuseum, surrounded by Dutch Golden Age still lifes. Those paintings — with their impossible bouquets and dramatic chiaroscuro — became our muse for a collection that feels both timeless and bold.',
			process:
				'Each design goes through twelve iterations before reaching the loom. We work with a single master weaver in Flanders who understands how to translate painterly depth into textile form.',
			quote:
				"Atelier is proof that luxury doesn't need to be quiet. Sometimes it should take your breath away.",
			quoteAuthor: 'Amira Kessler, Creative Director',
			materials: [
				'Silk-cotton blend',
				'Handloom finished',
				'Limited to 200 pieces per design'
			],
			image: storyImage
		},
		products: [
			{ name: 'Duvet Cover', size: 'Double / King', price: '€145', image: prod1 },
			{ name: 'Pillowcase Set', size: 'Standard × 2', price: '€65', image: prod2 },
			{ name: 'Fitted Sheet', size: 'Double / King', price: '€95', image: prod3 },
			{ name: 'Throw Cushion', size: '50 × 50 cm', price: '€55', image: prod4 }
		],
		lifestyleImages: [
			{ src: lifestyle1, alt: 'Styled bedroom with Aziza textiles' },
			{ src: lifestyle2, alt: 'Living space with Aziza cushions and throws' }
		]
	}
];

export const collectionsById = Object.fromEntries(collections.map((c) => [c.id, c]));
