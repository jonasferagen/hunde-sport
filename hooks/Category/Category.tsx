import { Category } from '@/types';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCategoryByCategory, fetchCategoryById } from './CategoryApi';

export const buildCategoryTrail = async (queryClient: any, categoryId: number): Promise<Category[]> => {
    const trail: Category[] = [];
    let currentCategoryId: number | null = categoryId;

    while (currentCategoryId !== null && currentCategoryId !== 0) {
        try {
            const category: Category = await queryClient.fetchQuery({
                queryKey: ['category', currentCategoryId],
                queryFn: () => fetchCategoryById(currentCategoryId!),
            });
            trail.unshift(category); // Add to the beginning of the array
            currentCategoryId = category.parent;
        } catch (error) {
            console.error('Failed to fetch category trail:', error);
            break;
        }
    }

    return trail;
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
