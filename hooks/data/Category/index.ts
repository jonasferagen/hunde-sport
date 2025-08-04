import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/data/util';
import { categoriesQueryOptions } from './queries';

export const useCategories = (options?: InfiniteListQueryOptions) => {
    return useInfiniteListQuery(categoriesQueryOptions(), options);
};

