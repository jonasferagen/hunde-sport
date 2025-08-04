import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { fetchCategories, fetchCategoryById } from './api';

import { PAGE_SIZE } from '@/config/api';

export const categoriesQueryOptions = () =>
    infiniteQueryOptions({
        queryKey: ['categories'],
        queryFn: ({ pageParam = 1 }) => fetchCategories(pageParam),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
    });

export const categoryQueryOptions = (categoryId: number) =>
    queryOptions({
        queryKey: ['categoryId', categoryId],
        queryFn: () => fetchCategoryById(categoryId),
    });
