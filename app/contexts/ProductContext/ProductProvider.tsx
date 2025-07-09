import React, { createContext, useContext, useEffect, useState } from 'react';
import type { Product } from '../../../types';
import { ItemCache } from '../ItemCache';
import { PaginatedResource } from '../PaginatedResource';
import { fetchProductDetail, fetchProductList } from './productApi';
import type { ProductContextType } from './productTypes';

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [categoryId] = useState<number>(0);
    const {
        getState: getProductState,
        loadMore,
        refresh,
    } = PaginatedResource<Product>(fetchProductList, String(categoryId));

    const {
        getItem: getProductById,
    } = ItemCache<Product>(fetchProductDetail);

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
