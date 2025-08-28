import { ENDPOINTS, PaginationOptions } from "@/config/api";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { apiClient } from "@/lib/apiClient";
import { mapToProduct } from "@/mappers/mapToProduct";
import { ProductVariation, VariableProduct } from "@/types";

import { responseTransformer } from "../util";

/**
 * Fetch a product by ID.
 *
 * @param id - The ID of the product to fetch.
 * @returns The fetched product.
 */
export async function fetchProduct(
  id: number
): Promise<SimpleProduct | ProductVariation | VariableProduct> {
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
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.FEATURED(pagination)
  );

  return responseTransformer(response, mapToProduct);
};

/**
 * Fetch products by IDs.
 *
 * @param ids - The IDs of the products to fetch.
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchProductsByIds = async (
  ids: number[],
  pagination?: PaginationOptions
) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.BY_IDS(ids, pagination)
  );
  return responseTransformer(response, mapToProduct);
};

/**
 * Fetch products by search query.
 *
 * @param query - The search query.
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchProductsBySearch = async (
  query: string,
  pagination?: PaginationOptions
) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.SEARCH(query, pagination)
  );
  return responseTransformer(response, mapToProduct);
};

/**
 * Fetch recent products.
 *
 * @param pagination - Optional pagination options.
 * @returns The fetched products.
 */
export const fetchRecentProducts = async (pagination?: PaginationOptions) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.RECENT(pagination)
  );
  return responseTransformer(response, mapToProduct);
};

/**
/**
 * Fetch product variations.
 *
 * @param id - The ID of the product to fetch variations for.
 * @param pagination - Optional pagination options.
 * @returns The fetched variations.
 */
export const fetchProductVariations = async (
  id: number,
  pagination?: PaginationOptions
) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCT_VARIATIONS.LIST(id, pagination)
  );
  return responseTransformer(response, mapToProduct);
};
