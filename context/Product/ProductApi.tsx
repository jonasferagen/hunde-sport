import { ENDPOINTS } from '@/config/api';
import type { Product } from '@/types';
import apiClient from '@/utils/apiClient';
import { cleanHtml } from '@/utils/helpers';


const allowedKeys: (keyof Product)[] = [
    'id',
    'name',
    'price',
    'regular_price',
    'sale_price',
    'featured',
    'stock_quantity',
    'stock_status',
    'description',
    'short_description',
    'categories',
    'images',
    'tags',
    'attributes',
    'variations',
    'related_ids',
];

const formatters: Record<string, (value: any) => any> = {
    name: cleanHtml,
    description: cleanHtml,
    short_description: cleanHtml,
};

const mapToProduct = (item: any): Product => {
    const product: Partial<Product> = {};

    for (const key of allowedKeys) {

        const isArray = Array.isArray(item[key]);
        const value = isArray ? item[key] || [] : item[key];

        if (value !== undefined) {
            (product as any)[key] = formatters[key]
                ? formatters[key](value)
                : value;
        }
    }

    if (product.images!.length === 0) {
        product.images!.push({ src: 'https://placehold.co/600x400' });
    }

    return product as Product;
};

export async function fetchFeaturedProducts(page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, 'featured=true&min_price=1')
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProductByCategory(page: number, categoryId: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, 'category=' + categoryId)
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProductsByTag(page: number, tagId: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, 'tag=' + tagId)
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProduct(id: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.PRODUCTS.GET(id)
    );
    if (error) throw new Error(error);
    return mapToProduct(data);
}
