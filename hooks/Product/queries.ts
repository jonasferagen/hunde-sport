import { Product } from '@/types';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import { fetchFeaturedProducts, fetchProduct, fetchProductByCategory, searchProducts } from './api';

import { PAGE_SIZE } from '@/config/api';

export const productQueryOptions = (productId: number) =>
    queryOptions({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
        enabled: !!productId,
    });

const productInfiniteQueryOptions = (
    queryKey: (string | number | object)[],
    queryFn: ({ pageParam }: { pageParam: number }) => Promise<Product[]>,
    options: { enabled?: boolean } = {}
) =>
    infiniteQueryOptions({
        queryKey,
        queryFn,
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
        ...options,
    });

export const productsByCategoryQueryOptions = (categoryId: number) =>
    productInfiniteQueryOptions(
        ['productsByCategory', categoryId],
        ({ pageParam }) => fetchProductByCategory(pageParam, categoryId)
    );

export const featuredProductsQueryOptions = () =>
    productInfiniteQueryOptions(
        ['featuredProducts'],
        ({ pageParam }) => fetchFeaturedProducts(pageParam)
    );

export const searchProductsQueryOptions = (query: string) =>
    productInfiniteQueryOptions(
        ['searchProducts', query],
        ({ pageParam }) => searchProducts(pageParam, query),
        { enabled: !!query }
    );
