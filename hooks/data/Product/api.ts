import { ENDPOINTS, PaginationOptions } from '@/config/api';
import { apiClient } from '@/lib/apiClient';
import { promises as fs } from "fs";
import path from "path";
import { mapToProduct, Product } from '@/domain/Product/Product';
import { responseTransformer } from '../util';

/**
 * Fetch a product by ID.
 *
 * @param id - The ID of the product to fetch.
 * @returns The fetched product.
 */
export async function fetchProduct(id: number): Promise<Product> {
    const response = await apiClient.get<any>(`${ENDPOINTS.PRODUCTS.GET(id)}`);
    if (response.problem) {
        throw new Error(response.problem);
    }
    // Note: This is a single product fetch, so we don't use the responseTransformer here.
    return mapToProduct(response.data);
}

/**
 * Fetch featured products.
 *
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchFeaturedProducts = async (pagination?: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.FEATURED(pagination));
    return responseTransformer(response, mapToProduct);
}

/**
 * Fetch discounted products.
 *
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchDiscountedProducts = async (pagination?: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.DISCOUNTED(pagination));
    return responseTransformer(response, mapToProduct);
}

/**
 * Fetch products by IDs.
 *
 * @param ids - The IDs of the products to fetch.
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchProductsByIds = async (ids: number[], pagination?: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_IDS(ids, pagination));
    return responseTransformer(response, mapToProduct);
}

/**
 * Fetch products by search query.
 *
 * @param query - The search query.
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchProductsBySearch = async (query: string, pagination?: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.SEARCH(query, pagination));
    return responseTransformer(response, mapToProduct);
}


/**
 * Fetch recent products.
 *
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchRecentProducts = async (pagination?: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.RECENT(pagination));
    return responseTransformer(response, mapToProduct);
}

/**
 * Fetch products by product category.
 *
 * @param product_category_id - The ID of the product category to fetch products for.
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchProductsByProductCategory = async (product_category_id: number, pagination?: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCTS.BY_PRODUCT_CATEGORY(product_category_id, pagination));
    return responseTransformer(response, mapToProduct);
}



/**
 * Fetch product variations.
 *
 * @param id - The ID of the product to fetch variations for.
 * @param pagination - Optional pagination options.
 * @returns The fetched variations.
 */
export const fetchProductVariations = async (id: number, pagination?: PaginationOptions) => {
    const response = await apiClient.get<any[]>(ENDPOINTS.PRODUCT_VARIATIONS.LIST(id, pagination));
    return responseTransformer(response, mapToProduct);
}
