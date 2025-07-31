import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/data/util';
import { ProductVariation, VariableProduct } from '@/models/Product';
import { Category } from '@/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    productQueryOptions,
    productsQueryOptions,
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

export const useProductVariations = (variableProduct: VariableProduct, options?: { enabled?: boolean }) => {
    const results = useQueries({
        queries: (variableProduct?.variations || []).map((variation) => ({
            ...productQueryOptions(variation.id),
            enabled: !!options?.enabled,
        })),
    });

    return {
        data: results.map((result) => result.data).filter(Boolean) as ProductVariation[],
        isLoading: results.some((result) => result.isLoading),
        isError: results.some((result) => result.isError),
        isSuccess: results.every((result) => result.isSuccess),
    };
};

// Specific hooks for different product lists
export const useFeaturedProducts = (options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'featured' }), options);

export const useRecentProducts = (options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'recent' }), options);

export const useDiscountedProducts = (options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'discounted' }), options);

export const useProductsByCategory = (category: Category, options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'category', params: category.id }), options);

export const useProductsBySearch = (searchTerm: string, options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'search', params: searchTerm }), options);

export const useProductsByIds = (ids: number[], options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'ids', params: ids }), options);
