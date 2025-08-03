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
    if (!productVariation?.variation_attributes || productVariation.variation_attributes.length === 0) {
        return product.name;
    }

    const attributeNames = productVariation.variation_attributes
        .map((variationAttr) => {
            const parentAttribute = product.attributes.find((attr) => attr.name === variationAttr.name);
            return parentAttribute?.terms.find((t) => t.slug === variationAttr.value)?.name;
        })
        .filter((name): name is string => Boolean(name));

    return attributeNames.length > 0 ? `${product.name}, ${attributeNames.join(' ')}` : product.name;
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