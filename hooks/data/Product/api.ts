import { ENDPOINTS } from '@/config/api';
import { apiClient } from '@/lib/apiClient';
import { BaseProduct, BaseProductData } from '@/models/Product/BaseProduct';
import { createProduct } from '@/models/Product/ProductFactory';
import { ApiResponse } from 'apisauce';




export async function fetchProduct(id: number): Promise<BaseProduct<BaseProductData>> {
    const response = await apiClient.get<any>(`${ENDPOINTS.PRODUCTS.GET(id)}`);
    if (response.problem) {
        throw new Error(response.problem);
    }
    if (!response.data) {
        throw new Error('Product not found');
    }

    return createProduct(response.data);
}





export const fetchFeaturedProducts = async ({ pageParam = 1 }) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.FEATURED(pageParam));
    return responseTransformer(response);
}

export const fetchDiscountedProducts = async ({ pageParam = 1 }) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.DISCOUNTED(pageParam));
    return responseTransformer(response);
}

export const fetchProductsByIds = async ({ ids, pageParam = 1 }: { ids: number[], pageParam?: number }) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_IDS(ids, pageParam));
    return responseTransformer(response);
}

export const fetchProductsBySearch = async ({ query, pageParam = 1 }: { query: string, pageParam?: number }) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.SEARCH(query, pageParam));
    return responseTransformer(response);
}

export const fetchProductVariations = async ({ id, pageParam = 1 }: { id: number, pageParam?: number }) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.VARIATIONS(id, pageParam));
    return responseTransformer(response);
}

export const fetchRecentProducts = async ({ pageParam = 1 }) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.RECENT(pageParam));
    return responseTransformer(response);
}

export const fetchProductsByProductCategory = async ({ product_category_id, pageParam = 1 }: { product_category_id: number, pageParam?: number }) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_CATEGORY(product_category_id, pageParam));
    return responseTransformer(response);
}

const responseTransformer = (response: ApiResponse<any>) => {
    if (response.problem) {
        throw new Error(response.problem);
    }

    const totalPages = Number(response.headers?.['x-wp-totalpages']);
    const total = Number(response.headers?.['x-wp-total']);
    return {
        data: (response.data ?? []).map(createProduct),
        totalPages,
        total
    };
}