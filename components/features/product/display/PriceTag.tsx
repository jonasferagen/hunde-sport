import { useProductContext } from '@/contexts';
import React, { JSX } from 'react';
import { SizableTextProps } from 'tamagui';
import { Price } from './Price';
import { PriceRange } from './PriceRange';


export const PriceTag = ({ size = "$3", ...props }: SizableTextProps): JSX.Element => {
    const { product, productVariation } = useProductContext();

    if (product.type === 'simple' || productVariation) {
        return <Price fontSize={size} {...props} />;
    }

    return <PriceRange productPriceRangeOverride={product?.prices.price_range} fontSize={size} />;
};
