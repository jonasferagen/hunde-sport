import { Product, PurchasableProduct } from '@/domain/Product/Product';
import { ProductCategory, ProductVariation } from '@/types';
import { useInfiniteQuery, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useQueryResult, makeQueryOptions, QueryResult } from '../util';
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


const queryOptions = makeQueryOptions<PurchasableProduct>();


export const useProduct = (id: number, options = { enabled: true }): UseQueryResult<Product> => {
    const result = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
        ...options,
    });
    return result;
};

export const useProductVariations = (product: Product): QueryResult<ProductVariation> => {
    const result = useInfiniteQuery({
        queryKey: ['product-variations', product.id],
        queryFn: ({ pageParam }) => fetchProductVariations(product.id, { page: pageParam, per_page: 100 }),
        ...queryOptions
    });
    return useQueryResult<ProductVariation>(result);
};

export const useProductsByIds = (ids: number[]): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-ids', ids],
        queryFn: ({ pageParam }) => fetchProductsByIds(ids, { page: pageParam }),
        enabled: !!ids && ids.length > 0,
        ...queryOptions
    });
    return useQueryResult<PurchasableProduct>(result);
}

export const useProductsBySearch = (query: string, options = { enabled: !!query }): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-search', query],
        queryFn: ({ pageParam }) => fetchProductsBySearch(query, { page: pageParam }),
        ...options,
        ...queryOptions,
        placeholderData: undefined, // empty list

    });
    return useQueryResult<PurchasableProduct>(result);
}

export const useFeaturedProducts = (options = { enabled: true, perPage: 3 }): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['featured-products'],
        queryFn: ({ pageParam }) => fetchFeaturedProducts({ page: pageParam, per_page: options.perPage }),
        ...queryOptions
    });
    return useQueryResult<PurchasableProduct>(result);
}

export const useDiscountedProducts = (options = { enabled: true, perPage: 3 }): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['on-sale-products'],
        queryFn: ({ pageParam }) => fetchDiscountedProducts({ page: pageParam, per_page: options.perPage }),
        ...queryOptions
    });
    return useQueryResult<PurchasableProduct>(result);
}

export const useRecentProducts = (options = { enabled: true, perPage: 3 }): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['recent-products'],
        queryFn: ({ pageParam }) => fetchRecentProducts({ page: pageParam, per_page: options.perPage }),
        ...queryOptions,
    });
    return useQueryResult<PurchasableProduct>(result);
}

export const useProductsByCategory = (productCategory: ProductCategory): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-category', productCategory.id],
        queryFn: ({ pageParam }) => fetchProductsByProductCategory(productCategory.id, { page: pageParam }),
        ...queryOptions,
    });
    return useQueryResult<PurchasableProduct>(result);
} 