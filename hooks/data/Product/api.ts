import { ENDPOINTS } from '@/config/api';
import apiClient from '@/utils/apiClient';

import { BaseProduct, BaseProductData } from '@/models/Product/BaseProduct';
import { createProduct } from '@/models/Product/ProductFactory';

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

export async function fetchProduct(id: number): Promise<BaseProduct<BaseProductData>> {
    const { data, error } = await apiClient.get<any>(`${ENDPOINTS.PRODUCTS.GET(id)}`);
    if (error) throw new Error(error);

    return createProduct(data);
}


export const fetchProducts = async (page: number, query: ProductListParams) => {
    const { data, error } = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.LIST(page, getQueryStringForType(query)));
    if (error) throw new Error(error);
    if (query.type === 'ids' && query.params.length > 0) {
        console.log(data?.map(item => item.id));
    }
    return (data ?? []).map(createProduct);
};
