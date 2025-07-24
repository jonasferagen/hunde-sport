import { ENDPOINTS, PAGE_SIZE } from '@/config/api';
import { Product } from '@/models/Product';
import apiClient from '@/utils/apiClient';

import { mapToProduct } from '@/hooks/data/util';

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
    const { data, error } = await apiClient.get<any>(ENDPOINTS.PRODUCTS.GET(id));
    if (error) throw new Error(error);
    return mapToProduct(data);
}

export async function fetchProductVariations(page: number, productId: number): Promise<Product[]> {
    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.VARIATIONS(productId) + `?page=${page}&per_page=${PAGE_SIZE} `
    );

    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}

export async function fetchProducts(page: number, query: ProductListParams): Promise<Product[]> {
    const queryString = getQueryStringForType(query);

    const { data, error } = await apiClient.get<any[]>(
        ENDPOINTS.PRODUCTS.LIST(page, queryString)
    );
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
}
