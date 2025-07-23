import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
    fetchProduct,
    fetchProducts,
    fetchProductVariations,
    ProductListParams
} from './api';

import { PAGE_SIZE } from '@/config/api';

export const productQueryOptions = (productId: number) =>
    queryOptions({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
        enabled: !!productId,
    });

export const productsQueryOptions = (query: ProductListParams) => {
    return infiniteQueryOptions({
        queryKey: ['products', query],
        queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam, query),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
        enabled: !!query,
    });
}

export const productVariationsQueryOptions = (productId: number) => {
    return infiniteQueryOptions({
        queryKey: ['productVariations', productId],
        queryFn: ({ pageParam = 1 }) => fetchProductVariations(pageParam, productId),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
        enabled: !!productId,
    });
}
