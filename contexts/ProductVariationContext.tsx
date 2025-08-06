import { useProductVariations } from '@/hooks/data/Product';
import { VariableProduct } from '@/models/Product/VariableProduct';
import React, { createContext, JSX, useContext, useEffect } from 'react';

export interface ProductVariationContextType {

    isLoading: boolean;
}

const ProductVariationContext = createContext<ProductVariationContextType | undefined>(undefined);

export const useProductVariationContext = () => {
    const context = useContext(ProductVariationContext);
    if (!context) {
        throw new Error('useProductVariationContext must be used within a ProductVariationProvider');
    }
    return context;
};

interface ProductVariationProviderProps {
    product: VariableProduct;
    children: React.ReactNode;
}

export const ProductVariationProvider = ({ product, children }: ProductVariationProviderProps): JSX.Element => {
    const { isLoading, items: productVariations } = useProductVariations(product);

    useEffect(() => {
        if (!isLoading) {
            product.setVariationsData(productVariations);
        }
    }, [product, isLoading, productVariations]);


    const value: ProductVariationContextType = {

        isLoading,
    };

    return <ProductVariationContext.Provider value={value}>{children}</ProductVariationContext.Provider>;
};
