import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/Query';
import { useQuery } from '@tanstack/react-query';
import { getQueryStringForType, ProductListParams } from './api';
import {
    productQueryOptions,
    productsQueryOptions,
    productVariationsQueryOptions
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

export const useProductVariations = (productId: number, options?: InfiniteListQueryOptions) => {
    return useInfiniteListQuery(productVariationsQueryOptions(productId), options);
};

export const useProducts = (query: ProductListParams, options?: InfiniteListQueryOptions) => {
    const queryString = getQueryStringForType(query);
    return useInfiniteListQuery(productsQueryOptions(queryString), options);
};


