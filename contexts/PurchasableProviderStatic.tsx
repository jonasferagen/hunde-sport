// PurchasableProviderStatic.tsx
import { createPurchasable } from '@/domain/Product/Purchasable';
import { ProductVariation, PurchasableProduct } from '@/types';
import React from 'react';
import { PurchasableContext } from './PurchasableContext'; // export your context itself

const NOOP = () => { };

export const PurchasableProviderStatic: React.FC<{
    product: PurchasableProduct;
    productVariation?: ProductVariation;
    children: React.ReactNode;
}> = ({ product, productVariation, children }) => {
    // compute once per (product, productVariation)
    const purchasable = React.useMemo(
        () => createPurchasable({ product, productVariation }),
        // depend on stable identifiers; adjust if you have hashes
        [product.id, productVariation?.id, product.priceKey, product.availabilityKey]
    );

    const value = React.useMemo(
        () => ({ purchasable, setProductVariation: NOOP }),
        [purchasable]
    );

    return (
        <PurchasableContext.Provider value={value}>
            {children}
        </PurchasableContext.Provider>
    );
};
