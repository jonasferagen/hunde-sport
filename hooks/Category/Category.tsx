import { Category } from '@/types';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchCategory, fetchCategoryByCategory } from './CategoryApi';


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
        queryFn: () => fetchCategory(id)
    });

    return { ...result, category: result.data };
};


export default useCategories;