import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/data/util';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { categoriesQueryOptions, categoryQueryOptions } from './queries';

export const useCategories = (categoryId: number, options?: InfiniteListQueryOptions) => {
    return useInfiniteListQuery(categoriesQueryOptions(categoryId), options);
};

export const useCategory = (categoryId: number) => {
    const result = useQuery(categoryQueryOptions(categoryId));
    const category = useMemo(() => result.data, [result.data]);

    return {
        ...result,
        category,
    };
};

