import { useProductContext } from '@/contexts';
import { Product } from '@/models/Product';
import { ProductVariation } from '@/types';
import React from 'react';
import { SizableText, SizableTextProps, XStack } from 'tamagui';


export const ProductStatus = ({ productOverride, showInStock = true, ...props }: { productOverride?: Product | ProductVariation, showInStock?: boolean } & SizableTextProps) => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productOverride || productVariation || product;
    const stock_status = activeProduct.stock_status;

    if (!showInStock && stock_status === 'instock') {
        return null;
    }
    let color = 'gray';
    let text = stock_status;
    switch (stock_status) {
        case 'instock':
            color = 'green';
            text = 'På lager';
            break;
        case 'outofstock':
            color = 'red';
            text = 'Utsolgt';
            break;
        case 'onbackorder':
            color = 'yellow';
            text = 'Bestilt';
            break;
    }


    return (
        <XStack gap="$1" ai="center" >

            <SizableText fontSize="$3" color={color} {...props}>⬤ {text}</SizableText>
        </XStack>
    );


};


