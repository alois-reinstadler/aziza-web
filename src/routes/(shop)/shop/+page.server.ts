import type { PageServerLoad } from './$types';
import {
	getProducts,
	getCollectionProducts,
	getCollections,
	type ProductSortKey
} from '$lib/server/shopify-queries';

export const load: PageServerLoad = async ({ url }) => {
	const sortParam = url.searchParams.get('sort') ?? 'newest';
	const collectionHandle = url.searchParams.get('collection') ?? null;
	const after = url.searchParams.get('after') ?? undefined;

	let sortKey: ProductSortKey = 'CREATED_AT';
	let reverse = true;

	switch (sortParam) {
		case 'price-asc':
			sortKey = 'PRICE';
			reverse = false;
			break;
		case 'price-desc':
			sortKey = 'PRICE';
			reverse = true;
			break;
		case 'newest':
		default:
			sortKey = 'CREATED_AT';
			reverse = true;
			break;
	}

	const [result, collections] = await Promise.all([
		collectionHandle
			? getCollectionProducts(collectionHandle, 24, sortKey, reverse, after)
			: getProducts(24, sortKey, reverse, after),
		getCollections()
	]);

	return {
		products: result.products,
		pageInfo: result.pageInfo,
		collections,
		sort: sortParam,
		collection: collectionHandle
	};
};
