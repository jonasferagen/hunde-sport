import React, { createContext, useEffect, useState } from 'react';
import type { ProductCategory } from '../../../types';
import { usePaginatedResource } from '../usePaginatedResource';
import { fetchProductCategoryData } from './productCategoryApi';

interface ProductCategoryState {
    items: ProductCategory[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

interface ProductCategoryContextType {
    getCategoryState: (CategoryId: number) => ProductCategoryState;
    loadMore: (CategoryId: number) => void;
    refresh: (CategoryId: number) => void;
    setCategoryId: (id: number) => void;
}

export const ProductCategoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [categoryId, setCategoryId] = useState<number>(0);

    const {
        getState: getCategoryState,
        loadMore,
        refresh,
    } = usePaginatedResource<ProductCategory>(fetchProductCategoryData, String(categoryId));

    useEffect(() => {
        refresh(categoryId);
    }, [categoryId]);

    return (
        <ProductCategoryContext.Provider value={{ getCategoryState, loadMore, refresh, setCategoryId }}>
            {children}
        </ProductCategoryContext.Provider>
    );
};

const ProductCategoryContext = createContext<ProductCategoryContextType | undefined>(undefined);
export default ProductCategoryContext;