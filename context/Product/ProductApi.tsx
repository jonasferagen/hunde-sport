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


export async function fetchProductList(productId: number, page: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, productId)
    );
    if (error) throw new Error(error);

    return (data ?? []).map(mapToProduct);
}

export async function fetchProductDetail(productId: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(
        ENDPOINTS.PRODUCTS.GET(productId)
    );
    if (error) throw new Error(error);
    return mapToProduct(data);
}

export default fetchProductDetail;
