import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { Purchasable } from '@/types';
import React, { createContext, useContext, useMemo, useState } from 'react';

/**
 * Generates a display name for a product, including its variation attributes.
 * @param product The base product.
 * @param productVariation The selected product variation.
 * @returns The generated display name as a string.
 */
const getDisplayName = (product: SimpleProduct | VariableProduct, productVariation?: ProductVariation): string => {
    if (!productVariation || !(product instanceof VariableProduct)) {
        return product.name;
    }
    const variationName = productVariation.getVariationName(product.attributes);
    return variationName ? `${product.name}, ${variationName}` : product.name;
};

/**
 * Interface for the ProductContext
 */
export interface ProductContextType {
    product: SimpleProduct | VariableProduct;
    displayProduct: SimpleProduct | VariableProduct | ProductVariation;
    purchasableProduct: Purchasable | undefined;
    displayName: string;
    productVariation: ProductVariation | undefined;
    setProductVariation: (variation?: ProductVariation) => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};

export const ProductProvider: React.FC<{ product: SimpleProduct | VariableProduct; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const [productVariation, setProductVariation] = useState<ProductVariation | undefined>(undefined);

    const displayName = useMemo(() => getDisplayName(product, productVariation), [product, productVariation]);

    const displayProduct = productVariation || product;

    const purchasableProduct: Purchasable | undefined =
        product instanceof VariableProduct
            ? { product, productVariation }
            : { product: product as SimpleProduct };

    const value: ProductContextType = {
        product,
        displayProduct,
        purchasableProduct,
        displayName,
        productVariation,
        setProductVariation,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};