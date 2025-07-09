import React, { createContext, useEffect, useState } from 'react';
import type { Product } from '../../../types';
import { ItemCache } from '../ItemCache';
import { PaginatedResource } from '../PaginatedResource';
import { fetchProductDetail, fetchProductList } from './ProductApi';

export interface ProductState {
    items: Product[];
    loading: boolean;
    loadingMore: boolean;
    error: string | null;
    page: number;
    hasMore: boolean;
}

export interface ProductContextType {
    getProductState: (productId: number) => ProductState;
    getProductById: (productId: number) => Promise<Product | null>;
    loadMore: (productId: number) => void;
    refresh: (productId: number) => void;
    // setActiveProductId: (id: number) => void;
}



export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [productCategoryId] = useState<number>(0);
    const {
        getState: getProductState,
        loadMore,
        refresh,
    } = PaginatedResource<Product>(fetchProductList, String(productCategoryId));

    const {
        getItem: getProductById,
    } = ItemCache<Product>(fetchProductDetail);

    useEffect(() => {
        refresh(productCategoryId);
    }, [productCategoryId]);


    useEffect(() => {
        const state = getProductState(productCategoryId);
        // console.log(state.items);
    }, [getProductState, productCategoryId]);


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


const ProductContext = createContext<ProductContextType | undefined>(undefined);
export default ProductContext;

