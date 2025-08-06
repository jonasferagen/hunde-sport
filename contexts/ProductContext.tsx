import { useProductVariations } from '@/hooks/data/Product';
import { PurchasableProduct } from '@/models/Product/Product';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { createValidatedPurchasable, ValidatedPurchasable } from '@/utils/purchasableUtils';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Interface for the ProductContext
 */
export interface ProductContextType {
    product: PurchasableProduct;
    validatedPurchasable: ValidatedPurchasable;
    isLoading: boolean;
    selectedProductVariation: ProductVariation | undefined;
    setSelectedProductVariation: (variation: ProductVariation | undefined) => void;
    productVariations: ProductVariation[] | undefined;

}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProductContext = () => {
    const context = useContext(ProductContext);
    if (!context) {
        throw new Error('useProductContext must be used within a ProductProvider');
    }
    return context;
};



export const ProductProvider: React.FC<{ product: PurchasableProduct; children: React.ReactNode }> = ({
    product,
    children,
}) => {

    const { isLoading, items: variations } = useProductVariations(product);
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [selectedProductVariation, setSelectedProductVariation] = useState<ProductVariation | undefined>(undefined);

    useEffect(() => {
        if (!isLoading && variations.length) {
            console.log("Setting product variations", variations.length);

            setProductVariations(variations);
            setSelectedProductVariation(undefined);
        }
    }, [product, isLoading, variations]);

    const value = useMemo(() => {
        const validatedPurchasable = createValidatedPurchasable({ product, productVariation: selectedProductVariation });

        return {
            product,
            validatedPurchasable,
            isLoading,
            selectedProductVariation,
            setSelectedProductVariation,
            productVariations,
        };
    }, [product, selectedProductVariation, isLoading, productVariations]);

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
