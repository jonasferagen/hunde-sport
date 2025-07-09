import type { Product } from '../../../types';

export const mapToProduct = (item: any): Product => ({
    id: item.id,
    name: item.name,
    description: item.description,
    short_description: item.short_description,
    categories: item.categories || [],
    images: item.images || [],
});

export const getKey = (categoryId: number | null): string =>
    categoryId?.toString() ?? 'all';
