import { ENDPOINTS } from '@/config/api';
import type { Product } from '@/types';
import apiClient from '@/utils/apiClient';


const mapToProduct = (item: any): Product => ({
    id: item.id,
    name: item.name,
    description: item.description,
    short_description: item.short_description,
    categories: item.categories || [],
    images: item.images || [],
});


export async function fetchProductByCategory(productCategoryId: number, page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.BYCATEGORY(page, productCategoryId)
    );
    if (error) throw new Error(error);

    return (data ?? []).map(mapToProduct);
}

export async function fetchProductsByTag(tagId: number, page: number): Promise<Product[]> {
    // This is a placeholder. You'll need to implement the actual endpoint.
    console.warn('fetchProductsByTag is not implemented. Returning empty array.');
    return Promise.resolve([]);
}

export async function fetchProduct(productId: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.PRODUCTS.GET(productId)
    );
    if (error) throw new Error(error);
    return mapToProduct(data);
}
