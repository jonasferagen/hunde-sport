import { useInfiniteQuery, useQuery, UseQueryResult } from '@tanstack/react-query';

import { ProductCategory } from '@/types';

import { makeQueryOptions,useQueryResult } from '../util';
import { fetchProductCategories, fetchProductCategory } from './api';



const queryOptions = makeQueryOptions<ProductCategory>();

export const useProductCategories = () => {

    const result = useInfiniteQuery({
        queryKey: ['product-categories'],
        queryFn: ({ pageParam }) => fetchProductCategories({ page: pageParam }),
        ...queryOptions
    });
    return useQueryResult<ProductCategory>(result);
};

export const useProductCategory = (id: number, options = { enabled: true }): UseQueryResult<ProductCategory> => {
    const result = useQuery({
        queryKey: ['product-category', id],
        queryFn: () => fetchProductCategory(id),
        ...options,
    });
    return result;
};