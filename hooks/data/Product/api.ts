import { ENDPOINTS } from '@/config/api';
import { apiClient } from '@/lib/apiClient';
import { BaseProduct, BaseProductData } from '@/models/Product/BaseProduct';
import { createProduct } from '@/models/Product/ProductFactory';



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

export const fetchProductsByCategory = async (id: number) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_CATEGORY(id));
    if (response.problem) {
        throw new Error(response.problem);
    }
    return (response.data ?? []).map(createProduct);
}