import { Product } from '@/models/Product';
import { useInfiniteQuery, UseInfiniteQueryOptions, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ProductListType } from './api';
import {
    productQueryOptions,
    productsByCategoryQueryOptions,
    productsByIdsQueryOptions,
    productsQueryOptions,
    productVariationsQueryOptions,
    searchProductsQueryOptions,
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

export const useRelatedProducts = (ids: number[]) => {
    const query = useInfiniteQuery(productsByIdsQueryOptions(ids));
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, products };
};

export const useProductVariations = (productId: number) => {
    const query = useInfiniteQuery(productVariationsQueryOptions(productId));
    const productVariations = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, productVariations };
};

export const useProductsList = (type: ProductListType) => {
    const query = useInfiniteQuery(productsQueryOptions(type));
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, products };
};

export const useProductsByCategory = (categoryId: number) => {
    const query = useInfiniteQuery(productsByCategoryQueryOptions(categoryId));
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, products };
};

export const useSearchProducts = (query: string) => {
    const searchQuery = useInfiniteQuery(searchProductsQueryOptions(query));
    const products = useMemo(() => searchQuery.data?.pages.flat() ?? [], [searchQuery.data]);
    return { ...searchQuery, products };
};