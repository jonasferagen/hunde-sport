import { useProductVariations } from '@/hooks/data/Product';
import { ProductVariation, PurchasableProduct } from '@/models/Product/Product';
import { createPurchasable, Purchasable } from '@/models/Product/Purchasable';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';

/**
 * Interface for the ProductContext
 */
export interface ProductContextType {
    product: PurchasableProduct;
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

    const { isLoading, items: variations } = useProductVariations(product);
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [selectedProductVariation, setSelectedProductVariation] = useState<ProductVariation | undefined>(undefined);

    useEffect(() => {
        if (!isLoading && variations.length) {
            setProductVariations(variations);
            setSelectedProductVariation(undefined);
        }
    }, [product, isLoading, variations]);

    const value = useMemo(() => {
        const purchasable = createPurchasable({ product, productVariation: selectedProductVariation });

        return {
            product,
            purchasable,
            isLoading,
            selectedProductVariation,
            setSelectedProductVariation,
            productVariations,
        };
    }, [product, selectedProductVariation, isLoading, productVariations]);

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};
