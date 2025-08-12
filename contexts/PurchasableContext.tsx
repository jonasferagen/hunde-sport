// -----------------
// Base product context

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


export const PurchasableProviderInit: React.FC<{ product: PurchasableProduct; productVariation?: ProductVariation; children: ReactNode }> = ({
    product,
    productVariation,
    children,
}) => {
    const purchasable = createPurchasable({ product, productVariation });
    return (
        <PurchasableProvider purchasable={purchasable} children={children} />
    );
}

// PurchasableProvider component
export const PurchasableProvider: React.FC<{ purchasable: Purchasable; children: ReactNode }> = ({
    purchasable: initialPurchasable,
    children,
}) => {


    const [purchasable, setPurchasable] = useState<Purchasable>(initialPurchasable);
    if (!purchasable?.product) {
        console.error("PurchasableProvider must be used with a valid Purchasable", purchasable);
        throw new Error("PurchasableProvider must be used with a valid Purchasable");
    }

    // Memoized context value, which includes purchasable and a function to set the product variation
    const contextValue = useMemo(() => ({
        purchasable,
        setProductVariation: (productVariation?: ProductVariation) => {

            if (productVariation !== purchasable.productVariation) {
                const updatedPurchasable = createPurchasable({ product: purchasable.product, productVariation });
                setPurchasable(updatedPurchasable); // Update the purchasable with the selected variation
            }
        },
    }), [purchasable]);

    return (
        <PurchasableContext.Provider value={contextValue}>
            {children}
        </PurchasableContext.Provider>
    );
};
