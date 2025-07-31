import { OptionState, useProductVariations } from '@/hooks/useProductVariations';
import { ProductVariation, VariableProduct } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { createContext, useContext, useEffect } from 'react';

interface ProductVariationContextType {
    selectOption: (attributeId: number, option: string) => void;
    getOptionState: (attributeId: number, optionName: string) => OptionState;
    selectedOptions: Record<number, string>;
    productVariationAttributes: ProductAttribute[];
    selectedVariation: ProductVariation | null;
}

const ProductVariationSelectionContext = createContext<ProductVariationContextType | undefined>(undefined);

export const ProductVariationSelectionProvider: React.FC<{
    product: VariableProduct;
    productVariations: ProductVariation[];
    initialProductVariation?: ProductVariation | undefined;
    setProductVariation: (variation: ProductVariation | undefined) => void;
    children: React.ReactNode;
}> = ({ product, productVariations, initialProductVariation, setProductVariation, children }) => {
    const {
        selectOption,
        getOptionState,
        selectedOptions,
        productVariationAttributes,
        selectedVariation,
    } = useProductVariations(product, productVariations, initialProductVariation);

    useEffect(() => {
        setProductVariation(selectedVariation || undefined);
    }, [selectedVariation, setProductVariation]);

    const value = {
        selectOption,
        getOptionState,
        selectedOptions,
        productVariationAttributes,
        selectedVariation,
    };

    return <ProductVariationSelectionContext.Provider value={value}>{children}</ProductVariationSelectionContext.Provider>;
};

export const useProductVariationSelectionContext = () => {
    const context = useContext(ProductVariationSelectionContext);
    if (context === undefined) {
        throw new Error('useProductVariationSelectionContext must be used within a ProductVariationSelectionProvider');
    }
    return context;
};
