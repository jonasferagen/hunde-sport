import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/Query';
import { useQuery } from '@tanstack/react-query';
import { ProductListParams } from './api';
import {
    productQueryOptions,
    productsQueryOptions,
    productVariationsQueryOptions
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

export const useProducts = (query: ProductListParams, options?: InfiniteListQueryOptions) => {
    return useInfiniteListQuery(productsQueryOptions(query), options);
};

export const useProductVariations = (productId: number, options?: InfiniteListQueryOptions) => {
    return useInfiniteListQuery(productVariationsQueryOptions(productId), options);
};
