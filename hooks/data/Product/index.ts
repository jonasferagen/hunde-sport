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

export const useProductVariations = (productId: number, options?: InfiniteListQueryOptions) =>
    useInfiniteListQuery(productVariationsQueryOptions(productId), options);

// Specific hooks for different product lists
export const useFeaturedProducts = () =>
    useInfiniteListQuery(productsQueryOptions({ type: 'featured', params: undefined }));

export const useRecentProducts = () =>
    useInfiniteListQuery(productsQueryOptions({ type: 'recent', params: undefined }));

export const useDiscountedProducts = () =>
    useInfiniteListQuery(productsQueryOptions({ type: 'discounted', params: undefined }));

export const useProductsByCategory = (categoryId: number) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'category', params: categoryId }), { autoload: false });

export const useProductsBySearch = (searchTerm: string) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'search', params: searchTerm }), { autoload: false });

export const useProductsByIds = (ids: number[]) =>
    useInfiniteListQuery(productsQueryOptions({ type: 'ids', params: ids }));
