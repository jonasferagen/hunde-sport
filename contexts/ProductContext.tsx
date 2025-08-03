import { useProductVariations as useProductVariationsData } from '@/hooks/data/Product';
import { Product } from '@/models/Product/Product';
import { ProductVariation } from '@/models/Product/ProductVariation';
import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Generates a display name for a product, including its variation attributes.
 * @param product The base product.
 * @param productVariation The selected product variation.
 * @returns The generated display name as a string.
 */
const getDisplayName = (product: Product, productVariation?: ProductVariation): string => {
    if (!productVariation) {
        return product.name;
    }
    const variationName = productVariation.getVariationName(product);
    return variationName ? `${product.name}, ${variationName}` : product.name;
};

/**
 * Interface for the ProductContext
 */
export interface ProductContextType {
    product: Product;
    displayName: string;
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

    const displayName = useMemo(() => getDisplayName(product, productVariation), [product, productVariation]);

    const value: ProductContextType = {
        product,
        displayName,
        productVariation,
        setProductVariation,
        productVariations: productVariations || [],
        isLoading: false, // This can be enhanced later if needed
        isProductVariationsLoading: isVariable ? isProductVariationsLoading : false,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};