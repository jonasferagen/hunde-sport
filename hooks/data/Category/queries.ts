import { infiniteQueryOptions } from '@tanstack/react-query';
import { fetchCategoryByCategory } from './api';

import { PAGE_SIZE } from '@/config/api';

export const categoriesQueryOptions = (categoryId: number) =>
    infiniteQueryOptions({
        queryKey: ['categoriesByCategory', categoryId],
        queryFn: ({ pageParam = 1 }) => fetchCategoryByCategory(pageParam, categoryId),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
    });
/*
export const categoryQueryOptions = (categoryId: number) =>
    queryOptions({
        queryKey: ['categoryId', categoryId],
        queryFn: () => fetchCategoryById(categoryId),
    });

*/