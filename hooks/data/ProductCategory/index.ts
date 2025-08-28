import { useInfiniteQuery } from "@tanstack/react-query";

import { ProductCategory } from "@/types";

import { makeQueryOptions, useQueryResult } from "../util";
import { fetchProductCategories } from "./api";

const queryOptions = makeQueryOptions<ProductCategory>();

export const useProductCategories = (options = { enabled: true }) => {
  const result = useInfiniteQuery({
    queryKey: ["product-categories"],
    queryFn: ({ pageParam }) =>
      fetchProductCategories({ page: pageParam, per_page: 100 }),
    ...queryOptions,
    ...options,
  });
  return useQueryResult<ProductCategory>(result);
};

/*
import { fetchProductCategories, fetchProductCategory } from "./api";

export const useProductCategory = (
  id: number,
  options = { enabled: true }
): UseQueryResult<ProductCategory> => {
  const result = useQuery({
    queryKey: ["product-category", id],
    queryFn: () => fetchProductCategory(id),
    ...options,
  });
  return result;
};
 
*/
