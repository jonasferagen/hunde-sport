import { useProductContext } from '@/contexts';
import { Product } from '@/models/Product';
import { ProductVariation } from '@/types';
import React from 'react';
import { SizableText, SizableTextProps, XStack, getThemes } from 'tamagui';


export const ProductStatus = ({ productOverride, showInStock = true, ...props }: { productOverride?: Product | ProductVariation, showInStock?: boolean } & SizableTextProps) => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productOverride || productVariation || product;
    const stock_status = activeProduct.stock_status;

    if (!showInStock && stock_status === 'instock') {
        return null;
    }

    const themes = getThemes();

    const green = themes.light_green_alt2?.color?.val;
    const red = themes.light_red_alt1?.color?.val;
    const yellow = themes.light_yellow_alt2?.color?.val;


    let color = 'gray';
    let text = stock_status;
    switch (stock_status) {
        case 'instock':
            color = green ?? 'green';
            text = 'På lager';
            break;
        case 'outofstock':
            color = red ?? 'red';
            text = 'Utsolgt';
            break;
        case 'onbackorder':
            color = yellow ?? 'yellow';
            text = 'Bestilt';
            break;
    }


    return (
        <XStack gap="$1" ai="center" >
            <SizableText fontSize="$3" fontWeight="bold" color={color} {...props}>⬤ {text}</SizableText>
        </XStack>
    );


};


