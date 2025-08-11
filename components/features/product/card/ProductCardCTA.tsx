// ProductCTA.tsx
import { ProductVariationsButton } from '@/components/features/product/product-variation/ProductVariationsButton';
import { usePurchasable } from '@/hooks/usePurchasable';
import React from 'react';
import { PurchaseButton } from '../display/PurchaseButton';

export const ProductCardCTA = () => {
    const { status, isValid } = usePurchasable();

    const isVariable = status === 'ACTION_NEEDED';
    const disabled = status === 'INVALID';

    if (status === 'ACTION_NEEDED') {
        return <ProductVariationsButton />;
    }

    return <PurchaseButton disabled={disabled} />;
};
