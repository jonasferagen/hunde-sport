import { ENDPOINTS } from '@/config/api';
import apiClient from '@/utils/apiClient';

import { Product } from '@/models/Product/Product';
import { mapToProduct } from '@/models/Product/ProductMapper';
import { ProductVariation } from '@/models/Product/ProductVariation';

export type ProductListParams =
    | { type: 'recent' | 'featured' | 'discounted', params?: undefined }
    | { type: 'search', params: string }
    | { type: 'category', params: number }
    | { type: 'ids', params: number[] }
    | { type: 'variations', params: number };

export type ProductListType = ProductListParams['type'];

const ALL_STATUSES = '&status=any';
const ALL_STOCK_STATUSES = '&stock_status=instock,onbackorder,outofstock';

export function getQueryStringForType({ type, params }: ProductListParams): string {
    let queryString = '';

    switch (type) {
        case 'recent':
            queryString = 'orderby=date';
            break;
        case 'featured':
            queryString = 'featured=true';
            break;
        case 'discounted':
            queryString = 'on_sale=true';
            break;
        case 'search':
            queryString = `search=${params}${ALL_STATUSES}${ALL_STOCK_STATUSES}`;
            break;
        case 'category':
            queryString = `category=${params}`;
            break;
        case 'ids':
            queryString = `include=${params.join(',')}${ALL_STATUSES}${ALL_STOCK_STATUSES}`;
            break;
        case 'variations':
            queryString = `parent=${params}&type=variation${ALL_STATUSES}${ALL_STOCK_STATUSES}`;
            break;
    }

    return queryString;
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
    if (query.type === 'ids' && query.params.length > 0) {
        console.log(data?.map(item => item.id));
    }
    return (data ?? []).map(mapToProduct);
};
