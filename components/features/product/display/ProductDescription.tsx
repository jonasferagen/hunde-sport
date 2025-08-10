import { Product } from '@/types';
import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

interface ProductDescriptionProps extends SizableTextProps {
    short?: boolean;
    product: Product;
}

export const ProductDescription = ({ short = true, product, ...sizableTextProps }: ProductDescriptionProps) => {

    return <SizableText
        {...sizableTextProps}
    >
        {short ? product.short_description : product.description}
    </SizableText>;
};