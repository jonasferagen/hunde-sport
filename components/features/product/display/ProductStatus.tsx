import { useProductContext } from '@/contexts';
import { Product } from '@/models/Product';
import { ProductVariation } from '@/types';
import React from 'react';
import { SizableText, XStack } from 'tamagui';


export const ProductStatus = ({ productOverride }: { productOverride?: Product | ProductVariation }) => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productOverride || productVariation || product;

    let color = 'gray';
    let text = activeProduct.stock_status;
    switch (activeProduct.stock_status) {
        case 'instock':
            color = 'green';
            text = 'På lager';
            break;
        case 'outofstock':
            color = 'red';
            text = 'Ikke på lager';
            break;
        case 'onbackorder':
            color = 'yellow';
            text = 'Bestilt';
            break;
    }


    return (
        <XStack gap="$1" ai="center">
            <SizableText color={color} fontSize="$2">⬤ {text}</SizableText>
        </XStack>
    );


};


