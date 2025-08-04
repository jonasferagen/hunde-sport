import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/data/util';

import { VariableProduct } from '@/models/Product/VariableProduct';
import { Category } from '@/types';
import { useQuery } from '@tanstack/react-query';
import {
    productQueryOptions,
    productsQueryOptions
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

// Specific hooks for different product lists
export const useProductVariations = (variableProduct: VariableProduct, options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'variations', params: variableProduct.id }), options);

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

/*
const dataWithAttributes = (data as ProductVariation[] | undefined)?.map((variation) => {
    const originalVariationRef = variableProduct.variations.find((ref) => ref.id === variation.id);
    if (originalVariationRef) {
        variation.variation_attributes = originalVariationRef.attributes;
    }
    return variation;
});

    return {
        data: dataWithAttributes || [],
        ...rest,
    };
*/