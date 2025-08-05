import { VariableProduct } from '@/models/Product/VariableProduct';
import { ProductCategory } from '@/types';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { handleQueryResult, queryOptions } from '../util';
import {
    fetchDiscountedProducts,
    fetchFeaturedProducts,
    fetchProduct,
    fetchProductsByIds,
    fetchProductsByProductCategory,
    fetchProductsBySearch,
    fetchProductVariations,
    fetchRecentProducts
} from './api';

export const useProduct = (id: number) => {
    return useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
    });
};

export const useProductVariations = (variableProduct: VariableProduct) => {
    const result = useInfiniteQuery({
        queryKey: ['product-variations', variableProduct.id],
        queryFn: ({ pageParam }) => fetchProductVariations(variableProduct.id, { page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
};

export const useProductsByIds = (ids: number[]) => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-ids', ids],
        queryFn: ({ pageParam }) => fetchProductsByIds(ids, { page: pageParam }),
        enabled: !!ids && ids.length > 0,
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useProductsBySearch = (query: string) => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-search', query],
        queryFn: ({ pageParam }) => fetchProductsBySearch(query, { page: pageParam }),
        enabled: !!query,
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useFeaturedProducts = () => {
    const result = useInfiniteQuery({
        queryKey: ['featured-products'],
        queryFn: ({ pageParam }) => fetchFeaturedProducts({ page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useDiscountedProducts = () => {
    const result = useInfiniteQuery({
        queryKey: ['on-sale-products'],
        queryFn: ({ pageParam }) => fetchDiscountedProducts({ page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useRecentProducts = () => {
    const result = useInfiniteQuery({
        queryKey: ['recent-products'],
        queryFn: ({ pageParam }) => fetchRecentProducts({ page: pageParam }),
        ...queryOptions,
    });
    return handleQueryResult(result);
}

export const useProductsByCategory = (productCategory: ProductCategory) => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-category', productCategory.id],
        queryFn: ({ pageParam }) => fetchProductsByProductCategory(productCategory.id, { page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
}