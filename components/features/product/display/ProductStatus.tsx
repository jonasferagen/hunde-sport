import { useProductContext, useShoppingCartContext } from '@/contexts';
import { Ban } from '@tamagui/lucide-icons';
import React from 'react';
import { SizableText, XStack } from 'tamagui';

interface ProductStatusProps {
    short?: boolean;
}
export const ProductStatus = ({ short = false }: ProductStatusProps) => {
    const { product, productVariant } = useProductContext();
    const { purchaseInfo } = useShoppingCartContext();

    const activeProduct = productVariant || product;

    if (!activeProduct) {
        return null;
    }

    const { status, msg, msgShort: shortMsg } = purchaseInfo(activeProduct);
    const message = short ? shortMsg : msg;

    if (status === 'outofstock') {
        return (
            <XStack alignItems="center" space="$2">
                <Ban color="$red10" size="$1" />
                <SizableText size="$2" fontWeight="bold" color="$red10">
                    {message}
                </SizableText>
            </XStack>
        );
    }

    return null;
};


