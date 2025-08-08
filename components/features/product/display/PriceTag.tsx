import { useProductContext } from '@/contexts';
import { ProductVariation } from '@/types';
import React, { JSX } from 'react';
import { SizableTextProps } from 'tamagui';
import { Price } from './Price';
import { PriceRange } from './PriceRange';


export const PriceTag = ({ size = "$4", ...props }: SizableTextProps): JSX.Element => {
    const { purchasable } = useProductContext();
    const { product } = purchasable;


    const prices = product?.prices;

    if (purchasable instanceof ProductVariation) {
        return <Price fos={size} {...props} />;
    }


    return <PriceRange productPriceRangeOverride={prices.price_range} fos={size} />;
};
