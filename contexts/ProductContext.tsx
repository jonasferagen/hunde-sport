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
    const isVariable = product instanceof VariableProduct;
    const { isLoading, items: variations } = useProductVariations(product);

    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [selectedProductVariation, setSelectedProductVariation] = useState<ProductVariation | undefined>(undefined);

    useEffect(() => {
        setProductVariations(variations);
        setSelectedProductVariation(undefined);
        if (isVariable && variations && variations.length > 0) {
            (product as VariableProduct).setVariationsData(variations);
        }

    }, [product, variations]);

    const value = useMemo(() => {
        const displayProduct = selectedProductVariation || product;

        let purchasable: Purchasable;
        if (product instanceof VariableProduct && selectedProductVariation) {
            purchasable = { product, productVariation: selectedProductVariation };
        } else {
            purchasable = { product };
        }

        return {
            product,
            displayProduct,
            purchasable,
            isLoading,
            selectedProductVariation,
            setSelectedProductVariation,
            productVariations,
        };
    }, [product, selectedProductVariation, isLoading, productVariations]);

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};