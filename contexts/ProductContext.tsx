import { useProductVariations as useProductVariationsData } from '@/hooks/data/Product';
import { Product } from '@/models/Product/Product';
import { ProductVariation } from '@/models/Product/ProductVariation';
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
    displayProduct: Product | ProductVariation;
    purchasableProduct: Purchasable;
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

export const ProductProvider: React.FC<{ product: Product; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const [productVariation, setProductVariation] = useState<ProductVariation | undefined>(undefined);

    const isVariable = product.type === 'variable';

    const { data: productVariations, isLoading: isProductVariationsLoading } = useProductVariationsData(product, {
        enabled: isVariable,
    });

    useEffect(() => {
        if (isVariable && productVariations && productVariations.length > 0 && !productVariation) {
            const defaultAttributes: { [key: string]: string } = {};

            if (!product.attributes) {
                console.error("No attributes found for product");
                return;
            }

            product.attributes.forEach((attribute) => {
                if (attribute.variation) {
                    const defaultTerm = attribute.terms.find((term) => term.default);
                    if (defaultTerm) {
                        defaultAttributes[attribute.name] = defaultTerm.slug;
                    }
                }
            });

            if (Object.keys(defaultAttributes).length > 0) {
                const defaultVariation = productVariations.find((variation) =>
                    variation.matchesAttributes(defaultAttributes)
                );

                if (defaultVariation) {
                    console.log('Default variation found and set:', defaultVariation.id);
                    setProductVariation(defaultVariation);
                }
            }
        }
    }, [isVariable, productVariations, productVariation, product.attributes]);

    const displayName = useMemo(() => getDisplayName(product, productVariation), [product, productVariation]);

    const displayProduct = productVariation || product;
    const purchasableProduct: Purchasable = { product, productVariation };

    const value: ProductContextType = {
        product,
        displayProduct,
        purchasableProduct,
        displayName,
        productVariation,
        setProductVariation,
        productVariations: productVariations || [],
        isLoading: false, // This can be enhanced later if needed
        isProductVariationsLoading: isVariable ? isProductVariationsLoading : false,
    };

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};