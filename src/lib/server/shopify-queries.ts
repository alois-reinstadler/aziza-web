import { storefront } from './shopify';
import type {
	ShopifyProduct,
	ShopifyCart,
	ShopifyPageInfo,
	ShopifyCollectionSummary
} from '$lib/types/shopify';

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

export interface ProductsResult {
	products: ShopifyProduct[];
	pageInfo: ShopifyPageInfo;
}

export async function getProducts(
	first = 24,
	sortKey: ProductSortKey = 'CREATED_AT',
	reverse = true,
	after?: string
): Promise<ProductsResult> {
	const data = await storefront<{
		products: { nodes: ShopifyProduct[]; pageInfo: ShopifyPageInfo };
	}>(
		`query Products($first: Int!, $sortKey: ProductSortKeys, $reverse: Boolean, $after: String) {
			products(first: $first, sortKey: $sortKey, reverse: $reverse, after: $after) {
				nodes {
					${PRODUCT_FIELDS}
				}
				pageInfo {
					hasNextPage
					endCursor
				}
			}
		}`,
		{ first, sortKey, reverse, after }
	);
	return { products: data.products.nodes, pageInfo: data.products.pageInfo };
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

export async function getCollections(first = 20): Promise<ShopifyCollectionSummary[]> {
	const data = await storefront<{ collections: { nodes: ShopifyCollectionSummary[] } }>(
		`query Collections($first: Int!) {
			collections(first: $first) {
				nodes {
					id
					handle
					title
				}
			}
		}`,
		{ first }
	);
	return data.collections.nodes;
}

type CollectionSortKey = 'COLLECTION_DEFAULT' | 'CREATED' | 'PRICE' | 'BEST_SELLING';

const COLLECTION_SORT_MAP: Record<ProductSortKey, CollectionSortKey> = {
	CREATED_AT: 'CREATED',
	PRICE: 'PRICE',
	TITLE: 'COLLECTION_DEFAULT',
	BEST_SELLING: 'BEST_SELLING'
};

export async function getCollectionProducts(
	handle: string,
	first = 24,
	sortKey: ProductSortKey = 'CREATED_AT',
	reverse = true,
	after?: string
): Promise<ProductsResult> {
	const collectionSortKey = COLLECTION_SORT_MAP[sortKey];
	const data = await storefront<{
		collection: { products: { nodes: ShopifyProduct[]; pageInfo: ShopifyPageInfo } } | null;
	}>(
		`query CollectionProducts($handle: String!, $first: Int!, $sortKey: ProductCollectionSortKeys, $reverse: Boolean, $after: String) {
			collection(handle: $handle) {
				products(first: $first, sortKey: $sortKey, reverse: $reverse, after: $after) {
					nodes {
						${PRODUCT_FIELDS}
					}
					pageInfo {
						hasNextPage
						endCursor
					}
				}
			}
		}`,
		{ handle, first, sortKey: collectionSortKey, reverse, after }
	);
	if (!data.collection) return { products: [], pageInfo: { hasNextPage: false, endCursor: null } };
	return { products: data.collection.products.nodes, pageInfo: data.collection.products.pageInfo };
}

export async function searchProducts(
	query: string,
	first = 24
): Promise<ShopifyProduct[]> {
	const data = await storefront<{
		products: { nodes: ShopifyProduct[] };
	}>(
		`query SearchProducts($query: String!, $first: Int!) {
			products(first: $first, query: $query) {
				nodes {
					${PRODUCT_FIELDS}
				}
			}
		}`,
		{ query, first }
	);
	return data.products.nodes;
}

export async function getRelatedProducts(
	productId: string,
	first = 4
): Promise<ShopifyProduct[]> {
	const data = await storefront<{
		productRecommendations: ShopifyProduct[];
	}>(
		`query RelatedProducts($productId: ID!) {
			productRecommendations(productId: $productId) {
				${PRODUCT_FIELDS}
			}
		}`,
		{ productId }
	);
	return (data.productRecommendations ?? []).slice(0, first);
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
