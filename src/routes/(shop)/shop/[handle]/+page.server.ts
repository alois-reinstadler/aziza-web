import type { PageServerLoad } from './$types';
import { getProductByHandle, getRelatedProducts } from '$lib/server/shopify-queries';
import { error } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ params }) => {
	const product = await getProductByHandle(params.handle);
	if (!product) throw error(404, 'Product not found');

	const relatedProducts = await getRelatedProducts(product.id, 4);

	return { product, relatedProducts };
};
