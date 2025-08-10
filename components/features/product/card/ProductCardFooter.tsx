import { ThemedStackProps, ThemedYStack } from '@/components/ui/themed-components/ThemedStack';
import { usePurchasable } from '@/hooks/usePurchasable';
import React from 'react';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariationsModal } from '../product-variation/ProductVariationsModal';



export const ProductCardFooter = ({ stackProps }: { stackProps?: ThemedStackProps }) => {

    const purchasable = usePurchasable();

    return (
        <ThemedYStack p="none" {...stackProps}>
            {purchasable.product.type === "variable" ? <ProductVariationsModal /> : <PurchaseButton />}
        </ThemedYStack>
    );
}



