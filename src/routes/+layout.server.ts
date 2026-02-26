import type { LayoutServerLoad } from './$types';
import { getCart } from '$lib/server/shopify-queries';

export const load: LayoutServerLoad = async ({ cookies }) => {
	const cartId = cookies.get('aziza-cart');

	if (!cartId) {
		return { cart: null };
	}

	try {
		const cart = await getCart(cartId);
		if (!cart) {
			cookies.delete('aziza-cart', { path: '/' });
			return { cart: null };
		}
		return { cart };
	} catch {
		return { cart: null };
	}
};
