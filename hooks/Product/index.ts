import { Product } from '@/models/Product';
import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ProductListType } from './api';
import {
    productQueryOptions,
    productsQueryOptions,
    productVariationsQueryOptions
} from './queries';

// Define a type for the options to ensure type safety.
// This allows passing any valid `useInfiniteQuery` option, except for the ones already defined in `productVariationsQueryOptions`.
type ProductVariationsQueryOptions = Omit<
    UseInfiniteQueryOptions<Product[], Error, Product[], Product[], (string | number)[]>,
    'queryKey' | 'queryFn' | 'initialPageParam' | 'getNextPageParam'
>;

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};


export const useProducts = (type: ProductListType, params?: any) => {
    const query = useInfiniteQuery(productsQueryOptions(type, params));
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, products };
};

export const useProductVariations = (productId: number) => {
    const query = useInfiniteQuery(productVariationsQueryOptions(productId));
    const productVariations = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, productVariations };
};
