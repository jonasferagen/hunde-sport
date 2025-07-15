import { Category } from '@/types';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { fetchCategoryByCategory, fetchCategoryById } from './api';

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

export const categoryQueryOptions = (id: number) =>
    queryOptions({
        queryKey: ['category', id],
        queryFn: () => fetchCategoryById(id),
        enabled: !!id,
    });

export const categoryTrailQueryOptions = (categoryId: number | null) =>
    queryOptions<Category[]>({
        queryKey: ['categoryTrail', categoryId],
        queryFn: async ({ client: queryClient }) => {
            if (!categoryId) return [];

            const trail: Category[] = [];
            let currentCategoryId: number | null = categoryId;

            while (currentCategoryId !== null && currentCategoryId !== 0) {
                const category: Category = await queryClient.fetchQuery(
                    categoryQueryOptions(currentCategoryId)
                );
                trail.unshift(category);
                currentCategoryId = category.parent;
            }
            return trail;
        },
        enabled: !!categoryId,
    });
