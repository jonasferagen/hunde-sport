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
    defaultVariation: ProductVariation | null;
    availableOptions: Map<number, Map<string, ProductVariation[]>>;
}

const ProductVariationSelectionContext = createContext<ProductVariationContextType | undefined>(undefined);

export const ProductVariationSelectionProvider: React.FC<{
    product: VariableProduct;
    productVariations: ProductVariation[];
    initialProductVariation?: ProductVariation | null;
    setProductVariation: (variation: ProductVariation | null) => void;
    children: React.ReactNode;
}> = ({ product, productVariations, initialProductVariation, setProductVariation, children }) => {
    const {
        selectOption,
        getOptionState,
        selectedOptions,
        productVariationAttributes,
        selectedVariation,
        defaultVariation,
        availableOptions,
    } = useProductVariations(product, productVariations, initialProductVariation);

    useEffect(() => {
        setProductVariation(selectedVariation || defaultVariation);
    }, [selectedVariation, setProductVariation, defaultVariation]);

    const value = {
        selectOption,
        getOptionState,
        selectedOptions,
        productVariationAttributes,
        selectedVariation,
        defaultVariation,
        availableOptions,
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
