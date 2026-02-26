import { PUBLIC_SHOPIFY_STORE_DOMAIN, PUBLIC_SHOPIFY_API_VERSION } from '$env/static/public';
import { PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN } from '$env/static/private';

const API_URL = `https://${PUBLIC_SHOPIFY_STORE_DOMAIN}/api/${PUBLIC_SHOPIFY_API_VERSION}/graphql.json`;

interface StorefrontResponse<T> {
	data: T;
	errors?: { message: string }[];
}

export async function storefront<T>(
	query: string,
	variables: Record<string, unknown> = {}
): Promise<T> {
	const response = await fetch(API_URL, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-Shopify-Storefront-Access-Token': PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN
		},
		body: JSON.stringify({ query, variables })
	});

	if (!response.ok) {
		throw new Error(`Shopify API error: ${response.status} ${response.statusText}`);
	}

	const json: StorefrontResponse<T> = await response.json();

	if (json.errors?.length) {
		throw new Error(`Shopify GraphQL error: ${json.errors.map((e) => e.message).join(', ')}`);
	}

	return json.data;
}
