import type { PageServerLoad } from './$types';
import { searchProducts, getProducts } from '$lib/server/shopify-queries';

export const load: PageServerLoad = async ({ url }) => {
	const query = url.searchParams.get('q')?.trim() ?? '';

	if (!query) {
		const { products } = await getProducts(8, 'BEST_SELLING');
		return { products, query, isPopular: true };
	}

	const products = await searchProducts(query, 24);
	return { products, query, isPopular: false };
};
