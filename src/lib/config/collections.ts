import imperialBloomHero from '$lib/assets/collections/collection-01-xl.webp';
import imperialBloomThumbnail from '$lib/assets/collections/collection-01.webp';

import maisonJardinHero from '$lib/assets/collections/collection-02-xl.webp';
import maisonJardinThumbnail from '$lib/assets/collections/collection-02.webp';

import alpineHeritageHero from '$lib/assets/collections/collection-03-xl.webp';
import alpineHeritageThumbnail from '$lib/assets/collections/collection-03.webp';

import azizaAtelierHero from '$lib/assets/collections/collection-04-xl.webp';
import azizaAtelierThumbnail from '$lib/assets/collections/collection-04.webp';

export interface Collection {
	id: string;
	label: string;
	description: string;

	tag?: string;
	href: string;

	images: {
		hero: string;
		thumbnail: string;
	};
}

export const collections = [
	{
		id: 'imperial-bloom',
		label: 'Imperial Bloom',
		description: 'A collection of imperial bloom',
		href: '/collections/imperial-bloom',
		tag: 'New Collection',
		images: {
			hero: imperialBloomHero,
			thumbnail: imperialBloomThumbnail
		}
	},
	{
		id: 'maison-jardin',
		label: 'Maison Jardin',
		description: 'A collection of maison jardin',
		href: '/collections/maison-jardin',
		tag: 'Bestseller',
		images: {
			hero: maisonJardinHero,
			thumbnail: maisonJardinThumbnail
		}
	},
	{
		id: 'alpine-heritage',
		label: 'Alpine Heritage',
		description: 'A collection of alpine heritage',
		href: '/collections/alpine-heritage',
		tag: 'Spring Edit',
		images: {
			hero: alpineHeritageHero,
			thumbnail: alpineHeritageThumbnail
		}
	},
	{
		id: 'aziza-atelier',
		label: 'Aziza Atelier',
		description: 'A collection of aziza atelier',
		href: '/collections/aziza-atelier',
		tag: 'Limited Edition',
		images: {
			hero: azizaAtelierHero,
			thumbnail: azizaAtelierThumbnail
		}
	}
] satisfies Collection[];
