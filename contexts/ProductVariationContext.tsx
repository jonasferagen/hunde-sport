// -----------------
// Variation context
// -----------------
import { ProductVariation, VariableProduct } from "@/domain/Product/Product";
import { useProductVariations } from '@/hooks/data/Product';

// ProductVariationProvider.tsx
import { ThemedYStack } from '@/components/ui';
import React, { createContext, useContext, useMemo } from 'react';


export interface ProductVariationContextType {
    productVariations: ProductVariation[];
    isLoading: boolean;
}

const ProductVariationContext = createContext<ProductVariationContextType | undefined>(undefined);
export const useProductVariationContext = () => {
    const ctx = useContext(ProductVariationContext);
    if (!ctx) throw new Error('useProductVariationContext must be used within a ProductVariationProvider');
    return ctx;
};

export const ProductVariationProvider: React.FC<{ product: VariableProduct; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const { isLoading, items } = useProductVariations(product);

    // stable value object
    const value = useMemo(
        () => ({ productVariations: items, isLoading }),
        [items, isLoading]
    );

    return (
        <ProductVariationContext.Provider value={value}>
            {/* keep a stable flex box so the sheet layout never changes */}
            <ThemedYStack f={1} mih={0}>
                {children}
            </ThemedYStack>
        </ProductVariationContext.Provider>
    );
};
