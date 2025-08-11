// -----------------
// Base product context

import { DebugTrigger } from '@/components/debug/DebugTrigger';
import { DEBUG_PRODUCTS } from '@/config/app';
import { createPurchasable } from '@/models/Product/Purchasable';
import { ProductVariation, Purchasable, PurchasableProduct } from "@/types";
import { createContext, ReactNode, useContext, useMemo, useState } from 'react';



// Context for Purchasable
const PurchasableContext = createContext<{ purchasable: Purchasable; setProductVariation: (variation?: ProductVariation) => void } | undefined>(undefined);

// Hook to access PurchasableContext
export const usePurchasableContext = () => {
    const ctx = useContext(PurchasableContext);
    if (!ctx) throw new Error("usePurchasableContext must be used within a PurchasableProvider");
    return ctx;
};

// PurchasableProvider component
export const PurchasableProvider: React.FC<{ product: PurchasableProduct; productVariation?: ProductVariation; children: ReactNode }> = ({
    product,
    productVariation,
    children,
}) => {
    // Initialize purchasable state with the product and an optional variation
    const [purchasable, setPurchasable] = useState<Purchasable>(createPurchasable({ product, productVariation }));

    // Memoized context value, which includes purchasable and a function to set the product variation
    const contextValue = useMemo(() => ({
        purchasable,
        product,
        setProductVariation: (productVariation?: ProductVariation) => {

            if (productVariation !== purchasable.productVariation) {
                const updatedPurchasable = createPurchasable({ product, productVariation });
                setPurchasable(updatedPurchasable); // Update the purchasable with the selected variation
            }
        },
    }), [product, purchasable]);

    return (
        <PurchasableContext.Provider value={contextValue}>
            {children}{DEBUG_PRODUCTS ? <DebugTrigger product={product} /> : null}
        </PurchasableContext.Provider>
    );
};
