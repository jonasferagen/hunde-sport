import { Product } from '@/models/Product';
import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ProductListType } from './api';
import {
    productQueryOptions,
    productsListQueryOptions,
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

export const useProducts = (ids: number[]) => {
    return useProductsList('ids', ids);
};

export const useProductsByCategory = (categoryId: number) => {
    return useProductsList('category', categoryId);
};

export const useProductsByQueryString = (queryString: string) => {
    return useProductsList('search', queryString);
};

export const useFeaturedProducts = () => {
    return useProductsList('featured');
};

export const useRecentProducts = () => {
    return useProductsList('recent');
};

export const useDiscountedProducts = () => {
    return useProductsList('discounted');
};


export const useProductsList = (type: ProductListType, params?: any) => {
    const query = useInfiniteQuery(productsListQueryOptions(type, params));
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, products };
};

export const useProductVariations = (productId: number) => {
    const query = useInfiniteQuery(productVariationsQueryOptions(productId));
    const productVariations = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, productVariations };
};
