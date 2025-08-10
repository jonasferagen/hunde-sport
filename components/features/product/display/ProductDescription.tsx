import { useBaseProductContext } from '@/contexts/BaseProductContext';
import React from 'react';
import { SizableText, SizableTextProps } from 'tamagui';

interface ProductDescriptionProps extends SizableTextProps {
    short?: boolean;
}

export const ProductDescription = ({ short = true, ...sizableTextProps }: ProductDescriptionProps) => {

    const { product } = useBaseProductContext();

    return <SizableText
        {...sizableTextProps}
    >
        {short ? product.short_description : product.description}
    </SizableText>;
};