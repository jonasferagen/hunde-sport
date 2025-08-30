import { useInfiniteQuery } from "@tanstack/react-query";

import {
  makeQueryOptions,
  QueryResult,
  useQueryResult,
} from "@/lib/query/query";
import { ProductCategory } from "@/types";

import { fetchProductCategories } from "./api";

const queryOptions = makeQueryOptions<ProductCategory>();

export const useProductCategories = (
  options = { enabled: true }
): QueryResult<ProductCategory> => {
  const result = useInfiniteQuery({
    queryKey: ["product-categories"],
    queryFn: ({ pageParam }) =>
      fetchProductCategories({ page: pageParam, per_page: 50 }),
    ...queryOptions,
    ...options,
  });
  return useQueryResult<ProductCategory>(result);
};
