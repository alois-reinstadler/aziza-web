export interface ShopifyMoney {
	amount: string;
	currencyCode: string;
}

export interface ShopifyImage {
	url: string;
	altText: string | null;
	width: number;
	height: number;
}

export interface ShopifyProductVariant {
	id: string;
	title: string;
	availableForSale: boolean;
	price: ShopifyMoney;
	compareAtPrice: ShopifyMoney | null;
	selectedOptions: { name: string; value: string }[];
	image: ShopifyImage | null;
}

export interface ShopifyProduct {
	id: string;
	handle: string;
	title: string;
	description: string;
	descriptionHtml: string;
	featuredImage: ShopifyImage | null;
	images: { nodes: ShopifyImage[] };
	variants: { nodes: ShopifyProductVariant[] };
	priceRange: {
		minVariantPrice: ShopifyMoney;
		maxVariantPrice: ShopifyMoney;
	};
	tags: string[];
	availableForSale: boolean;
	createdAt: string;
}

export interface ShopifyPageInfo {
	hasNextPage: boolean;
	endCursor: string | null;
}

export interface ShopifyCollectionSummary {
	id: string;
	handle: string;
	title: string;
}

export interface ShopifyCollection {
	id: string;
	handle: string;
	title: string;
	description: string;
	image: ShopifyImage | null;
	products: { nodes: ShopifyProduct[] };
}

export interface ShopifyCartLine {
	id: string;
	quantity: number;
	merchandise: {
		id: string;
		title: string;
		product: {
			handle: string;
			title: string;
			featuredImage: ShopifyImage | null;
		};
		price: ShopifyMoney;
		selectedOptions: { name: string; value: string }[];
	};
	cost: {
		totalAmount: ShopifyMoney;
	};
}

export interface ShopifyCart {
	id: string;
	checkoutUrl: string;
	totalQuantity: number;
	cost: {
		subtotalAmount: ShopifyMoney;
		totalAmount: ShopifyMoney;
		totalTaxAmount: ShopifyMoney | null;
	};
	lines: { nodes: ShopifyCartLine[] };
}
