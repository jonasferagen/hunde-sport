import { useProductContext } from '@/contexts';
import { Product } from '@/models/Product/Product';
import { ProductVariation } from '@/models/Product/ProductVariation';

import React from 'react';
import { SizableText, SizableTextProps, XStack, getThemes } from 'tamagui';


export const ProductStatus = ({ productOverride, showInStock = true, ...props }: { productOverride?: Product | ProductVariation, showInStock?: boolean } & SizableTextProps) => {

    const { product, productVariation } = useProductContext();
    const activeProduct = productOverride || productVariation || product;
    const stock_status = activeProduct.is_in_stock;

    const themes = getThemes();

    const green = themes.light_green_alt2?.color?.val;
    const red = themes.light_red_alt1?.color?.val;

    const color = stock_status ? green : red;
    const text = stock_status ? 'På lager' : 'Utsolgt';


    return (
        <XStack gap="$1" ai="center" >
            <SizableText fos="$3" fow="bold" col={color} {...props}>⬤ {text}</SizableText>
        </XStack>
    );


};


