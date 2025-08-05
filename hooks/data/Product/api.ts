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



export const fetchRecentProducts = async () => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.RECENT());
    if (response.problem) {
        throw new Error(response.problem);
    }
    return (response.data ?? []).map(createProduct);
}


export const fetchFeaturedProducts = async () => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.FEATURED());
    if (response.problem) {
        throw new Error(response.problem);
    }
    return (response.data ?? []).map(createProduct);
}

export const fetchDiscountedProducts = async () => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.DISCOUNTED());
    if (response.problem) {
        throw new Error(response.problem);
    }
    return (response.data ?? []).map(createProduct);
}

export const fetchProductsByIds = async (ids: number[]) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_IDS(ids));
    if (response.problem) {
        throw new Error(response.problem);
    }
    return (response.data ?? []).map(createProduct);
}

export const fetchProductsBySearch = async (query: string) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.SEARCH(query));
    if (response.problem) {
        throw new Error(response.problem);
    }
    return (response.data ?? []).map(createProduct);
}

export const fetchProductVariations = async (id: number) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.VARIATIONS(id));
    if (response.problem) {
        throw new Error(response.problem);
    }
    return (response.data ?? []).map(createProduct);
}


const responseTransformer = (response: ApiResponse<any>) => {
    const totalPages = response.headers?.['x-wp-totalpages'] as string;
    const total = response.headers?.['x-wp-total'] as string;
    return {
        data: (response.data ?? []).map(createProduct),
        totalPages: totalPages ? parseInt(totalPages, 10) : 0,
        total: total ? parseInt(total, 10) : 0,
    };
}

export const fetchProductsByCategory = async ({ category_id, pageParam = 1 }: { category_id: number, pageParam?: number }) => {

    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_CATEGORY(category_id, pageParam));
    if (response.problem) {
        throw new Error(response.problem);
    }

    return responseTransformer(response);
}