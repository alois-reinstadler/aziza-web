import { env as publicEnv } from '$env/dynamic/public';
import { env as privateEnv } from '$env/dynamic/private';

function getApiUrl() {
	const domain = publicEnv.PUBLIC_SHOPIFY_STORE_DOMAIN;
	const version = publicEnv.PUBLIC_SHOPIFY_API_VERSION || '2024-01';
	if (!domain) throw new Error('PUBLIC_SHOPIFY_STORE_DOMAIN is not set');
	return `https://${domain}/api/${version}/graphql.json`;
}

interface StorefrontResponse<T> {
	data: T;
	errors?: { message: string }[];
}

export async function storefront<T>(
	query: string,
	variables: Record<string, unknown> = {},
	customFetch: typeof fetch = fetch
): Promise<T> {
	const token = privateEnv.PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN;
	if (!token) throw new Error('PRIVATE_SHOPIFY_STOREFRONT_API_TOKEN is not set');

	const response = await customFetch(getApiUrl(), {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Shopify-Storefront-Private-Token': token
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
