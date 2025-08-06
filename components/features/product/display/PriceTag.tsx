import { useProductContext } from '@/contexts';
import { ProductVariation } from '@/types';
import React, { JSX } from 'react';
import { SizableTextProps } from 'tamagui';
import { Price } from './Price';
import { PriceRange } from './PriceRange';


export const PriceTag = ({ size = "$4", ...props }: SizableTextProps): JSX.Element => {
    const { product, displayProduct } = useProductContext();


    if (displayProduct instanceof ProductVariation) {
        return <Price fos={size} {...props} />;
    }


    return <PriceRange productPriceRangeOverride={product?.prices.price_range} fos={size} />;
};
