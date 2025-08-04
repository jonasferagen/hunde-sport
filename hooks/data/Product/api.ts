import { ENDPOINTS } from '@/config/api';
import apiClient from '@/utils/apiClient';

import { Product } from '@/models/Product/Product';
import { mapToProduct } from '@/models/Product/ProductMapper';
import { ProductVariation } from '@/models/Product/ProductVariation';

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

export async function fetchProductVariation(id: number): Promise<ProductVariation> {
    const product = await fetchProduct(id);

    if (product.type !== 'variation') {
        throw new Error(`Product with ID ${id} is not a variation.`);
    }

    return product as ProductVariation;
}

export const fetchProducts = async (page: number, query: ProductListParams) => {
    const { data, error } = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.LIST(page, getQueryStringForType(query)));
    if (error) throw new Error(error);
    return (data ?? []).map(mapToProduct);
};
