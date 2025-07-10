import type { Product } from '@/types';
import { ItemCache } from '@/utils/itemCache';
import { PaginatorResource } from '@/utils/paginatorResource';
import React, { createContext } from 'react';
import { fetchProductByCategory } from './ProductApi';

interface ProductState {
    items: Product[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

interface ProductContextType {
    getState: (productCategoryId: number) => ProductState;
    loadMore: (productCategoryId: number) => void;
    refresh: (productCategoryId: number) => void;
    hydrateCache: (items: Product[]) => void;
    getItem: (id: number) => Promise<Product | null>;
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        getState,
        loadMore,
        refresh,
    } = PaginatorResource<Product>(fetchProductByCategory);

    const { getItem, hydrateCache } = ItemCache<Product>(async (id: number) => {
        return Promise.reject('Single product fetch not implemented');
    });

    return (
        <ProductContext.Provider value={{ getState, loadMore, refresh, getItem, hydrateCache }}>
            {children}
        </ProductContext.Provider>
    );
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export default ProductContext;