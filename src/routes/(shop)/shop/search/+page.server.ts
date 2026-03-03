import type { PageServerLoad } from './$types';
import { searchProducts } from '$lib/server/shopify-queries';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';

	if (!query) {
		return { products: [], query };
	}

	const products = await searchProducts(query, 24);
	return { products, query };
};
