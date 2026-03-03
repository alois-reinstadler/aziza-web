import type { PageServerLoad } from './$types';
import { getProducts, type ProductSortKey } from '$lib/server/shopify-queries';

export const load: PageServerLoad = async ({ url }) => {
	const sortParam = url.searchParams.get('sort') ?? 'newest';

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

	const products = await getProducts(24, sortKey, reverse);
	return { products, sort: sortParam };
};
