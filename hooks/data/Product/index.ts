import {
  useInfiniteQuery,
  useQuery,
  type UseQueryResult,
} from "@tanstack/react-query";

import {
  makeQueryOptions,
  type QueryResult,
  useQueryResult,
} from "@/lib/query/query";
import {
  ProductCategory,
  ProductVariation,
  type PurchasableProduct,
  VariableProduct,
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

const queryOptions = makeQueryOptions<PurchasableProduct>();

export const useProduct = (
  id: number,
  options = { enabled: true }
): UseQueryResult<PurchasableProduct> => {
  const result = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id),
    ...options,
  });
  return result;
};

export const useProductsByIds = (
  ids: number[]
): QueryResult<PurchasableProduct> => {
  const result = useInfiniteQuery({
    queryKey: ["products-by-ids", ids],
    queryFn: ({ pageParam }) => fetchProductsByIds(ids, { page: pageParam }),
    enabled: !!ids && ids.length > 0,
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductsBySearch = (
  query: string,
  options = { enabled: !!query }
): QueryResult<PurchasableProduct> => {
  const result = useInfiniteQuery({
    queryKey: ["products-by-search", query],
    queryFn: ({ pageParam }) =>
      fetchProductsBySearch(query, { page: pageParam }),
    ...options,
    ...queryOptions,
    placeholderData: undefined, // empty list
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useFeaturedProducts = (
  options = { enabled: true, perPage: 3 }
): QueryResult<PurchasableProduct> => {
  const result = useInfiniteQuery({
    queryKey: ["featured-products"],
    queryFn: ({ pageParam }) =>
      fetchFeaturedProducts({ page: pageParam, per_page: options.perPage }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductsByProductCategory = (
  productCategory: ProductCategory,
  options = { enabled: true, perPage: 3 }
): QueryResult<PurchasableProduct> => {
  const result = useInfiniteQuery({
    queryKey: ["products-by-product-category", productCategory.id],
    queryFn: ({ pageParam }) =>
      fetchProductsByProductCategory(productCategory, {
        page: pageParam,
        per_page: options.perPage,
      }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useDiscountedProducts = (
  options = { enabled: true, perPage: 3 }
): QueryResult<PurchasableProduct> => {
  const result = useInfiniteQuery({
    queryKey: ["on-sale-products"],
    queryFn: ({ pageParam }) =>
      fetchDiscountedProducts({ page: pageParam, per_page: options.perPage }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useRecentProducts = (
  options = { enabled: true, perPage: 3 }
): QueryResult<PurchasableProduct> => {
  const result = useInfiniteQuery({
    queryKey: ["recent-products"],
    queryFn: ({ pageParam }) =>
      fetchRecentProducts({ page: pageParam, per_page: options.perPage }),
    ...queryOptions,
  });
  return useQueryResult<PurchasableProduct>(result);
};

export const useProductVariations = (
  variableProduct: VariableProduct,
  options = { perPage: 10 }
): QueryResult<ProductVariation> => {
  const result = useInfiniteQuery({
    queryKey: ["product-variations", variableProduct.id],
    queryFn: ({ pageParam }) =>
      fetchProductVariations(variableProduct.id, {
        page: pageParam,
        per_page: options.perPage,
      }),
    enabled: variableProduct.type === "variable",
    ...queryOptions,
  });
  return useQueryResult<ProductVariation>(result);
};
