import { ENDPOINTS, PaginationOptions } from "@/config/api";
import { SimpleProduct } from "@/domain/Product/SimpleProduct";
import { apiClient } from "@/lib/apiClient";
import { mapToProduct } from "@/mappers/mapToProduct";
import { ProductCategory, ProductVariation, VariableProduct } from "@/types";

import { responseTransformer } from "../util";

/**
 * Fetch a single product by WooCommerce Store API ID.
 *
 * GET wc/store/v1/products/{id}
 *
 * Uses `mapToProduct` to return a domain model instance.
 *
 * @param id - The product ID.
 * @returns Promise resolving to a domain product (`SimpleProduct` | `VariableProduct` | `ProductVariation`).
 * @throws Error If the request fails or the API reports a problem.
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
 * Fetch featured products (paginated).
 *
 * GET wc/store/v1/products?featured=true
 *
 * @param pagination - Optional pagination options. Defaults: { page: 1, per_page: 10 }.
 * @returns Promise resolving to { data, totalPages, total } where `data` contains domain products (`SimpleProduct` | `VariableProduct`).
 * @throws Error If the request fails or the API reports a problem.
 */
export const fetchFeaturedProducts = async (pagination?: PaginationOptions) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.FEATURED(pagination)
  );

  return responseTransformer(response, mapToProduct);
};

/**
 * Fetch products by IDs (paginated).
 *
 * GET wc/store/v1/products?include=...
 *
 * @param ids - Array of product IDs to fetch.
 * @param pagination - Optional pagination options. Defaults: { page: 1, per_page: 10 }.
 * @returns Promise resolving to { data, totalPages, total } where `data` contains domain products (`SimpleProduct` | `VariableProduct`).
 * @throws Error If the request fails or the API reports a problem.
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
 * Fetch products matching a text query (paginated).
 *
 * GET wc/store/v1/products?search=...
 *
 * @param query - The search query string.
 * @param pagination - Optional pagination options. Defaults: { page: 1, per_page: 10 }.
 * @returns Promise resolving to { data, totalPages, total } where `data` contains domain products (`SimpleProduct` | `VariableProduct`).
 * @throws Error If the request fails or the API reports a problem.
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
 * Fetch products within a given product category (paginated).
 *
 * GET wc/store/v1/products?category={id}
 *
 * @param productCategory - The category object whose products to fetch.
 * @param pagination - Optional pagination options. Defaults: { page: 1, per_page: 10 }.
 * @returns Promise resolving to { data, totalPages, total } where `data` contains domain products (`SimpleProduct` | `VariableProduct`).
 * @throws Error If the request fails or the API reports a problem.
 */
export const fetchProductsByProductCategory = async (
  productCategory: ProductCategory,
  pagination?: PaginationOptions
) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.BY_PRODUCT_CATEGORY(productCategory.id, pagination)
  );
  return responseTransformer(response, mapToProduct);
};

/**
 * Fetch most recent products (paginated).
 *
 * GET wc/store/v1/products?orderby=date&order=desc
 *
 * @param pagination - Optional pagination options. Defaults: { page: 1, per_page: 10 }.
 * @returns Promise resolving to { data, totalPages, total } where `data` contains domain products (`SimpleProduct` | `VariableProduct`).
 * @throws Error If the request fails or the API reports a problem.
 */
export const fetchRecentProducts = async (pagination?: PaginationOptions) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.RECENT(pagination)
  );
  return responseTransformer(response, mapToProduct);
};

/**
 * Fetch discounted (on sale) products (paginated).
 *
 * GET wc/store/v1/products?on_sale=true
 *
 * @param pagination - Optional pagination options. Defaults: { page: 1, per_page: 10 }.
 * @returns Promise resolving to { data, totalPages, total } where `data` contains domain products (`SimpleProduct` | `VariableProduct`).
 * @throws Error If the request fails or the API reports a problem.
 */
export const fetchDiscountedProducts = async (
  pagination?: PaginationOptions
) => {
  const response = await apiClient.get<any[]>(
    ENDPOINTS.PRODUCTS.DISCOUNTED(pagination)
  );
  return responseTransformer(response, mapToProduct);
};

/**
 * Fetch product variations for a variable product (paginated).
 *
 * GET wc/store/v1/products?type=variation&parent={id}
 *
 * @param id - The ID of the parent (variable) product.
 * @param pagination - Optional pagination options. Defaults: { page: 1, per_page: 10 }.
 * @returns Promise resolving to { data, totalPages, total } where `data` contains `ProductVariation` items.
 * @throws Error If the request fails or the API reports a problem.
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
