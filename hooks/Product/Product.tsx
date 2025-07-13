import { Product } from '@/types';
import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchFeaturedProducts, fetchProduct, fetchProductByCategory, searchProducts } from './ProductApi';

export const useProductsByCategory = (categoryId: number) => {

    const queryClient = useQueryClient();

    const queryResult = useInfiniteQuery({
        queryKey: ['productsByCategory', categoryId],
        queryFn: ({ pageParam = 1 }) => fetchProductByCategory(pageParam, categoryId),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
    });

    const data = queryResult.data;

    useEffect(() => {
        if (data) {
            const lastPage = data.pages[data.pages.length - 1];
            lastPage.forEach((product: Product) => {
                queryClient.setQueryData(['product', product.id], product);
            });
        }
    }, [data, queryClient]);

    const products = data?.pages.flat() ?? [];

    return { ...queryResult, products };
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

    const { data, hasNextPage, isFetchingNextPage, fetchNextPage } = queryResult;

    useEffect(() => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);


    useEffect(() => {
        if (data) {
            const lastPage = data.pages[data.pages.length - 1];
            lastPage.forEach((product: Product) => {
                queryClient.setQueryData(['product', product.id], product);
            });
        }
    }, [data, queryClient]);

    const products = data?.pages.flat() ?? [];

    return { ...queryResult, products };
};

export const useSearchProducts = (query: string) => {

    const queryClient = useQueryClient();

    const queryResult = useInfiniteQuery({
        queryKey: ['searchProducts', query],
        queryFn: ({ pageParam = 1 }) => searchProducts(pageParam, query),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
        enabled: !!query, // Only run the query if there is a query string
    });

    const data = queryResult.data;

    useEffect(() => {

        if (data) {
            const lastPage = data.pages[data.pages.length - 1];
            lastPage.forEach((product: Product) => {
                queryClient.setQueryData(['product', product.id], product);
            });
        }
    }, [data, queryClient]);

    const products = data?.pages.flat() ?? [];

    return { ...queryResult, products };

}

export const useProduct = (productId: number) => {
    return useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId)
    });
};
