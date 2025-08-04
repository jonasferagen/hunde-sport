import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/data/util';

import { VariableProduct } from '@/models/Product/VariableProduct';
import { Category, ProductVariation } from '@/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import {
    productQueryOptions,
    productsQueryOptions,
    productVariationQueryOptions,
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

export const useProductVariations = (variableProduct: VariableProduct, options?: { enabled?: boolean }) => {
    const results = useQueries({
        queries: (variableProduct?.variations || []).map((variation) => ({
            ...productVariationQueryOptions(variation.id),
            enabled: !!options?.enabled,
        })),
    });

    const data = results
        .map((result) => {
            if (result.data) {
                const originalVariationRef = variableProduct.variations.find((ref) => ref.id === result.data.id);
                if (originalVariationRef) {
                    result.data.variation_attributes = originalVariationRef.attributes;
                }
            }
            return result.data;
        })
        .filter((p): p is ProductVariation => p !== undefined);

    return {
        data,
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