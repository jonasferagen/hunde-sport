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

const queryOptions = {
    initialPageParam: 1,
    getNextPageParam: (lastPage: any, allPages: any[]) => {
        if (!lastPage?.totalPages) return undefined;
        const nextPage = allPages.length + 1;
        return nextPage <= lastPage.totalPages ? nextPage : undefined;
    }
}

const handleQueryResult = (result: UseInfiniteQueryResult<any, any>) => {

    const { data: dataResult, ...rest } = result;

    const data = useMemo(() => {
        const page = dataResult ? dataResult.pages[dataResult.pages.length - 1] : null;
        const total = page ? page.total : 0;
        const totalPages = page?.totalPages ?? 0;
        const items = dataResult?.pages.flatMap((page: any) => page.data) ?? [];
        return { total, items, totalPages };
    }, [dataResult]);

    return {
        ...rest,
        ...data
    };
}