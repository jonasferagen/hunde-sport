import { Product } from '@/models/Product';
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
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);

    return { ...query, products };
};

export const useFeaturedProducts = () => {
    const query = useInfiniteQuery(featuredProductsQueryOptions());
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, products };
};

export const useSearchProducts = (query: string) => {
    const searchQuery = useInfiniteQuery(searchProductsQueryOptions(query));
    const products = useMemo(() => searchQuery.data?.pages.flat() ?? [], [searchQuery.data]);
    return { ...searchQuery, products };
};
