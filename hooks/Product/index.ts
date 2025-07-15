import { useInfiniteQuery, useQueries, useQuery } from '@tanstack/react-query';
import {
    featuredProductsQueryOptions,
    productQueryOptions,
    productsByCategoryQueryOptions,
    searchProductsQueryOptions,
} from './queries';

export const useProduct = (productId: number) => {
    return useQuery(productQueryOptions(productId));
};

export const useProductVariations = (productIds: number[]) => {
    return useQueries({
        queries: productIds.map(id => productQueryOptions(id)),
    });
};

export const useRelatedProducts = (productIds: number[]) => {
    return useQueries({
        queries: (productIds || []).map(id => productQueryOptions(id)),
    });
};

export const useProductsByCategory = (categoryId: number) => {
    const query = useInfiniteQuery(productsByCategoryQueryOptions(categoryId));
    return { ...query, products: query.data?.pages.flat() ?? [] };
};

export const useFeaturedProducts = () => {
    const query = useInfiniteQuery(featuredProductsQueryOptions());
    return { ...query, products: query.data?.pages.flat() ?? [] };
};

export const useSearchProducts = (query: string) => {
    const searchQuery = useInfiniteQuery(searchProductsQueryOptions(query));
    return { ...searchQuery, products: searchQuery.data?.pages.flat() ?? [] };
};
