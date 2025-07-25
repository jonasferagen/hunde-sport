import { Product } from '@/models/Product';
import { ProductVariation } from '@/types';
import React from 'react';
import { SizableText, XStack } from 'tamagui';


export const ProductStatus = ({ activeProduct }: { activeProduct?: Product | ProductVariation }) => {

    if (!activeProduct) {
        return null;
    }

    if (activeProduct.stock_status === 'outofstock') {
        return (
            <XStack gap="$1" ai="center">
                <SizableText color="red" fontSize="$2">Utsolgt</SizableText>
            </XStack>
        );
    }

    return null;
};


