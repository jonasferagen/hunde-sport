import { Product } from '@/models/Product';
import { infiniteQueryOptions, queryOptions } from '@tanstack/react-query';
import {
    fetchProduct,
    fetchProductByCategory,
    fetchProducts,
    fetchProductsByIds,
    fetchProductVariations,
    ProductListType,
    searchProducts,
} from './api';

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
            //return undefined;
            return lastPage.length === PAGE_SIZE ? allPages.length + 1 : undefined;
        },
        ...options,
    });

export const productsByCategoryQueryOptions = (categoryId: number) =>
    productInfiniteQueryOptions(
        ['productsByCategory', categoryId],
        ({ pageParam }) => fetchProductByCategory(pageParam, categoryId)
    );

export const productsByIdsQueryOptions = (ids: number[]) =>
    productInfiniteQueryOptions(
        ['products', { ids: [...ids].sort() }],
        ({ pageParam }) => fetchProductsByIds(pageParam, ids),
        { enabled: ids.length > 0 }
    );

export const productVariationsQueryOptions = (productId: number) =>
    productInfiniteQueryOptions(
        ['productVariations', productId],
        ({ pageParam }) => fetchProductVariations(pageParam, productId),
        { enabled: !!productId }
    );

export const productsQueryOptions = (type: ProductListType) =>
    productInfiniteQueryOptions(['products', type], ({ pageParam }) =>
        fetchProducts(pageParam, type)
    );

export const searchProductsQueryOptions = (query: string) =>
    productInfiniteQueryOptions(
        ['searchProducts', query],
        ({ pageParam }) => searchProducts(pageParam, query),
        { enabled: !!query }
    );
