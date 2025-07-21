import { CustomText, Icon } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import { FONT_SIZES } from '@/styles';
import React from 'react';

interface ProductStatusProps {
    displayProduct: Product;
    fontSize?: keyof typeof FONT_SIZES;
}

export const ProductStatus = ({ displayProduct, fontSize = 'md' }: ProductStatusProps) => {
    const { purchaseInfo } = useShoppingCartContext();
    const { status, msg } = purchaseInfo(displayProduct);

    if (status === 'outofstock') {
        return (
            <Row alignItems="center">
                <Icon name="outofstock" size={fontSize} color='red' />
                <CustomText fontSize={fontSize} bold color='red'>{msg}</CustomText>
            </Row>
        );
    }

    if (status === 'variantneeded') {
        return (
            <Row alignItems="center">
                <Icon name="exclamation" size={fontSize} color='grey' />
                <CustomText fontSize={fontSize} bold color='grey'>{msg}</CustomText>
            </Row>
        );
    }

    return null;
};
