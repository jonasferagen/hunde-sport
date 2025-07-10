import type { Product } from '@/types';
import { ItemCache } from '@/utils/itemCache';
import { PaginatorResource } from '@/utils/paginatorResource';
import React, { createContext } from 'react';
import { fetchProductList } from './ProductApi';

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
    getProductById: (id: number) => Promise<Product | null>;
    hydrateCache: (items: Product[]) => void;
}

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        getState,
        loadMore,
        refresh,
    } = PaginatorResource<Product>(fetchProductList);

    const { getItem: getProductById, hydrateCache } = ItemCache<Product>(async (id: number) => {
        // This could be implemented to fetch a single category from the API if needed
        return Promise.reject('Single category fetch not implemented');
    });



    return (
        <ProductContext.Provider value={{ getState, loadMore, refresh, getProductById, hydrateCache }}>
            {children}
        </ProductContext.Provider>
    );
};

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

export default ProductContext;