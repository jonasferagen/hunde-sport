import { ENDPOINTS, PaginationOptions } from '@/config/api';
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


export const fetchFeaturedProducts = async (pagination: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.FEATURED(pagination));
    return responseTransformer(response);
}

export const fetchDiscountedProducts = async (pagination: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.DISCOUNTED(pagination));
    return responseTransformer(response);
}

export const fetchProductsByIds = async (ids: number[], pagination: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_IDS(ids, pagination));
    return responseTransformer(response);
}

export const fetchProductsBySearch = async (query: string, pagination: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.SEARCH(query, pagination));
    return responseTransformer(response);
}

export const fetchProductVariations = async (id: number, pagination: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.VARIATIONS(id, pagination));
    return responseTransformer(response);
}

export const fetchRecentProducts = async (pagination: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.RECENT(pagination));
    return responseTransformer(response);
}

export const fetchProductsByProductCategory = async (product_category_id: number, pagination: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_CATEGORY(product_category_id, pagination));
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