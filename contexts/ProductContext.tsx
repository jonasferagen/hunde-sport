import { Product } from '@/models/Product';
import React, { createContext, useContext, useState } from 'react';

interface ProductContextType {
    displayProduct: Product | null;
    setDisplayProduct: (product: Product | null) => void;
}


const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [displayProduct, setDisplayProduct] = useState<Product | null>(null);

    return (
        <ProductContext.Provider value={{ displayProduct, setDisplayProduct }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProductContext = (): ProductContextType => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};
