import { useProductVariations } from '@/hooks/data/Product';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { VariationSelection } from '@/models/Product/VariationSelection';
import { ProductVariation } from '@/types';
import React, { createContext, JSX, useContext, useEffect, useState } from 'react';



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
    setVariation: (variation: ProductVariation | undefined) => void;
}
export interface ProductVariationContextType {
    isLoading: boolean;
    selectionManager: VariationSelection | null;
    setSelectionManager: (selectionManager: VariationSelection | null) => void;
    setSelectedVariation: (variation: ProductVariation | undefined) => void;
}
export const ProductVariationProvider = ({ product, children, setVariation }: ProductVariationProviderProps): JSX.Element => {


    const { isLoading, items: productVariations } = useProductVariations(product);
    const [selectionManager, setSelectionManager] = useState<VariationSelection | null>(null);

    const setSelectedVariation = (variation: ProductVariation | undefined) => {
        console.log("ProductVariationProvider", variation?.id);
        //product.setSelectedVariation(variation);
        setVariation(variation);
    };

    useEffect(() => {
        if (!isLoading) {
            product.setVariationsData(productVariations);
            setSelectionManager(product.createSelectionManager());
        }
    }, [product, isLoading, productVariations]);


    const value: ProductVariationContextType = {
        isLoading,
        selectionManager,
        setSelectionManager,
        setSelectedVariation,
    };

    return <ProductVariationContext.Provider value={value}>{children}</ProductVariationContext.Provider>;
};
