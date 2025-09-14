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
  const queryOptions = makeQueryOptions<PurchasableProduct>(
    fetchProductsByIds,
    ids,
    pagination,
    options,
  );
  const result = useInfiniteQuery({
    enabled: !!ids && ids.length > 0,
    queryKey: ["products-by-ids", ids],
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductsBySearch = (
  query: string,
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(
    fetchProductsBySearch,
    query,
    pagination,
    options,
  );

  const result = useInfiniteQuery({
    enabled: !!query,
    queryKey: ["products-by-search", query],
    ...queryOptions,
  });

  return useQueryResult<PurchasableProduct>(result);
};

export const useFeaturedProducts = (
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(
    fetchFeaturedProducts,
    undefined,
    { per_page: 3, ...pagination },
    options,
  );

  const result = useInfiniteQuery({
    queryKey: ["featured-products"],
    ...queryOptions,
  });

  return useQueryResult<PurchasableProduct>(result);
};

export const useProductsByProductCategory = (
  productCategory: ProductCategory,
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(
    fetchProductsByProductCategory,
    productCategory,
    { per_page: 3, ...pagination },
    options,
  );
  const result = useInfiniteQuery({
    queryKey: ["products-by-product-category", productCategory.id],
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useDiscountedProducts = (
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(
    fetchDiscountedProducts,
    undefined,
    { per_page: 3, ...pagination },
    options,
  );
  const result = useInfiniteQuery({
    queryKey: ["on-sale-products"],
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useRecentProducts = (
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<PurchasableProduct> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(
    fetchRecentProducts,
    undefined,
    { per_page: 3, ...pagination },
    options,
  );
  const result = useInfiniteQuery({
    queryKey: ["recent-products"],
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductVariations = (
  product: Product,
  options?: QueryOpts,
  pagination?: PaginationOpts,
): QueryResult<ProductVariation> => {
  const queryOptions = makeQueryOptions<PurchasableProduct>(
    fetchProductVariations,
    product.id,
    { per_page: 3, ...pagination },
    options,
  );
  const result = useInfiniteQuery({
    enabled: product.isVariable,
    queryKey: ["product-variations", product.id],
    ...queryOptions,
  });
  return useQueryResult<ProductVariation>(result);
};

export function useProductVariation(
  product: Product,
  options?: QueryOpts,
  pagination?: PaginationOpts,
) {
  return useQuery({
    enabled: product.isVariable,
    queryKey: ["product-variation", product.id, pagination?.order],
    queryFn: async () => {
      const page = await fetchProductVariations(product.id, {
        per_page: 1,
        ...pagination,
      });
      return page.data[0] ?? null;
    },
  });
}
