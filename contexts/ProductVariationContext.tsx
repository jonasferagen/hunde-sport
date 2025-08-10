// -----------------
// Variation context
// -----------------
import { useProductVariations } from '@/hooks/data/Product';
import { ProductVariation, PurchasableProduct } from "@/models/Product/Product";
import { createPurchasable } from '@/models/Product/Purchasable';
import { Purchasable } from "@/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

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

export const ProductVariationProvider: React.FC<{ product: PurchasableProduct; children: React.ReactNode }> = ({
    product,
    children,
}) => {
    const { isLoading, items: variations } = useProductVariations(product);
    const [selectedProductVariation, setSelectedProductVariation] = useState<ProductVariation | undefined>();

    // Reset when product changes
    useEffect(() => {
        setSelectedProductVariation(undefined);
    }, [product]);

    const productVariations = useMemo(() => {
        if (!variations) return [];
        if (variations.some(v => v.parent !== product.id)) {
            throw new Error(`Invalid variations for product ${product.id}`);
        }
        return variations;
    }, [variations, product.id]);

    const purchasable = useMemo(
        () => createPurchasable({ product, productVariation: selectedProductVariation }),
        [product, selectedProductVariation]
    );

    const value = useMemo(
        () => ({
            selectedProductVariation,
            setSelectedProductVariation,
            productVariations,
            isLoading,
            purchasable,
        }),
        [selectedProductVariation, productVariations, isLoading, purchasable]
    );

    return (
        <ProductVariationContext.Provider value={value}>
            {children}
        </ProductVariationContext.Provider>
    );
};
