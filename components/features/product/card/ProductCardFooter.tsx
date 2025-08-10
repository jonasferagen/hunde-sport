import { ThemedStackProps } from '@/components/ui/themed-components/ThemedStack';
import { usePurchasable } from '@/hooks/usePurchasable';
import React from 'react';
import { ProductStatus } from '../display/ProductStatus';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariationsButton } from '../product-variation/ProductVariationsButton';



export const ProductCardFooter = ({ stackProps }: { stackProps?: ThemedStackProps }) => {

    const { isValid, status } = usePurchasable();

    if (isValid) {
        return <PurchaseButton />;
    }

    if (status === "INVALID") {
        return <ProductStatus f={1} ta="right" />
    }

    if (status === "ACTION_NEEDED") {
        return <ProductVariationsButton />;
    }

}