import { storefront } from './shopify';
import type { ShopifyProduct, ShopifyCart } from '$lib/types/shopify';

const PRODUCT_FIELDS = `
	id
	handle
	title
	description
	descriptionHtml
	availableForSale
	createdAt
	tags
	featuredImage {
		url
		altText
		width
		height
	}
	images(first: 10) {
		nodes {
			url
			altText
			width
			height
		}
	}
	priceRange {
		minVariantPrice {
			amount
			currencyCode
		}
		maxVariantPrice {
			amount
			currencyCode
		}
	}
	variants(first: 50) {
		nodes {
			id
			title
			availableForSale
			price {
				amount
				currencyCode
			}
			compareAtPrice {
				amount
				currencyCode
			}
			selectedOptions {
				name
				value
			}
			image {
				url
				altText
				width
				height
			}
		}
	}
`;

const CART_FIELDS = `
	id
	checkoutUrl
	totalQuantity
	cost {
		subtotalAmount {
			amount
			currencyCode
		}
		totalAmount {
			amount
			currencyCode
		}
		totalTaxAmount {
			amount
			currencyCode
		}
	}
	lines(first: 100) {
		nodes {
			id
			quantity
			merchandise {
				... on ProductVariant {
					id
					title
					product {
						handle
						title
						featuredImage {
							url
							altText
							width
							height
						}
					}
					price {
						amount
						currencyCode
					}
					selectedOptions {
						name
						value
					}
				}
			}
			cost {
				totalAmount {
					amount
					currencyCode
				}
			}
		}
	}
`;

// --- Product Queries ---

export type ProductSortKey = 'CREATED_AT' | 'PRICE' | 'TITLE' | 'BEST_SELLING';

export async function getProducts(
	first = 24,
	sortKey: ProductSortKey = 'CREATED_AT',
	reverse = true
): Promise<ShopifyProduct[]> {
	const data = await storefront<{ products: { nodes: ShopifyProduct[] } }>(
		`query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean) {
			products(first: $first, sortKey: $sortKey, reverse: $reverse) {
				nodes {
					${PRODUCT_FIELDS}
				}
			}
		}`,
		{ first, sortKey, reverse }
	);
	return data.products.nodes;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
	const data = await storefront<{ product: ShopifyProduct | null }>(
		`query Product($handle: String!) {
			product(handle: $handle) {
				${PRODUCT_FIELDS}
			}
		}`,
		{ handle }
	);
	return data.product;
}

// --- Cart Queries & Mutations ---

export async function createCart(variantId: string, quantity = 1): Promise<ShopifyCart> {
	const data = await storefront<{ cartCreate: { cart: ShopifyCart } }>(
		`mutation CartCreate($input: CartInput!) {
			cartCreate(input: $input) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			input: {
				lines: [{ merchandiseId: variantId, quantity }]
			}
		}
	);
	return data.cartCreate.cart;
}

export async function addToCart(
	cartId: string,
	variantId: string,
	quantity = 1
): Promise<ShopifyCart> {
	const data = await storefront<{ cartLinesAdd: { cart: ShopifyCart } }>(
		`mutation CartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
			cartLinesAdd(cartId: $cartId, lines: $lines) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			cartId,
			lines: [{ merchandiseId: variantId, quantity }]
		}
	);
	return data.cartLinesAdd.cart;
}

export async function updateCartLine(
	cartId: string,
	lineId: string,
	quantity: number
): Promise<ShopifyCart> {
	const data = await storefront<{ cartLinesUpdate: { cart: ShopifyCart } }>(
		`mutation CartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
			cartLinesUpdate(cartId: $cartId, lines: $lines) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			cartId,
			lines: [{ id: lineId, quantity }]
		}
	);
	return data.cartLinesUpdate.cart;
}

export async function removeCartLine(cartId: string, lineId: string): Promise<ShopifyCart> {
	const data = await storefront<{ cartLinesRemove: { cart: ShopifyCart } }>(
		`mutation CartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
			cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
				cart {
					${CART_FIELDS}
				}
			}
		}`,
		{
			cartId,
			lineIds: [lineId]
		}
	);
	return data.cartLinesRemove.cart;
}

export async function getCart(cartId: string): Promise<ShopifyCart | null> {
	const data = await storefront<{ cart: ShopifyCart | null }>(
		`query Cart($cartId: ID!) {
			cart(id: $cartId) {
				${CART_FIELDS}
			}
		}`,
		{ cartId }
	);
	return data.cart;
}
