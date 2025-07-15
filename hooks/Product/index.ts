import { Product } from '@/types';
import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import {
    featuredProductsQueryOptions,
    productQueryOptions,
    productsByCategoryQueryOptions,
    searchProductsQueryOptions,
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

export const useProducts = (productIds: number[]) => {
    const queries = useQueries({
        queries: (productIds || []).map(id => productQueryOptions(id)),
    });

    const products = useMemo(
        () => queries.map(query => query.data).filter((p): p is Product => Boolean(p)),
        [queries]
    );

    const isLoading = useMemo(() => queries.some(query => query.isLoading), [queries]);

    return { products, isLoading };
};

export const useProductsByCategory = (categoryId: number) => {
    const query = useInfiniteQuery(productsByCategoryQueryOptions(categoryId));
    return { ...query, products: query.data?.pages.flat() ?? [] };
};

export const useFeaturedProducts = () => {
    const query = useInfiniteQuery(featuredProductsQueryOptions());
    return { ...query, products: query.data?.pages.flat() ?? [] };
};

export const useSearchProducts = (query: string) => {
    const searchQuery = useInfiniteQuery(searchProductsQueryOptions(query));
    return { ...searchQuery, products: searchQuery.data?.pages.flat() ?? [] };
};
