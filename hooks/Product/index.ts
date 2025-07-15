import { Product } from '@/types';
import { useQueries, useQuery } from '@tanstack/react-query';
import { useInfiniteListQuery } from '../useInfiniteListQuery';
import { fetchFeaturedProducts, fetchProduct, fetchProductByCategory, searchProducts } from './api';

export const useProduct = (productId: number) => {
    return useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: () => fetchProduct(productId)
    });
};

export const useProductVariations = (productIds: number[]) => {
    const queries = useQueries({
        queries: productIds.map(id => {
            return {
                queryKey: ['product', id],
                queryFn: () => fetchProduct(id),
                enabled: !!id,
            }
        })
    });

    return queries;
};

export const useRelatedProducts = (productIds: number[]) => {
    const queries = useQueries({
        queries: (productIds || []).map(id => {
            return {
                queryKey: ['product', id],
                queryFn: () => fetchProduct(id),
                enabled: !!id,
            }
        })
    });

    return queries;
};

export const useProductsByCategory = (categoryId: number) => {
    const { items: products, ...rest } = useInfiniteListQuery<Product>(
        'product',
        ['productsByCategory', categoryId],
        (pageParam) => fetchProductByCategory(pageParam, categoryId)
    );
    return { ...rest, products };
};

export const useFeaturedProducts = () => {
    const { items: products, ...rest } = useInfiniteListQuery<Product>(
        'product',
        ['featuredProducts'],
        (pageParam) => fetchFeaturedProducts(pageParam)
    );
    return { ...rest, products };
};

export const useSearchProducts = (query: string) => {
    const { items: products, ...rest } = useInfiniteListQuery<Product>(
        'product',
        ['searchProducts', query],
        (pageParam) => searchProducts(pageParam, query),
        { enabled: !!query } // Only run the query if there is a query string
    );
    return { ...rest, products };
}
