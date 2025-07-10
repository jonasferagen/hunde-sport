import type { Product } from '@/types';
import { ItemCache } from '@/utils/itemCache';
import React, { createContext } from 'react';
import { fetchProduct } from './ProductApi';

interface ProductContextType {
    hydrateCache: (items: Product[]) => void;
    getItem: (id: number) => Promise<Product | null>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { getItem, hydrateCache } = ItemCache<Product>(fetchProduct);

    const value = {
        getItem,
        hydrateCache,
    };

    return (
        <ProductContext.Provider value={value}>
            {children}
        </ProductContext.Provider>
    );
};

export default ProductContext;