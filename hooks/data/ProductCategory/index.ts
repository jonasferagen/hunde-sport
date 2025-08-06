import { ProductCategory } from '@/types';
import { useInfiniteQuery } from '@tanstack/react-query';
import { handleQueryResult, queryOptions } from '../util';
import { fetchProductCategories } from './api';

export const useProductCategories = () => {

    const result = useInfiniteQuery({
        queryKey: ['product-categories'],
        queryFn: ({ pageParam }) => fetchProductCategories({ page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult<ProductCategory>(result);
};
