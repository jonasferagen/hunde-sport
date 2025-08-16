import { Product, PurchasableProduct } from '@/domain/Product/Product';
import { ProductCategory, ProductVariation } from '@/types';
import { useInfiniteQuery, useQuery, UseQueryResult } from '@tanstack/react-query';
import { handleQueryResult, queryOptions, QueryResult } from '../util';
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





export const useProduct = (id: number): UseQueryResult<Product> => {
    const result = useQuery({
        queryKey: ['product', id],
        queryFn: () => fetchProduct(id),
    });
    return result;
};

export const useProductVariations = (product: Product): QueryResult<ProductVariation> => {
    const result = useInfiniteQuery({
        queryKey: ['product-variations', product.id],
        queryFn: ({ pageParam }) => fetchProductVariations(product.id, { page: pageParam, per_page: 100 }),
        ...queryOptions
    });
    return handleQueryResult<ProductVariation>(result);
};

export const useProductsByIds = (ids: number[]): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-ids', ids],
        queryFn: ({ pageParam }) => fetchProductsByIds(ids, { page: pageParam }),
        enabled: !!ids && ids.length > 0,
        ...queryOptions
    });
    return handleQueryResult<PurchasableProduct>(result);
}

export const useProductsBySearch = (query: string): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-search', query],
        queryFn: ({ pageParam }) => fetchProductsBySearch(query, { page: pageParam }),
        enabled: !!query,
        ...queryOptions
    });
    return handleQueryResult<PurchasableProduct>(result);
}

export const useFeaturedProducts = (): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['featured-products'],
        queryFn: ({ pageParam }) => fetchFeaturedProducts({ page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult<PurchasableProduct>(result);
}

export const useDiscountedProducts = (): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['on-sale-products'],
        queryFn: ({ pageParam }) => fetchDiscountedProducts({ page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult<PurchasableProduct>(result);
}

export const useRecentProducts = (): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['recent-products'],
        queryFn: ({ pageParam }) => fetchRecentProducts({ page: pageParam }),
        ...queryOptions,
    });
    return handleQueryResult<PurchasableProduct>(result);
}

export const useProductsByCategory = (productCategory: ProductCategory): QueryResult<PurchasableProduct> => {
    const result = useInfiniteQuery({
        queryKey: ['products-by-category', productCategory.id],
        queryFn: ({ pageParam }) => fetchProductsByProductCategory(productCategory.id, { page: pageParam }),
        ...queryOptions
    });
    return handleQueryResult<PurchasableProduct>(result);
}