import { InfiniteListQueryOptions, useInfiniteListQuery } from '@/hooks/data/util';
import { useQuery } from '@tanstack/react-query';
import {
    productQueryOptions,
    productsQueryOptions,
    productVariationsQueryOptions
} from './queries';

export const useProduct = (id: number) => {
    return useQuery(productQueryOptions(id));
};

export const useProductVariations = (productId: number, options?: InfiniteListQueryOptions) => {
    if (productId === 248212) {
        console.log("useProductVariations should not be called for ", productId);

    }
    return useInfiniteListQuery(productVariationsQueryOptions(productId), options);
}

// Specific hooks for different product lists
export const useFeaturedProducts = (options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'featured' }), options);

export const useRecentProducts = (options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'recent' }), options);

export const useDiscountedProducts = (options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'discounted' }), options);

export const useProductsByCategory = (categoryId: number, options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'category', params: categoryId }), options);

export const useProductsBySearch = (searchTerm: string, options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'search', params: searchTerm }), options);

export const useProductsByIds = (ids: number[], options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'ids', params: ids }), options);
