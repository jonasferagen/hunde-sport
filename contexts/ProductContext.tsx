import { useProductVariations as useProductVariationsData } from '@/hooks/data/Product';
import { Product, ProductVariation } from '@/models/Product';
import React, { createContext, useContext, useState } from 'react';


export interface ProductContextType {
    product: Product;
    productVariation?: ProductVariation | undefined;
    setProductVariation: (variation?: ProductVariation) => void;
    productVariations: ProductVariation[];
    isLoading: boolean;
    isProductVariationsLoading: boolean;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider: React.FC<{ product: Product; productVariation?: ProductVariation; children: React.ReactNode }> = ({
    product,
    productVariation: initialProductVariation,
    children,
}) => {
    const [productVariation, setProductVariation] = useState<ProductVariation | undefined>(initialProductVariation);

    const isVariable = product.type === 'variable';

    const { data: productVariations, isLoading: isProductVariationsLoading } = useProductVariationsData(product, {
        enabled: isVariable,
    });

    const value: ProductContextType = {
        product,
        productVariation,
        setProductVariation,
        productVariations: productVariations || [],
        isLoading: false, // This can be enhanced later if needed
        isProductVariationsLoading: isVariable ? isProductVariationsLoading : false,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};