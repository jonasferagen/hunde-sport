// -----------------
// Variation context
// -----------------
import { useProductVariations } from '@/hooks/data/Product';
import { ProductVariation, VariableProduct } from "@/models/Product/Product";
import { createPurchasable } from '@/models/Product/Purchasable';
import { Purchasable } from "@/types";
import React, { createContext, useContext, useMemo } from 'react';

export interface ProductVariationContextType {
    selectedProductVariation: ProductVariation | undefined;
    setSelectedProductVariation: (variation: ProductVariation | undefined) => void;
    productVariations: ProductVariation[] | undefined;
    isLoading: boolean;
    purchasable: Purchasable;
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
    const { isLoading, items: variations } = useProductVariations(product);
    const [selected, setSelected] = React.useState<ProductVariation>();

    const purchasable = useMemo(
        () => createPurchasable({ product, productVariation: selected }),
        [product, selected]
    );

    return (
        <ProductVariationContext.Provider
            value={{
                isLoading,
                productVariations: variations,
                selectedProductVariation: selected,
                setSelectedProductVariation: setSelected,
                purchasable,
            }}
        >
            {children}
        </ProductVariationContext.Provider>
    );
};
