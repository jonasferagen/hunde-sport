import React, { createContext, useContext, useEffect } from 'react';
import type { Product } from '../../../types';
import { useItemCache } from '../useItemCache';
import { usePaginatedResource } from '../usePaginatedResource';
import { fetchProductDetail, fetchProductList } from './productApi';
import type { ProductContextType } from './productTypes';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const {
        getState: getProductState,
        loadMore,
        refresh,
    } = usePaginatedResource<Product>(fetchProductList, (categoryId) => categoryId.toString());

    const {
        getItem: getProductById,
    } = useItemCache<Product>(fetchProductDetail);

    return (
        <ProductContext.Provider
            value={{
                getProductState,
                getProductById,
                loadMore,
                refresh,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};

export const useProducts = (categoryId: number) => {
    const context = useContext(ProductContext);
    if (!context) throw new Error('useProducts must be used within a ProductProvider');

    const state = context.getProductState(categoryId);

    useEffect(() => {
        if (categoryId) {
            context.refresh(categoryId);
        }
    }, [categoryId]);

    return {
        ...state,
        products: state.items,
        loadMore: () => context.loadMore(categoryId),
        refresh: () => context.refresh(categoryId),
        getProductById: context.getProductById,
    };
};
