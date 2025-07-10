import { ENDPOINTS } from '@/config/api';
import type { Product } from '@/types';
import apiClient from '@/utils/apiClient';
import { stripHtml } from '@/utils/helpers';

const mapToProduct = (item: any): Product => ({
    id: item.id,
    name: item.name,
    price: item.price,
    regular_price: item.regular_price,
    sale_price: item.sale_price,
    featured: item.featured,
    stock_quantity: item.stock_quantity,
    stock_status: item.stock_status,
    description: stripHtml(item.description),
    short_description: stripHtml(item.short_description),
    categories: item.categories || [],
    images: item.images || [],
    tags: item.tags || [],
    attributes: item.attributes || [],
});

export async function fetchFeaturedProducts(page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, 'featured=true')
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
