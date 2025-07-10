import { Product } from '@/types';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchFeaturedProducts, fetchProduct, fetchProductByCategory } from './ProductApi';




export const useProductsByCategory = (categoryId: number) => {

    const queryClient = useQueryClient();

    const queryResult = useInfiniteQuery({
        queryKey: ['productsByCategory', categoryId],
        queryFn: ({ pageParam = 1 }) => fetchProductByCategory(pageParam, categoryId),
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
                page.forEach(product => {
                    queryClient.setQueryData(['product', product.id], product);
                });
            });
        }
    }, [queryResult.data, queryClient]);

    return queryResult;
};

export const useFeaturedProducts = () => {

    const queryClient = useQueryClient();

    const queryResult = useInfiniteQuery({
        queryKey: ['featuredProducts'],
        queryFn: ({ pageParam = 1 }) => fetchFeaturedProducts(pageParam),
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
                page.forEach(product => {
                    queryClient.setQueryData(['product', product.id], product);
                });
            });
        }
    }, [queryResult.data, queryClient]);
    return queryResult;
};

export const useProduct = (productId: number) => {
    return useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId)
    });
};
