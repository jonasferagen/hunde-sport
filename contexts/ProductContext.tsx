import { Product } from '@/types';
import React, { createContext, useContext, useState } from 'react';

interface ProductContextType {
    currentImageIndex: number;
    setImageIndex: (index: number) => void;
    isImageViewerVisible: boolean;
    setImageViewerVisible: (visible: boolean) => void;
    displayProduct: Product | null;
    setDisplayProduct: (product: Product | null) => void;
}


const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [currentImageIndex, setImageIndex] = useState(0);
    const [isImageViewerVisible, setImageViewerVisible] = useState(false);
    const [displayProduct, setDisplayProduct] = useState<Product | null>(null);



    return (
        <ProductContext.Provider value={{ currentImageIndex, setImageIndex, isImageViewerVisible, setImageViewerVisible, displayProduct, setDisplayProduct }}>
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
