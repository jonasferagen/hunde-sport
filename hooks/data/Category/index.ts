import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/data/util';
import { categoriesQueryOptions } from './queries';

export const useCategories = (categoryId: number, options?: InfiniteListQueryOptions) => {
    return useInfiniteListQuery(categoriesQueryOptions(categoryId), options);
};
/*
export const useCategory = (categoryId: number) => {
    const result = useQuery(categoryQueryOptions(categoryId));
    const category = useMemo(() => result.data, [result.data]);

    return {
        ...result,
        category,
    };
};
*/
