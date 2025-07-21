import { CustomText, Icon } from '@/components/ui';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import { FONT_SIZES } from '@/styles';
import React from 'react';
import { XStack } from 'tamagui';

interface ProductStatusProps {
    displayProduct: Product;
    fontSize?: keyof typeof FONT_SIZES;
    short?: boolean;
}
export const ProductStatus = ({ displayProduct, fontSize = 'md', short = false }: ProductStatusProps) => {


    const { purchaseInfo } = useShoppingCartContext();
    const { status, msg, msgShort: shortMsg } = purchaseInfo(displayProduct);
    const message = short ? shortMsg : msg;

    if (status === 'outofstock') {
        return <XStack alignItems="center">
            <Icon name="outofstock" size={fontSize} color='red' />
            <CustomText fontSize={fontSize} bold color='red'>{message}</CustomText>
        </XStack>;
    }

    if (status === 'variantneeded') {
        return (
            <XStack alignItems="center">

                <Icon name="exclamation" size={fontSize} color='grey' />
                <CustomText fontSize={fontSize} bold color='grey'>{message}</CustomText>
            </XStack>
        );
    }

    return null;
};


