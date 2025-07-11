import { Product } from '@/types';
import { QueryClient, useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { fetchFeaturedProducts, fetchProduct, fetchProductByCategory, fetchProductsByTag, searchProducts } from './ProductApi';

const updateProductCache = (queryClient: QueryClient, queryResult: any) => {

    if (!queryResult.data) {
        return;
    }
    queryResult.data.pages.forEach((page: any) => {
        page.forEach((product: Product) => {
            queryClient.setQueryData(['product', product.id], product);
        });
    });
}


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
        updateProductCache(queryClient, queryResult);
    }, [queryResult, queryClient]);

    return queryResult;
};


export const useProductsByTag = (tagId: number) => {

    const queryClient = useQueryClient();

    const queryResult = useInfiniteQuery({
        queryKey: ['productsByTag', tagId],
        queryFn: ({ pageParam = 1 }) => fetchProductsByTag(pageParam, tagId),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === 10 ? allPages.length + 1 : undefined;
        },
        enabled: !!tagId, // Only run the query if there is a tagId
    });

    useEffect(() => {
        updateProductCache(queryClient, queryResult);
    }, [queryResult, queryClient]);

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
        updateProductCache(queryClient, queryResult);
    }, [queryResult, queryClient]);

    return queryResult;
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

    useEffect(() => {
        updateProductCache(queryClient, queryResult);
    }, [queryResult, queryClient]);

    return queryResult;

}

export const useProduct = (productId: number) => {
    return useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId)
    });
};
