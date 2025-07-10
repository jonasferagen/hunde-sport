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


export async function fetchProductByCategory(categoryId: number, page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.BYCATEGORY(categoryId, page)
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProductsByTag(tagId: number, page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.BYTAG(tagId, page)
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
