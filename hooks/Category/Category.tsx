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

    useEffect(() => {
        if (queryResult.data) {
            // When we fetch the list of products, we can populate the cache for each individual product.
            queryResult.data.pages.forEach(page => {
                page.forEach(item => {
                    queryClient.setQueryData(['category', item.id], item);
                });
            });
        }
    }, [queryResult.data, queryClient]);
    return queryResult;
};

export const useCategory = (categoryId: number) => {

    return useQuery<Category>({
        queryKey: ['category', categoryId],
        queryFn: () => fetchCategory(categoryId)
    });
};


export default useCategories;