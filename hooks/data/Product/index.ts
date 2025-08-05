import { VariableProduct } from '@/models/Product/VariableProduct';
import { useQuery } from '@tanstack/react-query';
import {
    fetchDiscountedProducts,
    fetchFeaturedProducts,
    fetchProduct,
    fetchProductsByCategory,
    fetchProductsByIds,
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
    return useQuery({
        queryKey: ['product-variations', variableProduct.id],
        queryFn: () => fetchProductVariations(variableProduct.id),
    });
};

export const useRecentProducts = () => {

    return useQuery({
        queryKey: ['recent-products'],
        queryFn: () => fetchRecentProducts(),
    });

}

export const useProductsByIds = (ids: number[]) => {
    return useQuery({
        queryKey: ['products-by-ids', ids],
        queryFn: () => fetchProductsByIds(ids),
        enabled: !!ids && ids.length > 0,
    });
}

export const useProductsBySearch = (query: string) => {
    return useQuery({
        queryKey: ['products-by-search', query],
        queryFn: () => fetchProductsBySearch(query),
        enabled: !!query,
    });
}

export const useFeaturedProducts = () => {
    return useQuery({
        queryKey: ['featured-products'],
        queryFn: () => fetchFeaturedProducts(),
    });
}

export const useDiscountedProducts = () => {
    return useQuery({
        queryKey: ['on-sale-products'],
        queryFn: () => fetchDiscountedProducts(),
    });
}

export const useProductsByCategory = (id: number) => {
    return useQuery({
        queryKey: ['products-by-category', id],
        queryFn: () => fetchProductsByCategory(id),
        enabled: !!id,
    });
}
