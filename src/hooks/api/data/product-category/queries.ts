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
  options?: QueryOpts,
  pagination: PaginationOpts = { per_page: 100 },
): QueryResult<ProductCategory> => {
  const queryOptions = makeQueryOptions<ProductCategory>(
    fetchProductCategories,
    undefined,
    { ...pagination },
    options,
  );

  const result = useInfiniteQuery({
    queryKey: ["product-categories"],
    ...queryOptions,
  });
  return useQueryResult<ProductCategory>(result);
};
