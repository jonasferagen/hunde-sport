import { Category } from '@/types';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCategoryByCategory, fetchCategoryById } from './api';

export const useCategoryTrail = (categoryId: number | null) => {
    const queryClient = useQueryClient();

    return useQuery<Category[], Error>({
        queryKey: ['categoryTrail', categoryId],
        queryFn: async () => {
            if (!categoryId) return [];

            const trail: Category[] = [];
            let currentCategoryId: number | null = categoryId;

            while (currentCategoryId !== null && currentCategoryId !== 0) {
                const category: Category = await queryClient.fetchQuery({
                    queryKey: ['category', currentCategoryId],
                    queryFn: () => fetchCategoryById(currentCategoryId!),
                });
                trail.unshift(category);
                currentCategoryId = category.parent;
            }
            return trail;
        },
        enabled: !!categoryId, // Only run the query if categoryId is not null or 0
    });
};

export const useCategories = (categoryId: number) => {

    const queryClient = useQueryClient();

    const queryResult = useInfiniteQuery({
        queryKey: ['categoriesByCategory', categoryId],
        queryFn: ({ pageParam = 1 }) => fetchCategoryByCategory(pageParam, categoryId),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            // Assuming a page size of 10, if the last page has 10 items, there might be more.
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },

    });

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = queryResult;

    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    useEffect(() => {
        if (data) {
            // When we fetch the list of products, we can populate the cache for each individual product.
            data.pages.forEach(page => {
                page.forEach(item => {
                    queryClient.setQueryData(['category', item.id], item);
                });
            });
        }
    }, [data, queryClient]);

    const categories = data?.pages.flat() ?? [];

    return { ...queryResult, categories };
};

export const useCategory = (categoryId: number | string) => {
    const id = Number(categoryId);
    const result = useQuery<Category>({
        queryKey: ['category', id],
        queryFn: () => fetchCategoryById(id)
    });

    const category = result.data;

    return {
        ...result, category
    };
}
