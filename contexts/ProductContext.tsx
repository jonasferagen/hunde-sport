import { useProductVariations } from '@/hooks/useProductVariations';
import { Product } from '@/models/Product';
import { ProductAttribute } from '@/models/ProductAttribute';
import React, { createContext, useContext, useMemo } from 'react';

interface ProductContextType {
    product: Product;
    displayProduct: Product | null;
    productVariations: Product[];
    priceRange: { min: number; max: number } | null;
    handleOptionSelect: (attributeId: number, option: string) => void;
    availableOptions: Map<number, Map<string, Product>>;
    selectedOptions: Record<number, string>;
    variationAttributes: ProductAttribute[];
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ product: Product; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const {
        productVariant,
        productVariations,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
    } = useProductVariations(product);

    const priceRange = useMemo(() => {
        if (!productVariations || productVariations.length === 0) {
            return null;
        }

        const prices = productVariations.map((v) => parseFloat(v.price));
        const min = Math.min(...prices);
        const max = Math.max(...prices);

        if (min === max) {
            return null;
        }

        return { min, max };
    }, [productVariations]);

    const displayProduct = productVariant || product;

    const value = {
        product,
        displayProduct,
        productVariations,
        priceRange,
        handleOptionSelect,
        availableOptions,
        selectedOptions,
        variationAttributes,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (context === undefined) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};