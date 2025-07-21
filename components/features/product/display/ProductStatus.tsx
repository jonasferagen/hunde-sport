import { CustomText, Icon } from '@/components/ui';
import { Row } from '@/components/ui/layout';
import { useShoppingCartContext } from '@/contexts';
import { Product } from '@/models/Product';
import React from 'react';

interface ProductStatusProps {
    displayProduct: Product;
}

export const ProductStatus = ({ displayProduct }: ProductStatusProps) => {
    const { purchaseInfo } = useShoppingCartContext();
    const { status, msg } = purchaseInfo(displayProduct);

    if (status === 'outofstock') {
        return (
            <Row alignItems="center">
                <Icon name="outofstock" size="md" color='red' />
                <CustomText fontSize="sm" bold color='red'>{msg}</CustomText>
            </Row>
        );
    }

    return null;
};
