// services/products.ts
import { Product } from "@/domain/product/Product";
import { endpoints, type Pagination } from "@/hooks/api/api";
import { apiClient } from "@/lib/api/apiClient";
import { responseTransformer } from "@/lib/api/responseTransformer";
import type { ProductCategory } from "@/types";

/** Filters supported for Woo Store API product listing */
export type ProductFilters = {
  /** true (default) => API default (instock only). false => include all stock statuses. */
  onlyInStock?: boolean;
  search?: string;
  orderby?: string;          // e.g., "date", "title", "price"
  include?: number[];        // product IDs
  category?: number;         // term ID
  type?: "variation";
  parent?: number;           // parent product for variations
  featured?: boolean;
  on_sale?: boolean;
};

export type QueryOptions = {
  pagination?: Pagination;
  filters?: ProductFilters;
};

const STOCK_ANY = ["instock", "onbackorder", "outofstock"] as const;

const defaults = {
  pagination: { page: 1, per_page: 10, order: "asc" as const },
} as const;

/** Shallow merge for { pagination, filters } */
const mergeOptions = (a?: QueryOptions, b?: QueryOptions): QueryOptions => ({
  pagination: { ...a?.pagination, ...b?.pagination },
  filters: { ...a?.filters, ...b?.filters },
});

/** Turn QueryOptions into URL param record */
const buildParams = (opts?: QueryOptions): Record<string, unknown> => {
  const p = { ...defaults.pagination, ...(opts?.pagination ?? {}) };
  const f = opts?.filters ?? {};

  // Only set stock_status when caller explicitly wants "any" stock
  const stock =
    f.onlyInStock === false ? { stock_status: [...STOCK_ANY] } : undefined;

  return {
    page: p.page,
    per_page: p.per_page,
    order: p.order,

    ...stock,
    search: f.search,
    orderby: f.orderby,
    include: f.include,
    category: f.category,
    type: f.type,
    parent: f.parent,
    featured: f.featured,
    on_sale: f.on_sale,
  };
};

/** Single product */
export async function fetchProduct(id: number): Promise<Product> {
  const response = await apiClient.get<any>(endpoints.products.get(id));
  if (response.problem) throw new Error(response.problem);
  return Product.create(response.data);
}

/** Featured (orderby=title & featured=true) */
export const fetchFeaturedProducts = async (opts?: QueryOptions) => {
  const url = endpoints.products.list(
    buildParams(mergeOptions(opts, { filters: { orderby: "title", featured: true } }))
  );
  const response = await apiClient.get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** By IDs */
export const fetchProductsByIds = async (ids: number[], opts?: QueryOptions) => {
  const url = endpoints.products.list(
    buildParams(mergeOptions(opts, { filters: { include: ids } }))
  );
  const response = await apiClient.get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Search */
export const fetchProductsBySearch = async (query: string, opts?: QueryOptions) => {
  const url = endpoints.products.list(
    buildParams(mergeOptions(opts, { filters: { search: query } }))
  );
  const response = await apiClient.get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** By Product Category */
export const fetchProductsByProductCategory = async (
  productCategory: ProductCategory,
  opts?: QueryOptions
) => {
  const url = endpoints.products.list(
    buildParams(mergeOptions(opts, { filters: { category: productCategory.id } }))
  );
  const response = await apiClient.get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Recent (orderby=date) */
export const fetchRecentProducts = async (opts?: QueryOptions) => {
  const url = endpoints.products.list(
    buildParams(mergeOptions(opts, { filters: { orderby: "date" } }))
  );
  const response = await apiClient.get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Discounted (on_sale=true) */
export const fetchDiscountedProducts = async (opts?: QueryOptions) => {
  const url = endpoints.products.list(
    buildParams(mergeOptions(opts, { filters: { on_sale: true } }))
  );
  const response = await apiClient.get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Variations (type=variation, parent=id, orderby=price) */
export const fetchProductVariations = async (id: number, opts?: QueryOptions) => {
  const url = endpoints.products.list(
    buildParams(
      mergeOptions(opts, { filters: { type: "variation", parent: id, orderby: "price" } })
    )
  );
  const response = await apiClient.get<any[]>(url);
  return responseTransformer(response, Product.create);
};
