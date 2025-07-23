import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ProductListParams } from './api';
import {
    productQueryOptions,
    productsQueryOptions,
    productVariationsQueryOptions
} from './queries';


export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

export const useProducts = (query: ProductListParams) => {
    const queryResult = useInfiniteQuery(productsQueryOptions(query));
    const products = useMemo(() => queryResult.data?.pages.flat() ?? [], [queryResult.data]);
    return { ...queryResult, products };
};

export const useProductVariations = (productId: number) => {
    const query = useInfiniteQuery(productVariationsQueryOptions(productId));
    const productVariations = useMemo(() => query.data?.pages.flat() ?? [], [query.data]);
    return { ...query, productVariations };
};
