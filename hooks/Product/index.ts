import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ProductListType } from './api';
import {
    productQueryOptions,
    productsQueryOptions,
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

interface useProducts {
    type: ProductListType;
    categoryId?: number;
    searchQuery?: string;
}

export const useProducts = ({ type, categoryId, searchQuery }: useProducts) => {
    const query = useInfiniteQuery(productsQueryOptions({ type, categoryId, searchQuery }));
    const products = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, products };
};