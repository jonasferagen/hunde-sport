import { VariableProduct } from '@/models/Product/VariableProduct';
import { ProductCategory } from '@/types';
import { useInfiniteQuery, UseInfiniteQueryResult, useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
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
        queryFn: ({ pageParam }) => fetchProductVariations({ id: variableProduct.id, pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
};

export const useProductsByIds = (ids: number[]) => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-ids', ids],
        queryFn: ({ pageParam }) => fetchProductsByIds({ ids, pageParam }),
        enabled: !!ids && ids.length > 0,
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useProductsBySearch = (query: string) => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-search', query],
        queryFn: ({ pageParam }) => fetchProductsBySearch({ query, pageParam }),
        enabled: !!query,
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useFeaturedProducts = () => {
    const result = useInfiniteQuery({
        queryKey: ['featured-products'],
        queryFn: ({ pageParam }) => fetchFeaturedProducts({ pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useDiscountedProducts = () => {
    const result = useInfiniteQuery({
        queryKey: ['on-sale-products'],
        queryFn: ({ pageParam }) => fetchDiscountedProducts({ pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
}

export const useRecentProducts = () => {
    const result = useInfiniteQuery({
        queryKey: ['recent-products'],
        queryFn: ({ pageParam }) => fetchRecentProducts({ pageParam }),
        ...queryOptions,
    });
    return handleQueryResult(result);
}

export const useProductsByCategory = (productCategory: ProductCategory) => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-category', productCategory.id],
        queryFn: ({ pageParam }) => fetchProductsByProductCategory({ product_category_id: productCategory.id, pageParam }),
        ...queryOptions
    });
    return handleQueryResult(result);
}

const queryOptions = {
    initialPageParam: 1,
    getNextPageParam: (lastPage: { totalPages: number }, allPages: any[]) => {
        return lastPage.totalPages > allPages.length ? allPages.length + 1 : undefined;
    },
}

const handleQueryResult = (result: UseInfiniteQueryResult<any, any>) => {

    const { data } = result;

    const { total, items } = useMemo(() => {
        const page = data ? data.pages[data.pages.length - 1] : null;
        const total = page ? page.total : 0;
        const items = data?.pages.flatMap((page: any) => page.data) ?? [];
        return { total, items };
    }, [data]);

    delete result.data;

    return {
        ...result,
        items,
        total
    };
}