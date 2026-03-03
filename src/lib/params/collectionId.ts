import { collections } from '$lib/config/collections';

export function match(value: string) {
	return !!collections.find((collection) => collection.id === value);
}
