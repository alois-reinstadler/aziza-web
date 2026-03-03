import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { createCart, addToCart, updateCartLine, removeCartLine } from '$lib/server/shopify-queries';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const body = await request.json();
	const { action, variantId, quantity, lineId } = body;
	const cartId = cookies.get('aziza-cart');

	try {
		let cart;

		switch (action) {
			case 'add': {
				if (!variantId) return json({ error: 'variantId required' }, { status: 400 });
				if (cartId) {
					cart = await addToCart(cartId, variantId, quantity ?? 1);
				} else {
					cart = await createCart(variantId, quantity ?? 1);
				}
				break;
			}
			case 'update': {
				if (!cartId || !lineId)
					return json({ error: 'cartId and lineId required' }, { status: 400 });
				cart = await updateCartLine(cartId, lineId, quantity ?? 1);
				break;
			}
			case 'remove': {
				if (!cartId || !lineId)
					return json({ error: 'cartId and lineId required' }, { status: 400 });
				cart = await removeCartLine(cartId, lineId);
				break;
			}
			default:
				return json({ error: 'Invalid action' }, { status: 400 });
		}

		cookies.set('aziza-cart', cart.id, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'lax',
			maxAge: 60 * 60 * 24 * 14
		});

		return json({ cart });
	} catch (error) {
		console.error('Cart API error:', error);
		return json({ error: 'Cart operation failed' }, { status: 500 });
	}
};
