// services/products.ts
import { Product } from "@/domain/product/Product";
import { endpoints, type PaginationOpts } from "@/hooks/api/api";
import { getApiClient } from "@/lib/api/apiClient";
import { responseTransformer } from "@/lib/api/responseTransformer";
import type { ProductCategory } from "@/types";

/** Internal: limited subset of filters we still use per endpoint */
type FixedProductFilters = {
  search?: string;
  orderby?: "date" | "title" | "price";
  include?: number[];
  category?: number;
  type?: "variation";
  parent?: number;
  featured?: boolean;
  on_sale?: boolean;
};

const defaultsPaginationOpts: PaginationOpts = {
  page: 1,
  per_page: 10,
  order: "asc",
} as const;

/** Build final query params from pagination + fixed filters */
const buildListingParams = (
  paginationOpts?: PaginationOpts,
  fixedProductFilters?: FixedProductFilters,
): Record<string, unknown> => {
  const p = { ...defaultsPaginationOpts, ...(paginationOpts ?? {}) };
  const f = fixedProductFilters ?? {};
  return {
    page: p.page,
    per_page: p.per_page,
    order: p.order,
    // fixed filters
    search: f.search,
    orderby: f.orderby,
    include: f.include,
    category: f.category,
    type: f.type,
    parent: f.parent,
    featured: f.featured,
    on_sale: f.on_sale,
    // Note: we intentionally do NOT set stock_status => uses API default (instock only)
  };
};

/** Single product */
export async function fetchProduct(productId: number): Promise<Product> {
  const response = await getApiClient().get<any>(
    endpoints.products.get(productId),
  );
  if (response.problem) throw new Error(response.problem);
  return Product.create(response.data);
}

/** Featured (orderby=title & featured=true) */
export const fetchFeaturedProducts = async (
  paginationOpts?: PaginationOpts,
) => {
  const url = endpoints.products.list(
    buildListingParams(paginationOpts, { orderby: "title", featured: true }),
  );
  const response = await getApiClient().get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** By IDs */
export const fetchProductsByIds = async (
  productIds: number[],
  paginationOpts?: PaginationOpts,
) => {
  const url = endpoints.products.list(
    buildListingParams(paginationOpts, { include: productIds }),
  );
  const response = await getApiClient().get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Search */
export const fetchProductsBySearch = async (
  searchQuery: string,
  paginationOpts?: PaginationOpts,
) => {
  const url = endpoints.products.list(
    buildListingParams(paginationOpts, { search: searchQuery }),
  );
  const response = await getApiClient().get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** By Product Category */
export const fetchProductsByProductCategory = async (
  productCategory: ProductCategory,
  paginationOpts?: PaginationOpts,
) => {
  const url = endpoints.products.list(
    buildListingParams(paginationOpts, { category: productCategory.id }),
  );
  const response = await getApiClient().get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Recent (orderby=date) */
export const fetchRecentProducts = async (paginationOpts?: PaginationOpts) => {
  const url = endpoints.products.list(
    buildListingParams(paginationOpts, { orderby: "date" }),
  );
  const response = await getApiClient().get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Discounted (on_sale=true) */
export const fetchDiscountedProducts = async (
  paginationOpts?: PaginationOpts,
) => {
  const url = endpoints.products.list(
    buildListingParams(paginationOpts, { on_sale: true }),
  );
  const response = await getApiClient().get<any[]>(url);
  return responseTransformer(response, Product.create);
};

/** Variations (type=variation, parent=id, orderby=price) */
export const fetchProductVariations = async (
  parentProductId: number,
  paginationOpts?: PaginationOpts,
) => {
  const url = endpoints.products.list(
    buildListingParams(paginationOpts, {
      type: "variation",
      parent: parentProductId,
      orderby: "price",
    }),
  );
  const response = await getApiClient().get<any[]>(url);
  return responseTransformer(response, Product.create);
};
