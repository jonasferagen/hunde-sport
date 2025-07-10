import { ENDPOINTS } from '@/config/api';
import type { Product } from '@/types';
import apiClient from '@/utils/apiClient';
import { cleanHtml } from '@/utils/helpers';

const formatters: Record<string, (value: any) => any> = {
    name: cleanHtml,
    description: cleanHtml,
    short_description: cleanHtml,
};

const mapToProduct = (item: any): Product => {
    const product: Partial<Product> = {};

    for (const key in item) {
        if (Object.prototype.hasOwnProperty.call(item, key)) {
            const value = item[key];
            if (formatters[key]) {
                (product as any)[key] = formatters[key](value);
            } else {
                (product as any)[key] = value;
            }
        }
    }

    // Ensure array types have default values
    product.categories = product.categories || [];
    product.images = product.images || [];
    product.tags = product.tags || [];
    product.attributes = product.attributes || [];

    return product as Product;
};

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
