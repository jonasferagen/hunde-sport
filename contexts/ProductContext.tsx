import { useProductVariations } from '@/hooks/data/Product';
import { Product } from '@/models/Product/Product';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import { Purchasable } from '@/types';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

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
    displayProduct: Product;
    purchasableProduct: Purchasable | undefined;
    displayName: string;
    productVariation: ProductVariation | undefined;
    setProductVariation: (variation: ProductVariation) => void;
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

export const ProductProvider: React.FC<{ product: Product; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const [productVariation, setProductVariation] = useState<ProductVariation | undefined>(undefined);

    const isVariable = product instanceof VariableProduct;

    const { items: productVariations, isLoading: isProductVariationsLoading } = useProductVariations(product as VariableProduct, {
        enabled: isVariable,
        autoload: true,
    });

    useEffect(() => {
        if (product instanceof VariableProduct && productVariations) {
            product.setVariationsData(productVariations as ProductVariation[]);

            if (!productVariation) {
                const defaultVariation = product.getDefaultVariation();
                if (defaultVariation) {
                    setProductVariation(defaultVariation);
                }
            }
        }
    }, [isVariable, productVariations, productVariation, product]);

    const displayName = useMemo(() => getDisplayName(product, productVariation), [product, productVariation]);

    const displayProduct = productVariation || product;

    const purchasableProduct: Purchasable | undefined = product instanceof VariableProduct ?
        { product, productVariation } :
        { product: product as SimpleProduct };

    const value: ProductContextType = {
        product,
        displayProduct,
        purchasableProduct,
        displayName,
        productVariation,
        setProductVariation,
        isProductVariationsLoading: isVariable ? isProductVariationsLoading : false,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};