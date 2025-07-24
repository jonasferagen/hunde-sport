import { CustomText, Icon } from '@/components/ui';
import { useProductContext, useShoppingCartContext } from '@/contexts';
import { FONT_SIZES } from '@/styles';
import React from 'react';
import { XStack } from 'tamagui';

interface ProductStatusProps {
    fontSize?: keyof typeof FONT_SIZES;
    short?: boolean;
}
export const ProductStatus = ({ fontSize = 'md', short = false }: ProductStatusProps) => {
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
            <XStack alignItems="center">
                <Icon name="outofstock" size={fontSize} color="red" />
                <CustomText fontSize={fontSize} bold color="red">
                    {message}
                </CustomText>
            </XStack>
        );
    }

    return null;
};


