import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { categoriesQueryOptions, categoryQueryOptions, categoryTrailQueryOptions } from './queries';

export const useCategoryTrail = (categoryId: number | null) => {
    return useQuery(categoryTrailQueryOptions(categoryId));
};

export const useCategories = (categoryId: number) => {
    const query = useInfiniteQuery(categoriesQueryOptions(categoryId));
    const categories = query.data?.pages.flat() ?? [];
    return { ...query, categories };
};

export const useCategory = (categoryId: number) => {
    const result = useQuery(categoryQueryOptions(categoryId));

    return {
        ...result,
        category: result.data,
    };
};
