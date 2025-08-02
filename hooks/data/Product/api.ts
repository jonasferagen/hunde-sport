import { ENDPOINTS } from '@/config/api';
import { Product } from '@/models/Product/Product';
import apiClient from '@/utils/apiClient';

import { mapToProduct } from '@/models/Product/ProductMapper';

export type ProductListParams =
    | { type: 'recent' | 'featured' | 'discounted', params?: undefined }
    | { type: 'search', params: string }
    | { type: 'category', params: number }
    | { type: 'ids', params: number[] };

export type ProductListType = ProductListParams['type'];

export function getQueryStringForType({ type, params }: ProductListParams): string {
    switch (type) {
        case 'recent':
            return 'orderby=date';
        case 'featured':
            return 'featured=true';
        case 'discounted':
            return 'on_sale=true';
        case 'search':
            return 'search=' + params;
        case 'category':
            return 'category=' + params;
        case 'ids':
            return 'include=' + params.join(',');
    }
}

export async function fetchProduct(id: number): Promise<Product> {
    const { data, error } = await apiClient.get<any>(`${ENDPOINTS.PRODUCTS.GET(id)}`);
    if (error) throw new Error(error);

    return mapToProduct(data);
}

export const fetchProducts = async (page: number, query: ProductListParams) => {
    const { data, error } = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.LIST(page, getQueryStringForType(query)));
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
};
