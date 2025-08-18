// -----------------
// Base product context

import { createPurchasable } from '@/domain/Product/Purchasable';
import { ProductVariation, Purchasable, PurchasableProduct } from "@/types";
import React, { createContext, useContext } from 'react';

// Context for Purchasable
export const PurchasableContext = createContext<{ purchasable: Purchasable; setProductVariation: (variation?: ProductVariation) => void } | undefined>(undefined);

// Hook to access PurchasableContext
export const usePurchasableContext = () => {
    const ctx = useContext(PurchasableContext);
    if (!ctx) throw new Error("usePurchasableContext must be used within a PurchasableProvider");
    return ctx;
};

// PurchasableProviderInit.tsx
export const PurchasableProviderInit: React.FC<{
    product: PurchasableProduct;
    productVariation?: ProductVariation;
    children: React.ReactNode;
}> = ({ product, productVariation, children }) => {
    const purchasable = React.useMemo(
        () => createPurchasable({ product, productVariation }),
        [product.id, productVariation?.id, product.priceKey, product.availabilityKey]
    );
    return <PurchasableProvider purchasable={purchasable}>{children}</PurchasableProvider>;
};

// PurchasableProvider component
// PurchasableProvider.tsx
export const PurchasableProvider: React.FC<{
    purchasable: Purchasable;
    children: React.ReactNode;
}> = ({ purchasable: initialPurchasable, children }) => {
    const [purchasable, setPurchasable] = React.useState(initialPurchasable);

    // keep state in sync if the prop changes (e.g., new product id)
    React.useEffect(() => {
        if (purchasable.product.id !== initialPurchasable.product.id ||
            purchasable.productVariation?.id !== initialPurchasable.productVariation?.id) {
            setPurchasable(initialPurchasable);
        }
    }, [initialPurchasable, purchasable.product.id, purchasable.productVariation?.id]);

    const setProductVariation = React.useCallback((productVariation?: ProductVariation) => {
        if (productVariation !== purchasable.productVariation) {
            setPurchasable(createPurchasable({ product: purchasable.product, productVariation }));
        }
    }, [purchasable.product, purchasable.productVariation]);

    const contextValue = React.useMemo(
        () => ({ purchasable, setProductVariation }),
        [purchasable, setProductVariation]
    );

    return (
        <PurchasableContext.Provider value={contextValue}>
            {children}
        </PurchasableContext.Provider>
    );
};
