import type { ProductCategory } from '@/types';
import { ItemCache } from '@/utils/itemCache';
import PaginatorResource from '@/utils/paginatorResource';
import React, { createContext } from 'react';
import { fetchProductCategoryData } from './ProductCategoryApi';

interface ProductCategoryState {
    items: ProductCategory[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

interface ProductCategoryContextType {
    getState: (productCategoryId: number) => ProductCategoryState;
    loadMore: (productCategoryId: number) => void;
    refresh: (productCategoryId: number) => void;
    getProductCategoryById: (id: number) => Promise<ProductCategory | null>;
    hydrateCache: (items: ProductCategory[]) => void;
}

export const ProductCategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        getState,
        loadMore,
        refresh,
    } = PaginatorResource<ProductCategory>(fetchProductCategoryData);

    const { getItem: getProductCategoryById, hydrateCache } = ItemCache<ProductCategory>(async (id: number) => {
        // This could be implemented to fetch a single category from the API if needed
        return Promise.reject('Single category fetch not implemented');
    });

    return (
        <ProductCategoryContext.Provider value={{ getState, loadMore, refresh, getProductCategoryById, hydrateCache }}>
            {children}
        </ProductCategoryContext.Provider>
    );
};

export const ProductCategoryContext = createContext<ProductCategoryContextType | undefined>(undefined);

export default ProductCategoryContext;