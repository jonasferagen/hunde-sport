import { DebugTrigger } from '@/components/debug/DebugTrigger';
import { DEBUG_PRODUCTS } from '@/config/app';
import { useProductVariations } from '@/hooks/data/Product';
import { ProductVariation, PurchasableProduct } from '@/models/Product/Product';
import { createPurchasable, Purchasable } from '@/models/Product/Purchasable';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { View } from 'react-native';

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


    const showDebug = DEBUG_PRODUCTS;
    const { isLoading, items: variations } = useProductVariations(product);
    const [productVariations, setProductVariations] = useState<ProductVariation[]>([]);
    const [selectedProductVariation, setSelectedProductVariation] = useState<ProductVariation | undefined>(undefined);

    // Reset variation state if the product itself changes
    useEffect(() => {
        setProductVariations([]);
        setSelectedProductVariation(undefined);
    }, [product]);

    // Update variations when they are loaded for the current product
    useEffect(() => {
        if (!isLoading && variations) {
            // Integrity Check: Ensure all incoming variations belong to the parent product
            if (variations.some((v) => v.parent !== product.id)) {
                throw new Error(`State integrity error: Attempted to load variations that do not belong to product #${product.id}.`);
            }
            setProductVariations(variations);
        }
    }, [isLoading, variations, product.id]);

    // Create a guarded setter for the selected product variation
    const handleSetSelectedProductVariation = (variation: ProductVariation | undefined) => {
        // Integrity Check: Ensure the variation is valid before setting it
        if (variation && !productVariations?.find((v) => v.id === variation.id)) {
            throw new Error(`State integrity error: Selected variation #${variation.id} is not part of the available variations.`);
        }
        setSelectedProductVariation(variation);
    };

    const value = useMemo(() => {
        const purchasable = createPurchasable({ product, productVariation: selectedProductVariation });

        return {
            product,
            purchasable,
            isLoading,
            selectedProductVariation,
            setSelectedProductVariation: handleSetSelectedProductVariation,
            productVariations,
        };
    }, [product, selectedProductVariation, isLoading, productVariations]);

    return (
        <ProductContext.Provider value={value}>
            <View style={{ flex: 1 }}>
                {children}
                {showDebug && <DebugTrigger product={product} />}
            </View>
        </ProductContext.Provider>
    );
};
