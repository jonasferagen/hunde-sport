import {
  useInfiniteQuery,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import type { PaginationOpts } from "@/hooks/api/api";
import {
  makeQueryOptions,
  type QueryOpts,
  type QueryResult,
  useQueryResult,
} from "@/lib/api/query";
import {
  type Product,
  ProductCategory,
  ProductVariation,
  type PurchasableProduct,
} from "@/types";

import {
  fetchDiscountedProducts,
  fetchFeaturedProducts,
  fetchProduct,
  fetchProductsByIds,
  fetchProductsByProductCategory,
  fetchProductsBySearch,
  fetchProductVariations,
  fetchRecentProducts,
} from "./api";

export const useProduct = (id: number): UseQueryResult<PurchasableProduct> => {
  const result = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
  });
  return result;
};

export const useDebugProducts = (
  ids: number[],
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  const result = useInfiniteQuery({
    enabled: !!ids && ids.length > 0,
    queryKey: ["products-by-ids", ids],
    queryFn: ({ pageParam }) =>
      fetchProductsByIds(ids, { page: pageParam, ...pagination }),
    ...queryOptions,
    ...options,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductsBySearch = (
  query: string,
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  const result = useInfiniteQuery({
    enabled: !!query,
    queryKey: ["products-by-search", query],
    queryFn: ({ pageParam }) =>
      fetchProductsBySearch(query, { page: pageParam, ...pagination }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useFeaturedProducts = (
  options?: QueryOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  const result = useInfiniteQuery({
    queryKey: ["featured-products"],
    queryFn: ({ pageParam }) =>
      fetchFeaturedProducts({
        page: pageParam,
        per_page: 3,
        ...options,
      }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductsByProductCategory = (
  productCategory: ProductCategory,
  options?: QueryOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  const result = useInfiniteQuery({
    queryKey: ["products-by-product-category", productCategory.id],
    queryFn: ({ pageParam }) =>
      fetchProductsByProductCategory(productCategory, {
        page: pageParam,
        per_page: 3,
        ...options,
      }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useDiscountedProducts = (
  options?: QueryOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  const result = useInfiniteQuery({
    queryKey: ["on-sale-products"],
    queryFn: ({ pageParam }) =>
      fetchDiscountedProducts({
        page: pageParam,
        per_page: 3,
        ...options,
      }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useRecentProducts = (
  options?: QueryOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  const result = useInfiniteQuery({
    queryKey: ["recent-products"],
    queryFn: ({ pageParam }) =>
      fetchRecentProducts({
        page: pageParam,
        per_page: 3,
        ...options,
      }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductVariations = (
  product: Product,
  options?: QueryOpts,
): QueryResult<ProductVariation> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  const result = useInfiniteQuery({
    enabled: product.isVariable,
    queryKey: ["product-variations", product.id],
    queryFn: ({ pageParam }) =>
      fetchProductVariations(product.id, {
        page: pageParam,
        ...options,
      }),
    ...queryOptions,
  });
  return useQueryResult<ProductVariation>(result);
};

export function useProductVariation(
  product: Product,
  options?: QueryOpts,
  pagination?: PaginationOpts,
) {
  const queryOptions = makeQueryOptions<PurchasableProduct>(options);
  return useQuery({
    enabled: product.isVariable,
    queryKey: ["product-variation", product.id, pagination?.order],
    queryFn: async () => {
      const page = await fetchProductVariations(product.id, {
        per_page: 1,
        ...options,
      });
      return page.data[0] ?? null;
    },
    ...queryOptions,
  });
}
