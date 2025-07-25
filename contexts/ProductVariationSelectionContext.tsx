import { OptionState, useProductVariations } from '@/hooks/useProductVariations';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import { ProductVariation } from '@/models/ProductVariation';
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
    product: Product;
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
    } = useProductVariations(product, productVariations, initialProductVariation);

    useEffect(() => {

        console.log(selectedVariation?.name);

        setProductVariation(selectedVariation);
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
