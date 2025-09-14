import { useInfiniteQuery } from "@tanstack/react-query";

import type { PaginationOpts } from "@/hooks/api/api";
import {
  makeQueryOptions,
  type QueryOpts,
  type QueryResult,
  useQueryResult,
} from "@/lib/api/query";
import { ProductCategory } from "@/types";

import { fetchProductCategories } from "./api";

export const useProductCategories = (
  options: QueryOpts,
  pagination: PaginationOpts,
): QueryResult<ProductCategory> => {
  const queryOptions = makeQueryOptions<ProductCategory>(options);
  const result = useInfiniteQuery({
    queryKey: ["product-categories"],
    queryFn: ({ pageParam }) =>
      fetchProductCategories({ page: pageParam, ...pagination }),
    ...queryOptions,
    ...options,
  });
  return useQueryResult<ProductCategory>(result);
};
