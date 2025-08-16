// -----------------
// Variation context
// -----------------
import { ProductVariation, VariableProduct } from "@/domain/Product/Product";
import { useProductVariations } from '@/hooks/data/Product';
import { LoadingScreen } from '@/screens/misc/LoadingScreen';
import React, { createContext, useContext } from 'react';

export interface ProductVariationContextType {
    productVariations: ProductVariation[];

}

const ProductVariationContext = createContext<ProductVariationContextType | undefined>(undefined);

export const useProductVariationContext = () => {
    const ctx = useContext(ProductVariationContext);
    if (!ctx) throw new Error("useProductVariationContext must be used within a ProductVariationProvider");
    return ctx;
};

export const ProductVariationProvider: React.FC<{ product: VariableProduct; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const { isLoading, items: productVariations } = useProductVariations(product);


    if (isLoading) {
        return <LoadingScreen />;
    }

    return (
        <ProductVariationContext.Provider
            value={{
                productVariations,
            }}
        >
            {children}
        </ProductVariationContext.Provider>
    );
};

