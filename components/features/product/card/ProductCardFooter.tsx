import { ThemedStackProps, ThemedYStack } from '@/components/ui/ThemedStack';
import { Purchasable } from '@/types';
import React from 'react';
import { PurchaseButton } from '../display/PurchaseButton';
import { ProductVariationsModal } from '../product-variation/ProductVariationsModal';



export const ProductCardFooter = ({ purchasable, stackProps }: { purchasable: Purchasable; stackProps?: ThemedStackProps }) => {

    return (
        <ThemedYStack p="none" {...stackProps}>
            {purchasable.product.type === "variable" && <ProductVariationsModal />}
            <PurchaseButton purchasable={purchasable} />
        </ThemedYStack>
    );
}



