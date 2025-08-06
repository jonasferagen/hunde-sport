import { useProductVariations } from '@/hooks/data/Product';
import { Purchasable, PurchasableProduct } from '@/models/Product/Product';
import { ProductVariation } from '@/models/Product/ProductVariation';
import { SimpleProduct } from '@/models/Product/SimpleProduct';
import { VariableProduct } from '@/models/Product/VariableProduct';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Interface for the ProductContext
 */
export interface ProductContextType {
    product: PurchasableProduct;
    displayProduct: SimpleProduct | VariableProduct | ProductVariation;
    purchasable: Purchasable;
    isLoading: boolean;
    setSelectedVariation: (variation: ProductVariation | undefined) => void;
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
    const isVariable = product instanceof VariableProduct;
    const { isLoading: areVariationsLoading, items: variations } = useProductVariations(product);

    const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(undefined);

    // Effect to load variation data into the product model once fetched
    useEffect(() => {
        if (isVariable && !areVariationsLoading) {
            (product as VariableProduct).setVariationsData(variations);
        }
    }, [isVariable, areVariationsLoading, product, variations]);

    // Effect to reset selection when the product changes
    useEffect(() => {
        setSelectedVariation(undefined);
    }, [product]);

    const value = useMemo(() => {
        const displayProduct = selectedVariation || product;

        let purchasable: Purchasable;
        if (product instanceof VariableProduct && selectedVariation) {
            purchasable = { product, productVariation: selectedVariation };
        } else {
            purchasable = { product };
        }

        return {
            product,
            displayProduct,
            purchasable,
            isLoading: areVariationsLoading,
            setSelectedVariation,
        };
    }, [product, selectedVariation, areVariationsLoading]);

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};