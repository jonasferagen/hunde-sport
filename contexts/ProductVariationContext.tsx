// -----------------
// Variation context
// -----------------
import { ThemedSpinner } from '@/components/ui';
import { useProductVariations } from '@/hooks/data/Product';
import { ProductVariation, VariableProduct } from "@/models/Product/Product";
import React, { createContext, useContext } from 'react';

export interface ProductVariationContextType {
    //selectedProductVariation: ProductVariation | undefined;
    //setSelectedProductVariation: (variation: ProductVariation | undefined) => void;
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
    //    const [selected, setSelected] = React.useState<ProductVariation>();

    if (isLoading) {
        return <ThemedSpinner />;
    }

    return (
        <ProductVariationContext.Provider
            value={{
                productVariations,
                //             selectedProductVariation: selected,
                //           setSelectedProductVariation: setSelected,
            }}
        >
            {children}
        </ProductVariationContext.Provider>
    );
};

