import { useInfiniteQuery } from "@tanstack/react-query";

import {
  makeQueryOptions,
  type QueryResult,
  useQueryResult,
} from "@/lib/api/query";
import { ProductCategory } from "@/types";

import { fetchProductCategories } from "./api";

const queryOptions = makeQueryOptions<ProductCategory>();

export const useProductCategories = (
  options = { }
): QueryResult<ProductCategory> => {
  const result = useInfiniteQuery({
    queryKey: ["product-categories"],
    queryFn: ({ pageParam }) => fetchProductCategories({ page: pageParam, per_page: 20 }),
    ...queryOptions,
    ...options,
  });
  return useQueryResult<ProductCategory>(result);
};
