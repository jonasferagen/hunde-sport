import { ItemCache } from '@/context/ItemCache';
import { PaginatedResource } from '@/context/PaginatedResource';
import type { ProductCategory } from '@/types';
import React, { createContext, useEffect, useState } from 'react';
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
    getCategoryState: (productCategoryId: number) => ProductCategoryState;
    loadMore: (productCategoryId: number) => void;
    refresh: (productCategoryId: number) => void;
    setProductCategoryId: (id: number) => void;
    getProductCategoryById: (id: number) => Promise<ProductCategory | null>;
}

export const ProductCategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [productCategoryId, setProductCategoryId] = useState<number>(0);

    const {
        getState: getCategoryState,
        loadMore,
        refresh,
    } = PaginatedResource<ProductCategory>(fetchProductCategoryData, String(productCategoryId));

    const { getItem: getProductCategoryById, hydrateCache } = ItemCache<ProductCategory>(async (id: number) => {
        return Promise.reject('Not implemented');
    });

    useEffect(() => {
        refresh(productCategoryId);
    }, [productCategoryId]);

    useEffect(() => {
        const state = getCategoryState(productCategoryId);
        hydrateCache(state.items);
    }, [getCategoryState, productCategoryId, hydrateCache]);


    return (
        <ProductCategoryContext.Provider value={{ getCategoryState, loadMore, refresh, setProductCategoryId, getProductCategoryById }}>
            {children}
        </ProductCategoryContext.Provider>
    );
};

export const ProductCategoryContext = createContext<ProductCategoryContextType | undefined>(undefined);

export default ProductCategoryContext;