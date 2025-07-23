import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
    fetchProduct,
    fetchProducts,
    fetchProductVariations
} from './api';

import { PAGE_SIZE } from '@/config/api';

export const productQueryOptions = (productId: number) =>
    queryOptions({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId),
        enabled: !!productId,
    });

export const productsQueryOptions = (queryString: string) => {
    return infiniteQueryOptions({
        queryKey: ['product', queryString],
        queryFn: ({ pageParam = 1 }) => fetchProducts(pageParam, queryString),
        initialPageParam: 1,
        getNextPageParam: (lastPage, allPages) => {
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
        enabled: !!queryString,
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
